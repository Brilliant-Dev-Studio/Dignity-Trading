"use client";

type DukascopyMarketHoursProps = {
  height?: number | string;
  className?: string;
};

export default function DukascopyMarketHours({
  height = 530,
  className,
}: DukascopyMarketHoursProps) {
  const params = new URLSearchParams();
  params.set("path", "fxmarkethours/index");

  params.set("showHeader", "false");
  params.set("displayMainMenu", "true");
  params.set("displayTimezoneChange", "true");
  params.set("displayInstrumentChange", "true");
  params.set("displaySpreadIndicator", "true");
  params.set("displayVolumeIndicator", "true");
  params.set("displayVolatilityIndicator", "true");
  params.set("displayFollowButton", "true");
  params.set("allowTimezoneChange", "true");
  params.set("allowInstrumentChange", "true");
  params.set("defaultTimezone", "0");
  params.set("showIndicator", "0");
  params.set("defaultFollowMode", "false");

  params.set("worldMapColor", "red");
  params.set("hoursBackground", "#444f5f");
  params.set("hoursActiveBackground", "#7d92b0");
  params.set("hoursTextColor", "#ffffff");
  params.set("currentHourBGColor", "#f9fdff");
  params.set("dstHourColor", "#0cf6ff");
  params.set("indicatorBarColor", "#5090c6");
  params.set("graphPointsColor", "#ffffff");
  params.set("spreadTopGraphColor", "#208c1c");
  params.set("spreadBottomGraphColor", "#dc0e0e");
  params.set("volatilityGraphColor", "#146fba");

  params.set(
    "availableInstruments",
    "AUD/USD,EUR/USD,GBP/USD,NZD/USD,USD/CAD,USD/CHF,USD/JPY,USD/NOK,USD/SEK,USD/SGD,XAG/USD,XAU/USD,AUD/CAD,AUD/CHF,AUD/JPY,AUD/NZD,CAD/CHF,CAD/JPY,CHF/JPY,EUR/AUD,EUR/CAD,EUR/CHF,EUR/DKK,EUR/GBP,EUR/HKD,EUR/JPY,EUR/NOK,EUR/NZD,EUR/SEK,GBP/AUD,GBP/CAD,GBP/CHF,GBP/JPY,GBP/NZD,NZD/CAD,NZD/CHF,NZD/JPY,AUD/SGD,CAD/HKD,CHF/SGD,EUR/PLN,EUR/SGD,EUR/TRY,HKD/JPY,SGD/JPY,USD/DKK,USD/HKD,USD/MXN,USD/PLN,USD/RUB,USD/TRY,USD/ZAR",
  );
  params.set("instrument", "EUR/USD");

  params.set("width", "100%");
  params.set("height", String(height));
  params.set("adv", "popup");

  const src = `https://freeserv.dukascopy.com/2.0/?${params.toString()}`;

  return (
    <iframe
      title="Dukascopy market hours"
      src={src}
      className={className}
      style={{ width: "100%", height }}
      frameBorder={0}
      scrolling="no"
    />
  );
}

