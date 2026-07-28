import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/use-network-status";

/** Compact banner when connectivity drops while the app shell is already visible. */
export default function OfflineBanner() {
  const { isOffline, checking } = useNetworkStatus();

  if (checking || !isOffline) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 bg-amber-500 px-3 py-1.5 text-center text-xs font-medium text-white">
      <WifiOff className="h-3.5 w-3.5 flex-shrink-0" />
      <span>You're offline. Some features may be unavailable.</span>
    </div>
  );
}
