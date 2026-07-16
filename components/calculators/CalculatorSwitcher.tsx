"use client";

import { Buildings, Receipt } from "@phosphor-icons/react";
import { useState } from "react";
import { InvoiceCalculator } from "@/components/calculators/InvoiceCalculator";
import { RentCalculator } from "@/components/calculators/RentCalculator";

type CalculatorTab = "invoice" | "rent";

const CALCULATOR_TABS = [
  {
    id: "invoice" as const,
    label: "發票營業稅金額試算",
    icon: Receipt,
  },
  {
    id: "rent" as const,
    label: "租金扣繳試算",
    icon: Buildings,
  },
];

export function CalculatorSwitcher() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("invoice");
  const activeIndex = CALCULATOR_TABS.findIndex((tab) => tab.id === activeTab);

  return (
    <div className="space-y-8">
      <div className="calculator-switcher rounded-full border border-brand-light/35 bg-white p-1.5 shadow-[0_18px_54px_rgb(0_63_115_/_0.08)]" role="tablist" aria-label="計算小工具切換">
        <span className="calculator-switcher-indicator" style={{ transform: `translateX(${activeIndex * 100}%)` }} />
        {CALCULATOR_TABS.map((tab) => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tab.id}-calculator-panel`}
              id={`${tab.id}-calculator-tab`}
              onClick={() => setActiveTab(tab.id)}
              className={`calculator-switcher-tab relative z-10 flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-bold transition duration-300 active:scale-[0.98] sm:min-h-16 sm:px-5 ${
                selected ? "text-white" : "text-brand-primary hover:text-brand-dark"
              }`}
            >
              <Icon size={19} weight="bold" className="shrink-0" />
              <span className="leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div
        key={activeTab}
        id={`${activeTab}-calculator-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-calculator-tab`}
        className="calculator-panel"
      >
        {activeTab === "invoice" ? <InvoiceCalculator /> : <RentCalculator />}
      </div>
    </div>
  );
}
