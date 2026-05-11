"use client";

import Lenis from "lenis";
import { type PropsWithChildren, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function LenisProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const rafIdRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Use native scrolling for content-heavy pages where Lenis can feel "sticky" at bounds.
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/blog")) {
      return;
    }

    // Avoid native smooth scroll fighting Lenis (we still smooth-scroll anchors via Lenis).
    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const t = e.target as Element | null;
      const a = t?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href") ?? "";
      if (!href || href === "#") return;

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      lenis.scrollTo(el, { duration: 1.15 });
      history.pushState(null, "", href);
    };
    window.addEventListener("click", onClick);

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };
    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("click", onClick);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
    };
  }, [pathname]);

  return children;
}

