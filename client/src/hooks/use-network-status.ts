import { useCallback, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";

export type NetworkStatus = {
  connected: boolean;
  connectionType: string;
};

async function readNetworkStatus(): Promise<NetworkStatus> {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await Network.getStatus();
      return {
        connected: status.connected,
        connectionType: status.connectionType,
      };
    } catch {
      // Fall through to browser API
    }
  }

  return {
    connected: typeof navigator === "undefined" ? true : navigator.onLine,
    connectionType: "unknown",
  };
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    connected: typeof navigator === "undefined" ? true : navigator.onLine,
    connectionType: "unknown",
  });
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      const next = await readNetworkStatus();
      setStatus(next);
      return next;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let removeNativeListener: (() => void) | undefined;

    void (async () => {
      const initial = await readNetworkStatus();
      if (!cancelled) {
        setStatus(initial);
        setChecking(false);
      }

      if (Capacitor.isNativePlatform()) {
        try {
          const handle = await Network.addListener(
            "networkStatusChange",
            (next) => {
              if (!cancelled) {
                setStatus({
                  connected: next.connected,
                  connectionType: next.connectionType,
                });
              }
            },
          );
          removeNativeListener = () => {
            void handle.remove();
          };
        } catch {
          // Ignore native listener failures
        }
      }
    })();

    const handleOnline = () => {
      if (!cancelled) {
        setStatus((prev) => ({ ...prev, connected: true }));
      }
    };
    const handleOffline = () => {
      if (!cancelled) {
        setStatus((prev) => ({ ...prev, connected: false }));
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      cancelled = true;
      removeNativeListener?.();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    ...status,
    isOnline: status.connected,
    isOffline: !status.connected,
    checking,
    refresh,
  };
}
