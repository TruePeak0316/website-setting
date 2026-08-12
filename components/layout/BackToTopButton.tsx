"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export function BackToTopButton() {
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "100px 0px 0px 0px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <>
      <span ref={sentinelRef} className="pointer-events-none absolute left-0 top-0 h-px w-px" aria-hidden="true" />
      <button
        type="button"
        onClick={scrollToTop}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        aria-label="返回頁面頂部"
        title="返回頁面頂部"
        className={`fixed bottom-5 right-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-light/50 bg-white text-brand-primary shadow-[0_14px_38px_rgb(7_86_111_/_0.16)] transition duration-300 hover:-translate-y-1 hover:border-brand-primary/45 hover:bg-brand-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2 active:translate-y-0 active:scale-95 motion-reduce:transition-none sm:bottom-7 sm:right-7 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp size={20} weight="bold" />
      </button>
    </>
  );
}
