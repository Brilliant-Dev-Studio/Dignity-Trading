import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, GraduationCap } from "lucide-react";

import BlogPageChrome from "@/app/blog/BlogPageChrome";
import { blogChromeTitleClass } from "@/app/blog/blog-chrome";
import TestimonialsGallery from "@/app/components/TestimonialsGallery";
import { TESTIMONIALS } from "@/app/testimonials/testimonials-data";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Student feedback on Dignity Trading courses, teaching style, and practical support.",
};

const chromeCardTitle =
  "bg-[linear-gradient(135deg,rgba(255,255,255,0.88)_0%,color-mix(in_oklab,var(--brand-400)_55%,white)_35%,rgba(255,255,255,0.82)_60%,color-mix(in_oklab,var(--brand-700)_48%,white)_100%)] bg-clip-text text-transparent";

export default function TestimonialsPage() {
  return (
    <BlogPageChrome>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}
        >
          Testimonials
        </p>
        <div className="mt-4 inline-flex flex-col">
          <h1
            className={`text-4xl font-semibold tracking-tight sm:text-5xl ${blogChromeTitleClass}`}
          >
            What students say
          </h1>
          <span
            aria-hidden="true"
            className="mt-3 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
          />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
          Real feedback from people who joined our trading education and mentoring.
        </p>

        <TestimonialsGallery items={TESTIMONIALS} cardTitleClass={chromeCardTitle} />

        <div className="mt-14 flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href="/courses"
            className={[
              "group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold",
              "border border-white/[0.14] bg-white/[0.06] text-white backdrop-blur-md",
              "shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]",
              "transition duration-200 ease-out",
              "hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--brand-400)_35%,white)] hover:bg-white/[0.11]",
              "hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_28px_color-mix(in_oklab,var(--brand-400)_16%,transparent),inset_0_1px_0_rgba(255,255,255,0.2)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--brand-400)_50%,white)] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              "cursor-pointer active:translate-y-0",
            ].join(" ")}
          >
            <GraduationCap
              className="h-4 w-4 shrink-0 text-white/60 transition group-hover:scale-105 group-hover:text-white"
              aria-hidden
            />
            <span className="text-white/88 transition group-hover:text-white">Courses</span>
          </Link>

          <Link
            href="/"
            className={[
              "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold",
              "text-zinc-950",
              "bg-[linear-gradient(165deg,#ffffff_0%,#f4f4f5_42%,#e4e4e7_100%)]",
              "shadow-[0_12px_40px_rgba(0,0,0,0.42),0_0_32px_color-mix(in_oklab,var(--brand-400)_20%,transparent),inset_0_1px_0_rgba(255,255,255,0.92)]",
              "ring-1 ring-white/70 transition duration-200 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_18px_52px_rgba(0,0,0,0.48),0_0_44px_color-mix(in_oklab,var(--brand-400)_30%,transparent),inset_0_1px_0_#fff]",
              "hover:ring-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              "cursor-pointer active:translate-y-0",
            ].join(" ")}
          >
            <ArrowLeft
              className="relative h-4 w-4 shrink-0 transition group-hover:-translate-x-0.5"
              aria-hidden
            />
            <span className="relative">Back to home</span>
          </Link>
        </div>
    </BlogPageChrome>
  );
}
