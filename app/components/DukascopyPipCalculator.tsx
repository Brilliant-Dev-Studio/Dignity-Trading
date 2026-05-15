"use client";

type DukascopyPipCalculatorProps = {
  height?: number | string;
  width?: number | string;
  className?: string;
};

export default function DukascopyPipCalculator({
  height = 300,
  width = 290,
  className,
}: DukascopyPipCalculatorProps) {
  const params = new URLSearchParams();
  params.set("path", "pip_calculator/index");
  params.set("header", "false");
  params.set("orientation", "portrait");
  params.set("pipAmount", "100");
  params.set("accountCurrency", "USD");
  params.set("defaultInstrument", "EUR/USD");
  params.set("resultColor", "#696969");
  params.set("width", String(width));
  params.set("height", String(height));
  params.set("adv", "popup");

  const src = `https://freeserv.dukascopy.com/2.0/?${params.toString()}`;

  return (
    <iframe
      title="Dukascopy pip calculator"
      src={src}
      className={className}
      style={{ width, height }}
      frameBorder={0}
      scrolling="no"
    />
  );
}

