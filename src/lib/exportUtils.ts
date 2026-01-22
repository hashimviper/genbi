import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function getThemeBackgroundColor(): string {
  // Tokens are stored as raw HSL values (e.g. "220 25% 97%"), so wrap them.
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--background')
    .trim();
  return bg ? `hsl(${bg})` : '#ffffff';
}

function getOpenDialogElement(): HTMLElement | null {
  // If a chart-level fullscreen Dialog is open, capture that instead of the dashboard canvas.
  // Radix Dialog renders via a portal; role="dialog" is the most stable selector.
  const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][data-state="open"], [role="dialog"]'))
    .filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });

  if (dialogs.length === 0) return null;

  // Prefer the last one (top-most).
  return dialogs[dialogs.length - 1] ?? null;
}

async function captureElementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  // html2canvas often only captures the visible part of scrollable containers.
  // Temporarily expand overflow to capture full content, then restore.
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

export async function exportToPNG(elementId: string, filename: string = 'dashboard'): Promise<void> {
  const element = getOpenDialogElement() ?? document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await captureElementToCanvas(element);

  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportToPDF(elementId: string, filename: string = 'dashboard'): Promise<void> {
  const element = getOpenDialogElement() ?? document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await captureElementToCanvas(element);

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Calculate PDF dimensions (A4 or custom based on content)
  const pdfWidth = 297; // A4 width in mm (landscape)
  const pdfHeight = 210; // A4 height in mm (landscape)
  
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
  pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function exportToJSON(data: unknown, filename: string = 'dashboard-data'): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}
