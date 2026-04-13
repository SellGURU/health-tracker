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

  initializingPromise = (async () => {
    await RookConfig.initRook({
      environment: ROOK_ENVIRONMENT,
      clientUUID: ROOK_CLIENT_UUID,
      password: ROOK_PASSWORD,
      bundleId: ROOK_IOS_BUNDLE_ID,
      packageName: ROOK_ANDROID_PACKAGE_NAME,
      enableBackgroundSync,
      enableEventsBackgroundSync,
    });

    await RookConfig.updateUserId({ userId });
    initializedConfigKey = configKey;
  })();

  try {
    await initializingPromise;
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

export async function enablePlatformBackgroundSync(): Promise<void> {
  if (isAndroidRookPlatform()) {
    await RookPermissions.requestAndroidBackgroundPermissions();
    await RookHealthConnect.scheduleHealthConnectBackGround();
    await RookHealthConnect.scheduleYesterdaySync({
      doOnEnd: "oldest",
    });
    return;
  }

  if (isIOSRookPlatform()) {
    await RookAppleHealth.enableBackGroundUpdates();
    await RookAppleHealth.enableBackGroundEventsUpdates();
  }
}

export async function syncRookSummaries(): Promise<void> {
  if (!isRookSummarySyncSupported()) {
    return;
  }

  await RookSummaries.sync({});
}
