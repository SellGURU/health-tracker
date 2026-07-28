/** Best-effort user-facing message for API / network failures. */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  const anyErr = error as {
    message?: string;
    code?: string;
    response?: { data?: { detail?: string; message?: string } };
  };

  if (!anyErr.response) {
    const msg = (anyErr.message || "").toLowerCase();
    if (
      anyErr.code === "ERR_NETWORK" ||
      msg.includes("network") ||
      msg.includes("timeout") ||
      msg.includes("failed to fetch")
    ) {
      return "No internet connection. Please try again.";
    }
  }

  const detail = anyErr.response?.data?.detail || anyErr.response?.data?.message;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (typeof anyErr.message === "string" && anyErr.message.trim()) {
    return anyErr.message;
  }

  return fallback;
}
