import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

interface MarqueeControlsProps {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
}

export function MarqueeControls({ label, onPrevious, onNext }: MarqueeControlsProps) {
  return (
    <div className="marquee-controls flex items-center gap-2" aria-label={label}>
      <button type="button" onClick={onPrevious} className="marquee-control-button" aria-label={`${label}，往左`}>
        <ArrowLeft size={17} weight="bold" />
      </button>
      <button type="button" onClick={onNext} className="marquee-control-button" aria-label={`${label}，往右`}>
        <ArrowRight size={17} weight="bold" />
      </button>
    </div>
  );
}
