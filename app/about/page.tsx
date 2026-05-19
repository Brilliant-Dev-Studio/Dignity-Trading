import type { Metadata } from "next";
import BackToHomeButton from "@/app/components/BackToHomeButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind Dignity Trading Academy. Disciplined, rules-first forex education — no hype, no shortcuts.",
  openGraph: {
    title: "About Dignity Trading",
    description: "The values, approach, and mission behind Dignity Trading Academy.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="mx-auto w-[85%] max-w-none px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
          About
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          The team behind Dignity Trading.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
          This page will explain the values, approach, and what we teach (without hype).
        </p>
        <div className="mt-10">
          <BackToHomeButton />
        </div>
      </div>
    </main>
  );
}

