import Link from "next/link";

export default function PositionSizingCalculatorPage() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="mx-auto w-[85%] max-w-none px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
          Forex Tools
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Position Sizing Calculator
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
          Coming soon.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Back to tools
          </Link>
        </div>
      </div>
    </main>
  );
}

