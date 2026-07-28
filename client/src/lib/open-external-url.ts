import { Capacitor } from "@capacitor/core";

/**
 * Open an external https URL outside the app WebView.
 * On iOS/Android Capacitor, window.open often navigates the same WebView
 * (broken OAuth / "stuck on same page"). Prefer Capacitor Browser.
 */
export async function openExternalUrl(url: string): Promise<void> {
  const trimmed = url?.trim();
  if (!trimmed) {
    throw new Error("Missing URL");
  }

  if (Capacitor.isNativePlatform()) {
    try {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({
        url: trimmed,
        presentationStyle: "popover",
      });
      return;
    } catch (error) {
      console.warn(
        "Capacitor Browser unavailable, falling back to anchor open:",
        error,
      );
    }

    // Fallback: synthetic <a target=_blank> is more reliable than window.open on WKWebView
    const anchor = document.createElement("a");
    anchor.href = trimmed;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return;
  }

  const opened = window.open(trimmed, "_blank", "noopener,noreferrer");
  if (!opened) {
    // Popup blocked — last resort
    window.location.assign(trimmed);
  }
}
