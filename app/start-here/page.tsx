import Link from "next/link";

export default function StartHerePage() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="mx-auto w-[85%] max-w-none px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
          Start Here
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Your roadmap to learn trading, calmly.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
          This page is a dedicated hub for newcomers. We&apos;ll add onboarding steps,
          expectations, and the recommended learning path here.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/#mission"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Our mission
          </Link>
          <Link
            href="/#learn"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Our students
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

