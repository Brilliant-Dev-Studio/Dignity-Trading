"use client";

type DukascopyPositionSizeCalculatorProps = {
  height?: number | string;
  width?: number | string;
  className?: string;
};

export default function DukascopyPositionSizeCalculator({
  height = 364,
  width = 580,
  className,
}: DukascopyPositionSizeCalculatorProps) {
  const params = new URLSearchParams();
  params.set("path", "position_size_calculator/index");
  params.set("showHeader", "false");
  params.set("showFooter", "false");
  params.set("accentColor", "#000000");
  params.set("availableInstruments", "l:");
  params.set("instrument", "EUR/USD");
  params.set("accountCurrency", "USD");
  params.set("accountBalance", "1000");
  params.set("stopLossPips", "50");
  params.set("riskUnit", "1");
  params.set("riskPercentage", "2");
  params.set("width", String(width));
  params.set("height", String(height));
  params.set("adv", "popup");

  const src = `https://freeserv.dukascopy.com/2.0/?${params.toString()}`;

  return (
    <iframe
      title="Dukascopy position size calculator"
      src={src}
      className={className}
      style={{ width, height }}
      frameBorder={0}
      scrolling="no"
    />
  );
}

