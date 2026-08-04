import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type StopViewCounter = () => void;
type StartViewCounter = (
  onValue: (value: number) => void,
  onError: () => void,
) => StopViewCounter;

declare global {
  interface Window {
    startFirebaseViewCounter?: StartViewCounter;
  }
}

export function FirebaseViewCounter() {
  const [viewCount, setViewCount] = useState<number>();
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const counterRef = useRef<HTMLParagraphElement | null>(null);
  const stopCounterRef = useRef<StopViewCounter | null>(null);

  const startCounter = useCallback(() => {
    stopCounterRef.current?.();
    setHasError(false);

    if (!window.startFirebaseViewCounter) {
      setHasError(true);
      return;
    }

    stopCounterRef.current = window.startFirebaseViewCounter(
      (value) => setViewCount(value),
      () => setHasError(true),
    );
  }, []);

  useEffect(
    () => () => {
      stopCounterRef.current?.();
    },
    [],
  );

  useEffect(() => {
    const counterElement = counterRef.current;
    if (!counterElement || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "320px" },
    );

    observer.observe(counterElement);
    return () => observer.disconnect();
  }, []);

  const displayValue = hasError
    ? "暫時無法取得"
    : viewCount === undefined
      ? "載入中..."
      : viewCount.toLocaleString("zh-TW");

  return (
    <>
      {shouldLoad ? (
        <Script
          id="firebase-view-counter"
          src="/scripts/viewCounter.js"
          type="module"
          strategy="lazyOnload"
          onReady={startCounter}
          onError={() => setHasError(true)}
        />
      ) : null}
      <p ref={counterRef} aria-live="polite">首頁瀏覽次數：{displayValue}</p>
    </>
  );
}
