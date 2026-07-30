import { Capacitor } from "@capacitor/core";
import {
  RookAppleHealth,
  RookConfig,
  RookHealthConnect,
  RookPermissions,
  RookSummaries,
} from "capacitor-rook-sdk";

export const ROOK_ENVIRONMENT = "production";
export const ROOK_CLIENT_UUID = "c2f4961b-9d3c-4ff0-915e-f70655892b89";
export const ROOK_PASSWORD = "QH8u18OjLofsSRvmEDmGBgjv1frp3fapdbDA";
export const ROOK_IOS_BUNDLE_ID = "com.innovatifyltd.holisticare";
export const ROOK_ANDROID_PACKAGE_NAME = "com.innovatifyltd";
export const ROOK_BASIC_AUTH = `Basic ${btoa(`${ROOK_CLIENT_UUID}:${ROOK_PASSWORD}`)}`;

type InitializeRookOptions = {
  userId: string;
  enableBackgroundSync?: boolean;
  enableEventsBackgroundSync?: boolean;
};

let initializedConfigKey: string | null = null;
let initializingPromise: Promise<void> | null = null;

/** Clear cached init so a failed attempt can be retried. */
export function resetRookInitialization(): void {
  initializedConfigKey = null;
  initializingPromise = null;
}

export function isNativeRookPlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export function isIOSRookPlatform(): boolean {
  return isNativeRookPlatform() && Capacitor.getPlatform() === "ios";
}

export function isAndroidRookPlatform(): boolean {
  return isNativeRookPlatform() && Capacitor.getPlatform() === "android";
}

export function isRookSummarySyncSupported(): boolean {
  // The installed iOS plugin exposes background update APIs but does not
  // implement the Capacitor "sync" selector used by RookSummaries.sync({}).
  return isNativeRookPlatform() && !isIOSRookPlatform();
}

export function getPlatformHealthSourceName(): string {
  return isIOSRookPlatform() ? "Apple Health" : "Health Connect";
}

export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s. Please try again.`));
      }, ms);
    }),
  ]);
}

export async function initializeRookForUser({
  userId,
  enableBackgroundSync = true,
  enableEventsBackgroundSync = true,
}: InitializeRookOptions): Promise<void> {
  if (!isNativeRookPlatform() || !userId) {
    return;
  }

  const configKey = JSON.stringify({
    userId,
    platform: Capacitor.getPlatform(),
    enableBackgroundSync,
    enableEventsBackgroundSync,
  });

  if (initializedConfigKey === configKey) {
    return;
  }

  if (initializingPromise) {
    await initializingPromise;
    if (initializedConfigKey === configKey) {
      return;
    }
  }

  // capacitor-rook-sdk@0.5.1 (working iOS build) uses `password`, not `secret`.
  initializingPromise = (async () => {
    await RookConfig.initRook({
      environment: ROOK_ENVIRONMENT,
      clientUUID: ROOK_CLIENT_UUID,
      password: ROOK_PASSWORD,
      bundleId: ROOK_IOS_BUNDLE_ID,
      packageName: ROOK_ANDROID_PACKAGE_NAME,
      enableBackgroundSync,
      enableEventsBackgroundSync,
    } as any);

    await RookConfig.updateUserId({ userId });
    initializedConfigKey = configKey;
  })();

  try {
    await initializingPromise;
  } catch (error) {
    resetRookInitialization();
    throw error;
  } finally {
    initializingPromise = null;
  }
}

export async function requestPlatformHealthPermissions(): Promise<void> {
  if (isAndroidRookPlatform()) {
    await RookPermissions.requestAndroidPermissions();
    await RookPermissions.requestAllHealthConnectPermissions();
    return;
  }

  if (isIOSRookPlatform()) {
    await RookPermissions.requestAllAppleHealthPermissions();
  }
}

export type BackgroundSyncResult = {
  backgroundSyncEnabled: boolean;
  /** Raw Health Connect "read data in background" status, when available. */
  backgroundReadStatus?: string;
  /** Present when scheduling failed; the flow is still allowed to continue. */
  error?: string;
};

export async function enablePlatformBackgroundSync(options?: {
  scheduleYesterday?: boolean;
}): Promise<BackgroundSyncResult> {
  if (isAndroidRookPlatform()) {
    // NOTE: `requestAndroidBackgroundPermissions` is a deprecated alias for
    // `requestAndroidPermissions` in capacitor-rook-sdk@0.5.1 - it does NOT
    // request/grant Health Connect's special "read data in background"
    // permission. We call it anyway (harmless) but rely on
    // `checkBackgroundReadStatus` for the real signal.
    await RookPermissions.requestAndroidBackgroundPermissions().catch(() => undefined);

    let backgroundReadStatus: string | undefined;
    try {
      const statusResult = await RookHealthConnect.checkBackgroundReadStatus();
      backgroundReadStatus = (statusResult as any)?.result;
      console.log("[Rook] Health Connect background read status:", backgroundReadStatus);
    } catch (error) {
      console.warn("[Rook] Could not read Health Connect background status:", error);
    }

    let backgroundSyncEnabled = false;
    let error: string | undefined;
    try {
      await RookHealthConnect.scheduleHealthConnectBackGround();
      backgroundSyncEnabled = true;
    } catch (e: any) {
      error = e?.message || String(e);
      console.error("[Rook] scheduleHealthConnectBackGround failed (non-blocking):", e);
    }

    if (options?.scheduleYesterday !== false) {
      try {
        await RookHealthConnect.scheduleYesterdaySync({
          doOnEnd: "oldest",
        });
      } catch (e) {
        console.warn("[Rook] scheduleYesterdaySync failed (non-blocking):", e);
      }
    }

    return { backgroundSyncEnabled, backgroundReadStatus, error };
  }

  if (isIOSRookPlatform()) {
    await RookAppleHealth.enableBackGroundUpdates();
    await RookAppleHealth.enableBackGroundEventsUpdates();
  }

  return { backgroundSyncEnabled: true };
}

export async function syncRookSummaries(): Promise<void> {
  if (!isRookSummarySyncSupported()) {
    return;
  }

  await RookSummaries.sync({});
}
