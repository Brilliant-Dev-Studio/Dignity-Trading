"use client";

type DukascopyEconomicCalendarProps = {
  borderColor?: string;
  timezone?: number;
  lang?: string;
  dateFrom?: number;
  dateTo?: number;
  height?: string;
  className?: string;
};

export default function DukascopyEconomicCalendar({
  borderColor = "#54a8e6",
  timezone = 0,
  lang = "en",
  dateFrom,
  dateTo,
  height = "100%",
  className,
}: DukascopyEconomicCalendarProps) {
  // Dukascopy `core.js` writes an iframe via `document.writeln()`, which is unreliable in SPAs.
  // Instead, build the iframe URL directly (this matches what core.js generates).
  const params = new URLSearchParams();
  params.set("path", "economic_calendar_new/index");
  params.set("showHeader", "true");
  params.set("tableBorderColor", borderColor);
  params.set("defaultTimezone", String(timezone));
  params.set("defaultCountries", "r:All");
  params.set("impacts", "0,1,2");
  params.set("dateTab", "2");
  if (typeof dateFrom === "number") params.set("dateFrom", String(dateFrom));
  if (typeof dateTo === "number") params.set("dateTo", String(dateTo));
  params.set("showColCountry", "true");
  params.set("showColCurrency", "true");
  params.set("showColImpact", "true");
  params.set("showColPrevious", "true");
  params.set("showColForecast", "true");
  params.set("width", "100%");
  params.set("height", height);
  params.set("adv", "popup");
  params.set("lang", lang);

  const src = `https://freeserv.dukascopy.com/2.0/?${params.toString()}`;

  return (
    <iframe
      title="Dukascopy economic calendar"
      src={src}
      className={className}
      style={{ width: "100%", height }}
      frameBorder={0}
      scrolling="no"
    />
  );
}

