import Link from "next/link";
import Script from "next/script";

export default function EconomicsCalendarPage() {
  const coreSrc = "https://freeserv-static.dukascopy.com/2.0/core.js";
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-100 [background-image:radial-gradient(1100px_520px_at_18%_22%,color-mix(in_oklab,var(--brand-400)_28%,transparent),transparent_62%),radial-gradient(980px_620px_at_86%_78%,color-mix(in_oklab,var(--brand-700)_22%,transparent),transparent_68%),radial-gradient(820px_460px_at_55%_12%,color-mix(in_oklab,var(--brand-600)_14%,transparent),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0)_100%)]"
      />

      <div className="relative z-10 mx-auto w-[85%] max-w-none px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
          Forex Tools
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Economics Calendar
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
          Track high-impact news releases and macro events in one place.
        </p>

        <div className="mt-10 grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-2 py-1.5">
              <div className="min-w-0">
                <div className="text-sm font-semibold tracking-tight text-white">
                  Live calendar
                </div>
                <div className="mt-0.5 text-xs text-white/55">
                  Powered by Dukascopy
                </div>
              </div>
              <div className="shrink-0 text-xs font-medium text-white/60">
                Border: <span className="text-[color:var(--brand-400)]">#54A8E6</span>
              </div>
            </div>

            <div className="mt-2 overflow-hidden rounded-xl ring-1 ring-white/10">
              <div className="h-[70vh] min-h-[560px] w-full bg-black">
                <div id="dukascopy-economic-calendar" className="h-full w-full" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Back to tools
          </Link>
          </div>
        </div>
      </div>

      <Script
        id="dukascopy-economic-calendar-config"
        strategy="beforeInteractive"
      >{`DukascopyApplet = {"type":"economic_calendar_new","params":{"showHeader":true,"tableBorderColor":"#54a8e6","defaultTimezone":0,"defaultCountries":"r:All","impacts":[0,1,2],"dateTab":2,"dateFrom":1777766400000,"dateTo":1778284800000,"showColCountry":true,"showColCurrency":true,"showColImpact":true,"showColPrevious":true,"showColForecast":true,"width":"100%","height":"700","adv":"popup","lang":"en"}};`}</Script>
      <Script id="dukascopy-core" strategy="beforeInteractive" src={coreSrc} />
    </main>
  );
}

