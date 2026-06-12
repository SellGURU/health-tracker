import { useEffect, useState, RefObject } from "react";

interface ChatViewportState {
  /** Pixel height the element should take to fill the visible viewport. */
  height?: number;
  /** True when the on-screen keyboard is open. */
  keyboardOpen: boolean;
}

/**
 * Sizes a chat container to exactly fill the visible (visual) viewport, so the
 * input bar stays pinned directly above the on-screen keyboard with no gap.
 *
 * Works on iOS Safari (resizes-visual) and Android Chrome by measuring the
 * element's top against the Visual Viewport API.
 */
export function useChatViewport(
  ref: RefObject<HTMLElement>,
): ChatViewportState {
  const [state, setState] = useState<ChatViewportState>({
    height: undefined,
    keyboardOpen: false,
  });

  useEffect(() => {
    const vv = window.visualViewport;

    const compute = () => {
      const viewportHeight = vv ? vv.height : window.innerHeight;
      const offsetTop = vv ? vv.offsetTop : 0;
      const inset = Math.max(
        0,
        window.innerHeight - viewportHeight - offsetTop,
      );

      let height: number | undefined;
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        // Element top relative to the visible viewport top.
        const topInViewport = rect.top - offsetTop;
        height = Math.max(0, Math.round(viewportHeight - topInViewport));
      }

      setState((prev) => {
        const keyboardOpen = inset > 80;
        if (prev.height === height && prev.keyboardOpen === keyboardOpen) {
          return prev;
        }
        return { height, keyboardOpen };
      });
    };

    compute();

    vv?.addEventListener("resize", compute);
    vv?.addEventListener("scroll", compute);
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);

    return () => {
      vv?.removeEventListener("resize", compute);
      vv?.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [ref]);

  return state;
}
