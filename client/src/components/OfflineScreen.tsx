import { Button } from "@/components/ui/button";
import { isColorDark } from "@/help";
import { Loader2, WifiOff } from "lucide-react";
import { useMemo } from "react";

type OfflineScreenProps = {
  onRetry: () => void;
  retrying?: boolean;
  message?: string;
};

type CachedBrand = {
  logo?: string;
  primary_color?: string;
  name?: string;
};

function readCachedBrand(): CachedBrand | null {
  try {
    const raw = localStorage.getItem("brand_info");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.brand_elements ?? parsed ?? null;
  } catch {
    return null;
  }
}

export default function OfflineScreen({
  onRetry,
  retrying = false,
  message = "You're offline. Check your connection and try again.",
}: OfflineScreenProps) {
  const brand = useMemo(() => readCachedBrand(), []);
  const primary = brand?.primary_color ?? "#0d9488";
  const buttonTextColor = isColorDark(primary) ? "#ffffff" : "#111827";

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 px-6 text-center dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {brand?.logo ? (
        <img
          src={brand.logo}
          alt={brand.name || "App"}
          className="mb-6 h-12 w-auto object-contain"
        />
      ) : null}

      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-gray-800">
        <WifiOff className="h-8 w-8 text-teal-700 dark:text-teal-400" />
      </span>

      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        No internet connection
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {message}
      </p>

      <Button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-6 h-11 min-w-[160px] rounded-xl font-medium shadow-sm"
        style={{ background: primary, color: buttonTextColor }}
      >
        {retrying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking…
          </>
        ) : (
          "Retry"
        )}
      </Button>
    </div>
  );
}
