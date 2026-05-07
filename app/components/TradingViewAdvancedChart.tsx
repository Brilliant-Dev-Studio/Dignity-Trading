"use client";

import { useEffect, useId, useRef } from "react";

type TradingViewAdvancedChartProps = {
  className?: string;
};

export default function TradingViewAdvancedChart({
  className,
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useId();

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    // React StrictMode (dev) mounts/unmounts effects twice; don't re-inject if present.
    if (host.childElementCount > 0) return;

    host.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "calc(100% - 32px)";
    widget.style.width = "100%";
    widgetContainer.appendChild(widget);

    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    copyright.innerHTML =
      '<a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener nofollow" target="_blank"><span class="blue-text">AAPL stock chart</span></a><span class="trademark"> by TradingView</span>';
    widgetContainer.appendChild(copyright);

    const script = document.createElement("script");
    script.id = `tradingview-advanced-chart-${widgetId}`;
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.text = JSON.stringify(
      {
        allow_symbol_change: true,
        calendar: false,
        details: false,
        hide_side_toolbar: true,
        hide_top_toolbar: false,
        hide_legend: false,
        hide_volume: false,
        hotlist: false,
        interval: "D",
        locale: "en",
        save_image: true,
        style: "1",
        symbol: "NASDAQ:AAPL",
        theme: "dark",
        timezone: "Etc/UTC",
        backgroundColor: "#0F0F0F",
        gridColor: "rgba(242, 242, 242, 0.06)",
        watchlist: [],
        withdateranges: false,
        compareSymbols: [],
        studies: [],
        autosize: true,
      },
      null,
      0,
    );

    widgetContainer.appendChild(script);
    host.appendChild(widgetContainer);

    return () => {
      // Only cleanup on real unmount/navigation; avoid tearing down in StrictMode dev.
      if (!host.isConnected) host.innerHTML = "";
    };
  }, [widgetId]);

  return <div ref={containerRef} className={className} />;
}

