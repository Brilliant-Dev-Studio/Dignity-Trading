import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical ideas on risk, psychology, and forex strategy — written to be read slowly and applied consistently.",
  openGraph: {
    title: "Trading Blog — Dignity Trading",
    description:
      "Calm, useful trading notes on risk, psychology, and strategy from Dignity Trading Academy.",
    url: "/blog",
  },
};
import BlogPageChrome from "./BlogPageChrome";
import BlogCardsSkeleton from "./BlogCardsSkeleton";
import BlogPostSections from "./BlogPostSections";
import { blogChromeTitleClass } from "./blog-chrome";

export default function PublicBlogPage() {
  return (
    <BlogPageChrome lite>
      <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}>
        Blog
      </p>
      <div className="mt-4 inline-flex flex-col">
        <h1
          className={`text-4xl font-semibold leading-[1.22] tracking-tight sm:text-5xl sm:leading-[1.22] ${blogChromeTitleClass} pb-1`}
        >
          Calm, useful trading notes.
        </h1>
        <span
          aria-hidden="true"
          className="mt-3 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
        />
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
        Practical ideas on risk, psychology, and strategy — written to be read slowly and applied
        consistently.
      </p>

      <Suspense fallback={<BlogCardsSkeleton />}>
        <BlogPostSections />
      </Suspense>
    </BlogPageChrome>
  );
}
