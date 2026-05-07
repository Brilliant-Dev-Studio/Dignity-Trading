"use client";

import { useEffect, useId, useRef } from "react";

type TradingViewSymbolOverviewProps = {
  className?: string;
};

export default function TradingViewSymbolOverview({
  className,
}: TradingViewSymbolOverviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useId();

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    // React StrictMode (dev) mounts/unmounts effects twice; don't re-inject if present.
    if (host.childElementCount > 0) return;

    // TradingView embeds expect a specific DOM structure and a script tag whose
    // textContent is the widget JSON configuration.
    host.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widgetContainer.appendChild(widget);

    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    copyright.innerHTML =
      '<a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener nofollow" target="_blank"><span class="blue-text">Apple</span></a><span class="comma">,</span>&nbsp;<a href="https://www.tradingview.com/symbols/NASDAQ-GOOGL/" rel="noopener nofollow" target="_blank"><span class="blue-text">Google</span></a><span class="comma">,</span><span class="and">&nbsp;and&nbsp;</span><a href="https://www.tradingview.com/symbols/NASDAQ-MSFT/" rel="noopener nofollow" target="_blank"><span class="blue-text">Microsoft stock price</span></a><span class="trademark">&nbsp;by TradingView</span>';
    widgetContainer.appendChild(copyright);

    const script = document.createElement("script");
    script.id = `tradingview-symbol-overview-${widgetId}`;
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.text = JSON.stringify(
      {
        lineWidth: 2,
        lineType: 0,
        chartType: "area",
        fontColor: "rgb(106, 109, 120)",
        gridLineColor: "rgba(242, 242, 242, 0.06)",
        volumeUpColor: "rgba(34, 171, 148, 0.5)",
        volumeDownColor: "rgba(247, 82, 95, 0.5)",
        backgroundColor: "#0F0F0F",
        widgetFontColor: "#DBDBDB",
        upColor: "#22ab94",
        downColor: "#f7525f",
        borderUpColor: "#22ab94",
        borderDownColor: "#f7525f",
        wickUpColor: "#22ab94",
        wickDownColor: "#f7525f",
        colorTheme: "dark",
        isTransparent: false,
        locale: "en",
        chartOnly: false,
        scalePosition: "right",
        scaleMode: "Normal",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        valuesTracking: "1",
        changeMode: "price-and-percent",
        symbols: [
          ["Apple", "NASDAQ:AAPL|1D"],
          ["Google", "NASDAQ:GOOGL|1D"],
          ["Microsoft", "NASDAQ:MSFT|1D"],
        ],
        dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
        fontSize: "10",
        headerFontSize: "medium",
        autosize: true,
        width: "100%",
        height: "100%",
        noTimeScale: false,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
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

