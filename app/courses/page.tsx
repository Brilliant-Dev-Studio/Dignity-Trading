import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forex Courses",
  description:
    "Structured forex courses from beginner to professional level. Free beginner, intermediate, and professional advance trading courses by Dignity Trading Academy.",
  openGraph: {
    title: "Forex Courses — Dignity Trading",
    description:
      "Free beginner, intermediate, and professional advance forex courses. Structured, practical, and repeatable.",
    url: "/courses",
  },
};

export default function CoursesPage() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="mx-auto w-[85%] max-w-none px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
          Courses
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Structured lessons. Repeatable practice.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
          From complete beginner to professional-level execution — choose your path and work through structured, practical lessons at your own pace.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/learn-forex"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Beginner course
          </Link>
          <Link
            href="/learn-forex-intermediate"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Intermediate course
          </Link>
          <Link
            href="/learn-forex-advanced"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Professional Advance course
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

