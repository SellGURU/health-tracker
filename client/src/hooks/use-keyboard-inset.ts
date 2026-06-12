import { useEffect, useState } from "react";

/**
 * Tracks the on-screen keyboard height using the Visual Viewport API.
 * Also exposes `--keyboard-inset` on :root for CSS fallbacks.
 */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const keyboardHeight = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      setInset(keyboardHeight);
      document.documentElement.style.setProperty(
        "--keyboard-inset",
        `${keyboardHeight}px`,
      );
    };

    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    update();

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      document.documentElement.style.removeProperty("--keyboard-inset");
    };
  }, []);

  return inset;
}
