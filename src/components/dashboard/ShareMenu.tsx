import { useState } from 'react';
import { Share2, FileImage, FileText, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { shareElement } from '@/lib/shareUtils';
import { toast } from '@/hooks/use-toast';

interface ShareMenuProps {
  elementId: string;
  dashboardName: string;
  dashboardId?: string;
}

export function ShareMenu({ elementId, dashboardName, dashboardId }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  const handleSharePNG = async () => {
    try {
      await shareElement({
        format: 'png',
        elementId,
        filename: dashboardName.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
      });
      toast({
        title: 'Shared as PNG',
        description: 'Dashboard has been shared successfully.',
      });
    } catch (error) {
      toast({
        title: 'Share failed',
        description: 'Could not share dashboard as PNG.',
        variant: 'destructive',
      });
    }
  };

  const handleSharePDF = async () => {
    try {
      await shareElement({
        format: 'pdf',
        elementId,
        filename: dashboardName.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
      });
      toast({
        title: 'Shared as PDF',
        description: 'Dashboard has been shared successfully.',
      });
    } catch (error) {
      toast({
        title: 'Share failed',
        description: 'Could not share dashboard as PDF.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyViewLink = async () => {
    try {
      // Generate a /view/ link that preserves dashboard state
      let shareUrl = window.location.href;
      
      if (dashboardId) {
        const baseUrl = window.location.origin;
        shareUrl = `${baseUrl}/view/${dashboardId}`;
      }
      
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link copied',
        description: 'Dashboard view link copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Share Dashboard</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSharePNG}>
          <FileImage className="mr-2 h-4 w-4" />
          Share as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSharePDF}>
          <FileText className="mr-2 h-4 w-4" />
          Share as PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyViewLink}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-primary" />
          ) : (
            <LinkIcon className="mr-2 h-4 w-4" />
          )}
          Copy View Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
