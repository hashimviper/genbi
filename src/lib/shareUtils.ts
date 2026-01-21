import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ShareOptions {
  format: 'png' | 'pdf';
  elementId: string;
  filename: string;
}

export async function shareElement(options: ShareOptions): Promise<void> {
  const { format, elementId, filename } = options;
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Element not found for sharing');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
  });

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
  const canvas = await html2canvas(chartElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
  });

  await sharePNG(canvas, title.replace(/[^a-z0-9]/gi, '-').toLowerCase());
}

export async function shareChartAsPDF(chartElement: HTMLElement, title: string): Promise<void> {
  const canvas = await html2canvas(chartElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
  });

  await sharePDF(canvas, title.replace(/[^a-z0-9]/gi, '-').toLowerCase());
}
