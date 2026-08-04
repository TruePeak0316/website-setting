import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

interface SiteLayoutProps {
  children: ReactNode;
  showViewCounter?: boolean;
}

export function SiteLayout({ children, showViewCounter = false }: SiteLayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-brand-cream text-brand-charcoal">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter showViewCounter={showViewCounter} />
    </div>
  );
}
