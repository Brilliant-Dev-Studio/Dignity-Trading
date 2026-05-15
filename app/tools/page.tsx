import type { Metadata } from "next";
import Link from "next/link";

import BlogPageChrome from "@/app/blog/BlogPageChrome";

export const metadata: Metadata = {
  title: "Free Forex Trading Tools",
  description:
    "Free forex tools for traders — pip calculator, position size calculator, market hours, economic calendar, and live charts.",
  openGraph: {
    title: "Free Forex Tools — Dignity Trading",
    description:
      "Calculators, charts, and market data tools to support your daily forex trading decisions.",
    url: "/tools",
  },
};
import { blogChromeTitleClass } from "@/app/blog/blog-chrome";

export default function ToolsPage() {
  return (
    <BlogPageChrome>
      <p
        className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}
      >
          Tools
      </p>
      <div className="mt-4 inline-flex flex-col">
        <h1
          className={`text-4xl font-semibold tracking-tight sm:text-5xl ${blogChromeTitleClass}`}
        >
          Checklists, calculators, templates.
        </h1>
        <span
          aria-hidden="true"
          className="mt-3 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
        />
      </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
          This page will host the practical tools students use daily.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/resources"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Resources
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100"
          >
            Back to home
          </Link>
        </div>
    </BlogPageChrome>
  );
}

