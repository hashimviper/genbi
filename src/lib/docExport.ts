/**
 * Documentation Export Utility
 * Downloads USER_MANUAL.md and REPORT.md as text files
 */

import userManualContent from './docs/userManual?raw';
import reportContent from './docs/report?raw';

export function downloadUserManual(): void {
  downloadTextFile(userManualContent, 'VisoryBI_User_Manual.md', 'text/markdown');
}

export function downloadReport(): void {
  downloadTextFile(reportContent, 'VisoryBI_Technical_Report.md', 'text/markdown');
}

export function downloadAllDocs(): void {
  downloadUserManual();
  setTimeout(() => downloadReport(), 500);
}

function downloadTextFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
