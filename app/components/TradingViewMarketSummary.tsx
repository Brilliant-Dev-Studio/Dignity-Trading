"use client";

import { createElement, useEffect } from "react";

type TradingViewMarketSummaryProps = {
  className?: string;
  direction?: "horizontal" | "vertical";
};

export default function TradingViewMarketSummary({
  className,
  direction = "horizontal",
}: TradingViewMarketSummaryProps) {
  useEffect(() => {
    const id = "tradingview-market-summary-script";
    if (document.getElementById(id)) return;

    const script = document.createElement("script");
    script.id = id;
    script.type = "module";
    script.src = "https://widgets.tradingview-widget.com/w/en/tv-market-summary.js";
    document.body.appendChild(script);
  }, []);

  // Render custom element via createElement to avoid TSX typing noise.
  // style must be a string for custom elements — React does not process
  // the style object for non-HTML elements the same way it does for HTML.
  return (
    <div className={className}>
      {createElement("tv-market-summary", {
        direction,
        style: { display: "block", width: "100%" },
      })}
    </div>
  );
}

