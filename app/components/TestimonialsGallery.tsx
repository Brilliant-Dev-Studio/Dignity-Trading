"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import type { TestimonialItem } from "@/app/testimonials/testimonials-data";

type Props = {
  items: readonly TestimonialItem[];
  cardTitleClass: string;
};

export default function TestimonialsGallery({ items, cardTitleClass }: Props) {
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const active = openSrc ? items.find((i) => i.src === openSrc) : null;

  const close = useCallback(() => setOpenSrc(null), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!openSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openSrc, close]);

  return (
    <>
      <ul className="mt-14 grid list-none gap-10 sm:gap-12 lg:grid-cols-2">
        {items.map((item) => (
          <li key={item.src}>
            <figure className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.06] backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => setOpenSrc(item.src)}
                className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--brand-400)_55%,white)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label={`Enlarge: ${item.label}`}
              >
                <div className="relative aspect-[1280/720] w-full bg-zinc-900">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    priority={item.src === "/testimonial_five.jpg"}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70 transition group-hover:opacity-100"
                  />
                </div>
              </button>
              <figcaption
                className={`border-t border-white/10 bg-black/20 px-4 py-3.5 text-sm font-semibold tracking-tight sm:text-base ${cardTitleClass}`}
              >
                {item.label}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {mounted && active
        ? createPortal(
            <div
              className="fixed inset-0 z-[2100] flex items-center justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top))] sm:p-6 sm:pb-8 sm:pt-20"
              role="dialog"
              aria-modal="true"
              aria-labelledby="testimonial-lightbox-title"
            >
              <button
                type="button"
                className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-md"
                onClick={close}
                aria-label="Close enlarged image"
              />
              <div className="relative z-10 flex max-h-[min(88dvh,880px)] w-full max-w-[min(96vw,1280px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-[0_40px_120px_rgba(0,0,0,0.72)] ring-1 ring-white/10">
                <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black px-2 py-3 sm:px-4 sm:py-4">
                  <Image
                    src={active.src}
                    alt={active.alt}
                    width={1280}
                    height={720}
                    className="h-auto max-h-[min(72dvh,800px)] w-full object-contain"
                    sizes="(max-width: 1280px) 96vw, 1280px"
                    priority
                  />
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p
                    id="testimonial-lightbox-title"
                    className={`min-w-0 flex-1 text-left text-sm font-semibold sm:text-base ${cardTitleClass}`}
                  >
                    {active.label}
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white transition hover:bg-white/[0.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
