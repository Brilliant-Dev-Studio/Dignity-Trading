"use client";

import type { ReactNode } from "react";
import FloatingCoinsBackground from "@/app/components/FloatingCoinsBackground";
import { cn } from "@/lib/utils";

export default function BlogPageChrome({
  children,
  containerClassName,
}: {
  children: ReactNode;
  containerClassName?: string;
}) {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-black text-white">
      <FloatingCoinsBackground
        className="-z-10 opacity-100"
        count={5}
        showGradient={false}
        opacityMin={0.12}
        opacityMax={0.28}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-100 [background-image:radial-gradient(1100px_520px_at_18%_22%,color-mix(in_oklab,var(--brand-400)_28%,transparent),transparent_62%),radial-gradient(980px_620px_at_86%_78%,color-mix(in_oklab,var(--brand-700)_22%,transparent),transparent_68%),radial-gradient(820px_460px_at_55%_12%,color-mix(in_oklab,var(--brand-600)_14%,transparent),transparent_70%),radial-gradient(900px_560px_at_90%_26%,rgba(255,190,55,0.24),transparent_58%),radial-gradient(760px_520px_at_12%_78%,rgba(251,146,60,0.16),transparent_62%),radial-gradient(640px_420px_at_48%_48%,rgba(253,186,116,0.10),transparent_68%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-56 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-72 bg-[radial-gradient(700px_220px_at_50%_100%,color-mix(in_oklab,var(--brand-400)_12%,transparent),transparent_72%),radial-gradient(560px_200px_at_78%_100%,rgba(255,190,55,0.16),transparent_70%),radial-gradient(480px_160px_at_22%_100%,rgba(251,146,60,0.10),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.26] [background-image:radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:14px_14px]"
      />
      <div
        className={cn(
          "relative z-10 mx-auto w-[97%] max-w-none px-4 py-12 sm:w-[85%] sm:px-6 sm:py-16 lg:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </main>
  );
}
