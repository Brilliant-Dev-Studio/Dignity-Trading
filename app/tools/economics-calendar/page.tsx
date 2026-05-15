import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DukascopyEconomicCalendar from "@/app/components/DukascopyEconomicCalendar";

export const metadata: Metadata = {
  title: "Forex Economic Calendar",
  description:
    "Live economic calendar powered by Dukascopy. Track high-impact news releases and macro events that move forex markets.",
  openGraph: {
    title: "Forex Economic Calendar — Dignity Trading",
    description: "Stay ahead of market-moving news with a live forex economic calendar.",
    url: "/tools/economics-calendar",
  },
};
import BlogPageChrome from "@/app/blog/BlogPageChrome";
import { blogChromeTitleClass } from "@/app/blog/blog-chrome";

export default function EconomicsCalendarPage() {
  return (
    <BlogPageChrome>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}
        >
          Forex Tools
        </p>
        <div className="mt-4 inline-flex flex-col">
          <h1
            className={`text-4xl font-semibold tracking-tight sm:text-5xl ${blogChromeTitleClass}`}
          >
            Economics Calendar
          </h1>
          <span
            aria-hidden="true"
            className="mt-3 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
          />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
          Track high-impact news releases and macro events in one place.
        </p>

        <div className="mt-10 grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-tight text-white">
                Live calendar
              </div>
              <div className="mt-0.5 text-xs text-white/55">
                Powered by Dukascopy
              </div>
            </div>
          </div>

          <div className="h-[75dvh] min-h-[520px] w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10 sm:h-[70vh] sm:min-h-[560px]">
            <DukascopyEconomicCalendar
              borderColor="#D92626"
              timezone={0}
              lang="en"
              dateFrom={1777766400000}
              dateTo={1778284800000}
              height="100%"
              className="h-full w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3">
          <Link
            href="/tools"
            className={[
              "group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold",
              "bg-white/[0.06] text-white ring-1 ring-white/12 backdrop-blur",
              "shadow-[0_18px_55px_rgba(0,0,0,0.35)]",
              "transition hover:-translate-y-0.5 hover:bg-white/[0.10] hover:ring-white/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              "cursor-pointer",
            ].join(" ")}
          >
            <ArrowLeft className="h-4 w-4 text-white/70 transition group-hover:-translate-x-0.5 group-hover:text-white" />
            <span className="text-white/85 transition group-hover:text-white">
              Back to tools
            </span>
          </Link>
          </div>
        </div>
    </BlogPageChrome>
  );
}

