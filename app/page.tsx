import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Dignity Trading — Trade with Discipline",
  },
  description:
    "Rules-first forex trading education. Learn to trade with discipline, build a repeatable system, and grow with Dignity Trading Academy's structured beginner-to-professional courses.",
  openGraph: {
    title: "Dignity Trading — Trade with Discipline",
    description:
      "Rules-first forex trading education. Structured courses from beginner to professional level.",
    url: "/",
  },
};

import HeroIntro from "./components/HeroIntro";
import FloatingCoinsBackground from "./components/FloatingCoinsBackground";

const HomeBelowFold = dynamic(() => import("@/app/components/home/HomeBelowFold"), {
  loading: () => <HomeMainSkeleton />,
});

function HomeMainSkeleton() {
  return (
    <div className="relative min-h-[70vh] bg-black" aria-hidden>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(700px_180px_at_50%_0%,rgba(84,168,230,0.12),transparent_70%)]" />
      <div className="mx-auto max-w-5xl px-4 py-24">
        <div className="mx-auto h-10 w-56 animate-pulse rounded-lg bg-white/10" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-[75%] animate-pulse rounded bg-white/10" />
          </div>
          <div className="h-72 animate-pulse rounded-3xl bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-dvh bg-black text-white">
      <FloatingCoinsBackground count={4} opacityMin={0.12} opacityMax={0.32} />
      <div className="relative z-10">
        <HeroIntro showHeader={false} />
        <HomeBelowFold />
      </div>
    </div>
  );
}
