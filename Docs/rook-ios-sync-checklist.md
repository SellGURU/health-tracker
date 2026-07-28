# ROOK iOS Sync Checklist

## Apple Health 401 fix (current)

Use **`capacitor-rook-sdk@0.5.1`** with `password:` in `initRook` (same as the working `ios` branch). Do **not** use SDK 4.x/`secret` until Rook Portal + native RookSDK 4.1.0 are fully aligned.

On a Mac:

```bash
npm install --legacy-peer-deps
npm run build
npx cap sync ios
cd ios/App
rm -rf Pods Podfile.lock
pod install --repo-update
```

Confirm `Podfile.lock` shows `CapacitorRookSdk (0.5.1)` and `RookSDK (1.7.8)`, then Xcode → Clean Build Folder → new archive.

## What Changed

- ROOK now initializes at app startup for authenticated native sessions.
- The iOS bundle id and Android package name are passed explicitly to ROOK.
- Apple Health background sync is enabled from the shared app bootstrap and again after the user grants permissions.
- The native iOS app now registers `RookBackGroundSync.shared.setBackListeners()` in `AppDelegate`.
- `Info.plist` now includes `UIBackgroundModes` with `fetch`.
- The Devices screen now exposes a manual `Sync Now` fallback.

## iPhone Verification Checklist

1. Install the updated iOS build on a physical iPhone.
2. Log in with a user that has a valid `clientInformation.id`.
3. Open the Devices screen and connect `Apple Health`.
4. Accept Apple Health permissions when prompted.
5. Confirm the card changes to `Connected`.
6. Tap `Sync Now` once and confirm the success toast appears.
7. Add or update sample Apple Health data on the device.
8. Reopen the app and confirm no connection error appears.
9. Leave the app in the background for a while, then reopen it.
10. Confirm new Apple Health data appears in ROOK or in your downstream webhook processing.

## Native iOS Items To Confirm In Xcode

- `HealthKit` capability is enabled.
- `com.apple.developer.healthkit` is enabled in entitlements.
- `com.apple.developer.healthkit.background-delivery` is enabled in entitlements.
- `UIBackgroundModes` contains `fetch`.
- `AppDelegate.swift` imports `RookSDK` and calls `RookBackGroundSync.shared.setBackListeners()`.

## Suggested Reply To ROOK Support

Hello,

We have updated our Capacitor iOS integration to use both synchronization methods.

- Background sync is enabled for Apple Health.
- Manual sync is also available as a fallback through a `Sync Now` action in the app.
- ROOK is now initialized at app startup for authenticated users.
- On iOS we added the native background listener setup in `AppDelegate` and enabled `Background Fetch` in `Info.plist`.
- HealthKit permissions and background-delivery entitlements are configured in the iOS project.

We are now validating the updated flow on a physical iPhone by connecting Apple Health, triggering a manual sync, and confirming that new data reaches ROOK successfully.

If needed, we can share the exact test results from the updated iOS build.
