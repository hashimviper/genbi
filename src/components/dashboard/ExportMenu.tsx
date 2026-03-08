import { Download, FileImage, FileText, FileJson, Presentation, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { exportToPNG, exportToPDF, exportToJSON } from '@/lib/exportUtils';
import { exportToPPTX } from '@/lib/pptxExport';
import { toast } from '@/hooks/use-toast';

interface ExportMenuProps {
  elementId: string;
  dashboardName: string;
  dashboardData?: unknown;
  widgetTitles?: string[];
}

export function ExportMenu({ elementId, dashboardName, dashboardData, widgetTitles }: ExportMenuProps) {
  const handleExportPNG = async () => {
    try {
      await exportToPNG(elementId, dashboardName);
      toast({ title: 'Exported to PNG', description: 'Dashboard has been exported successfully.' });
    } catch {
      toast({ title: 'Export failed', description: 'Could not export dashboard to PNG.', variant: 'destructive' });
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(elementId, dashboardName);
      toast({ title: 'Exported to PDF', description: 'Dashboard has been exported successfully.' });
    } catch {
      toast({ title: 'Export failed', description: 'Could not export dashboard to PDF.', variant: 'destructive' });
    }
  };

  const handleExportJSON = async () => {
    if (dashboardData) {
      try {
        await exportToJSON(dashboardData, dashboardName);
        toast({ title: 'Exported to JSON', description: 'Dashboard data has been exported successfully.' });
      } catch {
        toast({ title: 'Export failed', description: 'Could not export dashboard data.', variant: 'destructive' });
      }
    }
  };

  const handleExportPPTX = async () => {
    try {
      await exportToPPTX(elementId, dashboardName, widgetTitles || []);
      toast({ title: 'Exported to PowerPoint', description: 'Each widget is now a slide in your PPTX file.' });
    } catch {
      toast({ title: 'Export failed', description: 'Could not export to PowerPoint.', variant: 'destructive' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPNG}>
          <FileImage className="mr-2 h-4 w-4" /> Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4" /> Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPPTX}>
          <Presentation className="mr-2 h-4 w-4" /> Export as PPTX
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportJSON} disabled={!dashboardData}>
          <FileJson className="mr-2 h-4 w-4" /> Export Data (JSON)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
