import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogPageChrome from "@/app/blog/BlogPageChrome";

export const metadata: Metadata = {
  title: "Live Forex Charts",
  description:
    "Live forex charts powered by TradingView. Advanced charting, symbol overview, and market summary — free for all traders.",
  openGraph: {
    title: "Live Forex Charts — Dignity Trading",
    description: "Advanced TradingView charts, symbol overview, and market summary in one place.",
    url: "/tools/charts",
  },
};
import { blogChromeTitleClass } from "@/app/blog/blog-chrome";
import TradingViewSymbolOverview from "@/app/components/TradingViewSymbolOverview";
import TradingViewAdvancedChart from "@/app/components/TradingViewAdvancedChart";
import TradingViewMarketSummary from "@/app/components/TradingViewMarketSummary";

export default function ChartsPage() {
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
            Charts
          </h1>
          <span
            aria-hidden="true"
            className="mt-3 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
          />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
          Quick overview charts powered by TradingView.
        </p>

        <div className="mt-10 grid gap-4">
          <div className="w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
            <div className="h-[75dvh] min-h-[520px] w-full sm:h-[70vh] sm:min-h-[560px]">
              <TradingViewAdvancedChart className="h-full w-full" />
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
            <div className="h-[60dvh] min-h-[420px] w-full sm:h-[56vh] sm:min-h-[460px]">
              <TradingViewSymbolOverview className="h-full w-full" />
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
            <TradingViewMarketSummary className="w-full" direction="horizontal" />
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

