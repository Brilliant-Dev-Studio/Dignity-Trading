import Link from "next/link";

export default function LearnForexPage() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="mx-auto w-[85%] max-w-none px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
          Learn Forex
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Forex fundamentals, clearly explained.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
          This page will hold curated lessons and a beginner-friendly learning path.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/courses"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            View courses
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

