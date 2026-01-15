import { Download, FileImage, FileText, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { exportToPNG, exportToPDF, exportToJSON } from '@/lib/exportUtils';
import { toast } from '@/hooks/use-toast';

interface ExportMenuProps {
  elementId: string;
  dashboardName: string;
  dashboardData?: unknown;
}

export function ExportMenu({ elementId, dashboardName, dashboardData }: ExportMenuProps) {
  const handleExportPNG = async () => {
    try {
      await exportToPNG(elementId, dashboardName);
      toast({
        title: 'Exported to PNG',
        description: 'Dashboard has been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export dashboard to PNG.',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(elementId, dashboardName);
      toast({
        title: 'Exported to PDF',
        description: 'Dashboard has been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export dashboard to PDF.',
        variant: 'destructive',
      });
    }
  };

  const handleExportJSON = async () => {
    if (dashboardData) {
      try {
        await exportToJSON(dashboardData, dashboardName);
        toast({
          title: 'Exported to JSON',
          description: 'Dashboard data has been exported successfully.',
        });
      } catch (error) {
        toast({
          title: 'Export failed',
          description: 'Could not export dashboard data.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPNG}>
          <FileImage className="mr-2 h-4 w-4" />
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportJSON} disabled={!dashboardData}>
          <FileJson className="mr-2 h-4 w-4" />
          Export Data (JSON)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
