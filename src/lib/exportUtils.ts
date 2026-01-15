import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPNG(elementId: string, filename: string = 'dashboard'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
  });

  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportToPDF(elementId: string, filename: string = 'dashboard'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
  });

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
