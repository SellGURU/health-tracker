import OfflineScreen from "@/components/OfflineScreen";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { Loader2 } from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

type BootPhase = "booting" | "offline" | "ready";

type BootGateProps = {
  children: ReactNode;
};

export default function BootGate({ children }: BootGateProps) {
  const { isOnline, checking, refresh } = useNetworkStatus();
  const [phase, setPhase] = useState<BootPhase>("booting");
  const [retrying, setRetrying] = useState(false);
  const splashHiddenRef = useRef(false);
  const hasReachedReadyRef = useRef(false);

  const hideSplash = useCallback(async () => {
    if (splashHiddenRef.current) return;
    splashHiddenRef.current = true;
    if (!Capacitor.isNativePlatform()) return;
    try {
      await SplashScreen.hide();
    } catch {
      // Splash plugin may be unavailable on web builds
    }
  }, []);

  useEffect(() => {
    if (checking && phase === "booting") {
      return;
    }

    // After first successful boot, keep the shell mounted (banner handles mid-session offline).
    if (hasReachedReadyRef.current) {
      return;
    }

    if (!isOnline) {
      setPhase("offline");
      void hideSplash();
      return;
    }

    hasReachedReadyRef.current = true;
    setPhase("ready");
    void hideSplash();
  }, [checking, isOnline, phase, hideSplash]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const next = await refresh();
      if (next.connected) {
        hasReachedReadyRef.current = true;
        setPhase("ready");
      } else {
        setPhase("offline");
      }
    } finally {
      setRetrying(false);
      void hideSplash();
    }
  };

  if (phase === "booting") {
    return (
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (phase === "offline") {
    return (
      <OfflineScreen
        onRetry={() => {
          void handleRetry();
        }}
        retrying={retrying}
      />
    );
  }

  return <>{children}</>;
}
