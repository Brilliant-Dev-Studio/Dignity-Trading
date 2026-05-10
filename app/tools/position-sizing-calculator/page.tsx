import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DukascopyPositionSizeCalculator from "@/app/components/DukascopyPositionSizeCalculator";
import FloatingCoinsBackground from "@/app/components/FloatingCoinsBackground";

export default function PositionSizingCalculatorPage() {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-black text-white">
      <FloatingCoinsBackground
        className="-z-10 opacity-100"
        count={10}
        showGradient={false}
        opacityMin={0.18}
        opacityMax={0.42}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-100 [background-image:radial-gradient(1100px_520px_at_18%_22%,color-mix(in_oklab,var(--brand-400)_28%,transparent),transparent_62%),radial-gradient(980px_620px_at_86%_78%,color-mix(in_oklab,var(--brand-700)_22%,transparent),transparent_68%),radial-gradient(820px_460px_at_55%_12%,color-mix(in_oklab,var(--brand-600)_14%,transparent),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-56 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0)_100%)]"
      />
      <div className="relative z-10 mx-auto w-[97%] max-w-none px-4 py-12 sm:w-[85%] sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
          Forex Tools
        </p>
        <div className="mt-4 inline-flex flex-col">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl bg-[linear-gradient(135deg,rgba(255,255,255,0.95)_0%,color-mix(in_oklab,var(--brand-400)_38%,white)_28%,rgba(255,255,255,0.88)_55%,color-mix(in_oklab,var(--brand-700)_26%,white)_80%,rgba(255,255,255,0.92)_100%)] bg-clip-text text-transparent">
          Position Sizing Calculator
          </h1>
          <span
            aria-hidden="true"
            className="mt-3 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
          />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
          Calculate position size based on balance, risk %, and stop loss.
        </p>

        <div className="mt-10 grid gap-4">
          <div className="w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
            <div className="min-h-[440px] w-full sm:min-h-[364px]">
              <DukascopyPositionSizeCalculator className="h-full w-full" height="100%" />
            </div>
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
      </div>
    </main>
  );
}

