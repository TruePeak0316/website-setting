"use client";

import { Copy, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { SITE } from "@/lib/site";

export function LineCopyButton() {
  const [copied, setCopied] = useState(false);

  async function copyLineId() {
    await navigator.clipboard.writeText(SITE.lineId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copyLineId}
      className="inline-flex items-center gap-2 rounded-xs border border-brand-light bg-white px-3 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-cream"
    >
      {copied ? <CheckCircle size={17} weight="bold" /> : <Copy size={17} weight="bold" />}
      {copied ? "已複製 LINE ID" : `複製 ${SITE.lineId}`}
    </button>
  );
}
