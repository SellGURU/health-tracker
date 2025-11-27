import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpdateAvailableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  downloadLink?: string;
  playStoreLink?: string;
}

export function UpdateAvailableModal({
  open,
  onOpenChange,
  downloadLink,
  playStoreLink,
}: UpdateAvailableModalProps) {
  const handleDownload = () => {
    if (downloadLink) {
      window.open(downloadLink, "_blank");
    }
  };

  const handlePlayStore = () => {
    if (playStoreLink) {
      window.open(playStoreLink, "_blank");
    } else {
      // Fallback to generic Play Store search if no link provided
      window.open("https://play.google.com/store/apps", "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Version Available</DialogTitle>
          <DialogDescription>
            A new version of the application is available. Please update the
            app to access new features and improved performance.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {playStoreLink && (
            <Button
              onClick={handlePlayStore}
              className="w-full sm:w-auto"
            >
              Download from Play Store
            </Button>
          )}
          {downloadLink && (
            <Button
              onClick={handleDownload}
              variant={playStoreLink ? "outline" : "default"}
              className="w-full sm:w-auto"
            >
              Download New Version
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

