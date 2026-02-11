import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function getThemeBackgroundColor(): string {
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--background')
    .trim();
  return bg ? `hsl(${bg})` : '#ffffff';
}

function getOpenDialogElement(): HTMLElement | null {
  const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][data-state="open"], [role="dialog"]'))
    .filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
  if (dialogs.length === 0) return null;
  return dialogs[dialogs.length - 1] ?? null;
}

async function captureElementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  const previous = {
    overflow: element.style.overflow,
    overflowX: element.style.overflowX,
    overflowY: element.style.overflowY,
  };

  element.style.overflow = 'visible';
  element.style.overflowX = 'visible';
  element.style.overflowY = 'visible';

  try {
    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: getThemeBackgroundColor(),
      width: Math.max(element.scrollWidth, element.clientWidth),
      height: Math.max(element.scrollHeight, element.clientHeight),
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
    });
  } finally {
    element.style.overflow = previous.overflow;
    element.style.overflowX = previous.overflowX;
    element.style.overflowY = previous.overflowY;
  }
}

export interface ShareOptions {
  format: 'png' | 'pdf';
  elementId: string;
  filename: string;
}

export async function shareElement(options: ShareOptions): Promise<void> {
  const { format, elementId, filename } = options;
  const element = getOpenDialogElement() ?? document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Element not found for sharing');
  }

  const canvas = await captureElementToCanvas(element);

  if (format === 'png') {
    await sharePNG(canvas, filename);
  } else if (format === 'pdf') {
    await sharePDF(canvas, filename);
  }
}

async function sharePNG(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });

  if (!blob) {
    throw new Error('Failed to create PNG blob');
  }

  const file = new File([blob], `${filename}.png`, { type: 'image/png' });

  // Try native share API first
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: filename,
        text: `Shared from VisoryBI Dashboard`,
      });
      return;
    } catch (error) {
      // User cancelled or share failed, fallback to download
      if ((error as Error).name === 'AbortError') return;
    }
  }

  // Fallback: Download the file
  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function sharePDF(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const pdfWidth = 297;
  const pdfHeight = 210;
  
  const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
  const scaledWidth = imgWidth * 0.264583 * ratio;
  const scaledHeight = imgHeight * 0.264583 * ratio;

  const pdf = new jsPDF({
    orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const xOffset = (pdf.internal.pageSize.getWidth() - scaledWidth) / 2;
  const yOffset = (pdf.internal.pageSize.getHeight() - scaledHeight) / 2;

  pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
  
  const pdfBlob = pdf.output('blob');
  const file = new File([pdfBlob], `${filename}.pdf`, { type: 'application/pdf' });

  // Try native share API first
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: filename,
        text: `Shared from VisoryBI Dashboard`,
      });
      return;
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
    }
  }

  // Fallback: Download the file
  pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function shareChartAsPNG(chartElement: HTMLElement, title: string): Promise<void> {
  const canvas = await captureElementToCanvas(chartElement);

  await sharePNG(canvas, title.replace(/[^a-z0-9]/gi, '-').toLowerCase());
}

export async function shareChartAsPDF(chartElement: HTMLElement, title: string): Promise<void> {
  const canvas = await captureElementToCanvas(chartElement);

  await sharePDF(canvas, title.replace(/[^a-z0-9]/gi, '-').toLowerCase());
}

// Share state encoding/decoding for share-by-link feature
export interface DashboardShareState {
  dashboardId?: string;
  datasetId?: string;
  filters?: Record<string, unknown>;
  drillState?: Record<string, unknown>;
}

export function encodeShareState(state: DashboardShareState): string {
  try {
    const json = JSON.stringify(state);
    return btoa(encodeURIComponent(json));
  } catch (error) {
    console.error('Failed to encode share state:', error);
    return '';
  }
}

export function decodeShareState(encoded: string): DashboardShareState | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to decode share state:', error);
    return null;
  }
}
