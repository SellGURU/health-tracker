import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { openExternalUrl } from "@/lib/open-external-url";

interface UnsupportedVersionModalProps {
  open: boolean;
  downloadLink?: string;
  playStoreLink?: string;
}

export function UnsupportedVersionModal({
  open,
  downloadLink,
  playStoreLink,
}: UnsupportedVersionModalProps) {
  const handleDownload = () => {
    if (downloadLink) {
      void openExternalUrl(downloadLink);
    }
  };

  const handlePlayStore = () => {
    if (playStoreLink) {
      void openExternalUrl(playStoreLink);
    } else {
      // Fallback to generic Play Store search if no link provided
      void openExternalUrl("https://play.google.com/store/apps");
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Your Version is Not Supported</AlertDialogTitle>
          <AlertDialogDescription>
            Your current app version is no longer supported. Please download
            and install the new version to continue using the application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          {playStoreLink && (
            <Button onClick={handlePlayStore} className="w-full">
              Download from Play Store
            </Button>
          )}
          {downloadLink && (
            <Button
              onClick={handleDownload}
              variant={playStoreLink ? "outline" : "default"}
              className="w-full"
            >
              Download New Version
            </Button>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

