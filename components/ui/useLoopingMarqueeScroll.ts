import { useCallback, useEffect, useRef } from "react";
import type { RefObject, UIEvent } from "react";

interface LoopingMarqueeScrollOptions {
  enabled: boolean;
  cycleWidth: number;
  scrollerRef: RefObject<HTMLElement | null>;
}

export function useLoopingMarqueeScroll({ enabled, cycleWidth, scrollerRef }: LoopingMarqueeScrollOptions) {
  const isWrappingRef = useRef(false);
  const initializedCycleWidthRef = useRef(0);

  const wrapScrollPosition = useCallback(
    (element: HTMLElement) => {
      if (!enabled || cycleWidth <= 0 || isWrappingRef.current) {
        return;
      }

      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      if (maxScrollLeft <= 0) {
        return;
      }

      const edgeBuffer = 1;
      let nextScrollLeft = element.scrollLeft;

      if (element.scrollLeft <= edgeBuffer) {
        nextScrollLeft = Math.min(element.scrollLeft + cycleWidth, maxScrollLeft - edgeBuffer);
      } else if (element.scrollLeft >= maxScrollLeft - edgeBuffer) {
        nextScrollLeft = Math.max(element.scrollLeft - cycleWidth, edgeBuffer);
      }

      if (nextScrollLeft !== element.scrollLeft) {
        const previousScrollBehavior = element.style.scrollBehavior;
        isWrappingRef.current = true;
        element.style.scrollBehavior = "auto";
        element.scrollLeft = nextScrollLeft;
        requestAnimationFrame(() => {
          element.style.scrollBehavior = previousScrollBehavior;
          isWrappingRef.current = false;
        });
      }
    },
    [cycleWidth, enabled],
  );

  const onScroll = useCallback(
    (event: UIEvent<HTMLElement>) => {
      wrapScrollPosition(event.currentTarget);
    },
    [wrapScrollPosition],
  );

  const scrollByAmount = useCallback(
    (amount: number) => {
      const element = scrollerRef.current;
      if (!element) {
        return;
      }

      element.scrollBy({ left: amount, behavior: "smooth" });
      window.setTimeout(() => wrapScrollPosition(element), 360);
    },
    [scrollerRef, wrapScrollPosition],
  );

  useEffect(() => {
    isWrappingRef.current = false;
    if (!enabled || cycleWidth <= 0 || initializedCycleWidthRef.current === cycleWidth) {
      return;
    }

    const element = scrollerRef.current;
    if (!element) {
      return;
    }

    initializedCycleWidthRef.current = cycleWidth;
    const previousScrollBehavior = element.style.scrollBehavior;
    element.style.scrollBehavior = "auto";
    element.scrollLeft = cycleWidth;
    requestAnimationFrame(() => {
      element.style.scrollBehavior = previousScrollBehavior;
    });
  }, [cycleWidth, enabled, scrollerRef]);

  return { onScroll, scrollByAmount, wrapScrollPosition };
}
