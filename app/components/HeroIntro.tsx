"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

import BlurText from "./BlurText";

const appear = {
  // Avoid animating CSS filters (can flicker with backdrop/video on some browsers).
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0 },
};

const softEase = [0.22, 1, 0.36, 1] as const;
const softTransition = { duration: 0.85, ease: softEase } as const;

const navItem = {
  // Avoid filter blur here; it can flicker on some browsers when combined with backdrop-blur.
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0 },
};

const buttonAppear = {
  hidden: { opacity: 0, y: 10, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function HeroIntro({ showHeader = true }: { showHeader?: boolean }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const [headerH, setHeaderH] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [parallax, setParallax] = useState({ p: 0, vh: 0 });
  const headerRef = useRef<HTMLDivElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const canPortal = typeof document !== "undefined";

  useEffect(() => {
    const measure = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 0;
      setHeaderH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const update = () => {
      const vh = window.innerHeight || 1;
      const p = clamp01(window.scrollY / vh);
      setParallax({ p, vh });
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeDesktopMenu = () => setOpenMenu(null);

  const menu = useMemo(
    () => [
      {
        label: "Home",
        href: "#home",
      },
      {
        label: "Mission",
        href: "#mission",
        children: [
          { label: "Your skill our focus", href: "#mission" },
          { label: "Fast Clear Road Map", href: "#mission" },
          { label: "Support and Accountability", href: "#mission" },
        ],
      },
      {
        label: "Trading Course",
        href: "/courses",
        children: [
          { label: "Free Forex Beginner Trading Course", href: "/learn-forex" },
          { label: "Free Intermediate Trading Course", href: "/learn-forex-intermediate" },
          { label: "Professional Advance Trading Course", href: "/courses?level=advance" },
        ],
      },
      { label: "Market Anaylsis", href: "/resources" },
      {
        label: "Forex Tools",
        href: "/tools",
        children: [
          { label: "Economics Calendar", href: "/tools/economics-calendar" },
          { label: "Position Sizing Calculator", href: "/tools/position-sizing-calculator" },
          { label: "Pip Calculator", href: "/tools/pip-calculator" },
          { label: "Market Hours", href: "/tools/market-hours" },
          { label: "Charts", href: "/tools/charts" },
        ],
      },
      { label: "Blog", href: "/blog" },
      { label: "Testimonial", href: "/testimonials" },
      { label: "Open Trading Account", href: "/open-trading-account" },
      { label: "Contact", href: "/contact" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
    [],
  );

  // Keep header padding/height consistent between initial + sticky states.
  // Sticky state should only change placement/background, not vertical rhythm.
  const headerRowH = "h-12";

  const headerContent = (
    <div
      className="mx-auto w-full max-w-none pl-4 pr-0 sm:w-[95%] sm:px-6 lg:px-8"
    >
      <div
        className={`grid ${headerRowH} grid-cols-[auto_1fr_auto] items-center gap-4 min-w-0`}
      >
        <motion.a
          href="#home"
          className="flex items-center gap-3 justify-self-start shrink-0"
          variants={appear}
          initial="hidden"
          animate="show"
          transition={softTransition}
        >
          <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10 sm:h-9 sm:w-9">
            <Image
              src="/logo.png"
              alt="Dignity Trading"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide sm:text-base">
              Dignity Trading
            </div>
          </div>
        </motion.a>

        <motion.div
          className="hidden justify-self-center md:block min-w-0"
          variants={appear}
          initial="hidden"
          animate="show"
          transition={softTransition}
        >
          <div
            className={[
              headerRowH,
              "relative z-[1200] max-w-full overflow-visible rounded-full border border-white/12 bg-white/[0.05] shadow-sm backdrop-blur",
            ].join(" ")}
          >
            <div
              className={`flex ${headerRowH} items-center gap-2 rounded-full px-2 max-w-full overflow-visible`}
            >
              {menu.map((item, idx) =>
                "children" in item && item.children ? (
                  <div
                    key={item.label}
                    className={[
                      "group relative hero-nav-item",
                      "is-in",
                    ].join(" ")}
                    style={{ ["--i" as any]: idx }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu((cur) => (cur === item.label ? null : item.label))
                      }
                      aria-haspopup="menu"
                      aria-expanded={openMenu === item.label}
                      className={`inline-flex ${headerRowH} cursor-pointer items-center gap-1.5 rounded-full px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 whitespace-nowrap`}
                    >
                      {item.label}
                      <ChevronDown
                        className={[
                          "h-3.5 w-3.5 transition-transform",
                          openMenu === item.label ? "rotate-180" : "rotate-0 group-hover:rotate-180",
                        ].join(" ")}
                      />
                    </button>

                    {/* Hover bridge so cursor can reach dropdown without closing */}
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-full h-3 w-full"
                    />

                    <div
                      role="menu"
                      className={[
                        "absolute left-0 top-full z-[1100] min-w-52 overflow-hidden rounded-xl border border-white/10 bg-black/80 p-1 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur-xl",
                        "opacity-0 pointer-events-none translate-y-1 transition-[opacity,transform] duration-200",
                        "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-2",
                        openMenu === item.label ? "opacity-100 pointer-events-auto translate-y-2" : "",
                      ].join(" ")}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          role="menuitem"
                          className="flex !cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[11px] font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                          <span>{child.label}</span>
                          <span className="text-[10px] text-white/35">↗</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={"href" in item ? item.href : "#"}
                    className={[
                      `inline-flex ${headerRowH} cursor-pointer items-center rounded-full px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white`,
                      "hero-nav-item",
                      "is-in",
                    ].join(" ")}
                    style={{ ["--i" as any]: idx }}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="justify-self-end shrink-0"
          variants={appear}
          initial="hidden"
          animate="show"
          transition={softTransition}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`inline-flex ${headerRowH} w-11 items-center justify-center rounded-full bg-transparent text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 md:hidden`}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );

  const mobileDrawer = (
    <div className="fixed inset-0 z-[2000] md:hidden">
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      />
      <motion.div
        className="absolute right-0 top-0 h-full w-[88%] max-w-[380px] border-l border-white/10 bg-black/85 shadow-[0_40px_120px_rgba(0,0,0,0.75)] backdrop-blur-xl"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.32, ease: softEase }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(520px_220px_at_15%_30%,rgba(84,168,230,0.22),transparent_62%),radial-gradient(520px_220px_at_85%_70%,rgba(47,102,212,0.16),transparent_62%)]"
          />
          <div className="relative flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10">
                <Image
                  src="/logo.png"
                  alt="Dignity Trading"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  priority={false}
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide text-white">
                  Dignity Trading
                </div>
                <div className="text-[11px] text-white/55">Menu</div>
              </div>
            </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white/90 ring-1 ring-white/12 transition hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
          </div>
        </div>

        <div className="h-[calc(100%-64px)] overflow-y-auto px-3 pb-6">
          <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
          {menu.map((item) => {
            const hasChildren = "children" in item && item.children?.length;
            if (!hasChildren) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex h-12 cursor-pointer items-center justify-between rounded-xl px-3 text-[15px] font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                >
                  <span className="truncate">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-white/35 transition group-hover:text-white/60" />
                </a>
              );
            }

            const isOpen = mobileOpenGroup === item.label;
            return (
              <div key={item.label} className="rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    setMobileOpenGroup((cur) => (cur === item.label ? null : item.label))
                  }
                  className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-[15px] font-semibold text-white/90 transition hover:bg-white/10"
                  aria-expanded={isOpen}
                >
                  <span className="truncate">{item.label}</span>
                  <ChevronDown
                    className={[
                      "h-4 w-4 transition-transform",
                      isOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.22, ease: softEase }}
                  className="overflow-hidden"
                >
                  <div className="pb-2 pt-1">
                    {item.children!.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="group ml-1 mr-1 flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-white/72 transition hover:bg-white/10 hover:text-white"
                      >
                        <span className="truncate">{child.label}</span>
                        <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:text-white/55" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
          </div>

          <div className="mt-4 grid gap-2">
            <a
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/14 hover:ring-white/25"
            >
              Contact
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const stickyHeader = (
    <div
      ref={headerRef}
      data-cursor-no-sticky
      className={[
        // Use the app's default font to avoid remote font fetches.
        "fixed left-0 right-0 top-0 z-[1000]",
        // Keep the same "breathing room" as the main header, but let the
        // glass background extend all the way to the top edge.
        "pt-3 sm:pt-4",
        isScrolled ? "pb-3 sm:pb-4" : "",
        // Glass background after scrolling a bit.
        isScrolled
          ? "border-b border-white/[0.05] bg-black/55 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.55)]"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      {headerContent}
    </div>
  );

  const p = parallax.p;
  const textY = Math.round(p * -46); // move up slightly while scrolling
  const badgeY = Math.round(p * -26);
  const mediaY = Math.round(p * 24); // subtle counter-move
  const mediaScale = 1 + p * 0.04;
  const textOpacity = 1 - p * 0.22;

  return (
    <section
      id="home"
      className="font-sans relative isolate min-h-dvh w-full overflow-hidden rounded-b-[28px] bg-black sm:rounded-b-[40px] lg:rounded-b-[52px]"
    >
      <video
        ref={heroVideoRef}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-100 will-change-transform"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          transform: `translate3d(0, ${mediaY}px, 0) scale(${mediaScale})`,
        }}
        onLoadedMetadata={() => {
          // Slow the hero background video slightly for a calmer feel.
          const el = heroVideoRef.current;
          if (!el) return;
          el.playbackRate = 0.25;
          // Some browsers may not apply rate until playback starts.
          void el.play().catch(() => {});
        }}
        onPlay={() => {
          const el = heroVideoRef.current;
          if (!el) return;
          el.playbackRate = 0.25;
        }}
      >
        <source
          src="/video(1).mp4"
          type="video/mp4"
        />
      </video>

      <div className="relative z-10 mx-auto flex min-h-dvh w-[97%] max-w-none flex-col px-4 pb-5 pt-0 sm:w-[85%] sm:px-6 sm:pb-6 lg:px-8">
        <div aria-hidden="true" style={{ height: headerH }} />

        {showHeader
          ? canPortal
            ? createPortal(stickyHeader, document.body)
            : stickyHeader
          : null}

        {showHeader && mobileOpen && canPortal
          ? createPortal(mobileDrawer, document.body)
          : null}

        <div
          className="grid flex-1 justify-items-center gap-10 pb-14 pt-24 sm:pb-20 sm:pt-10 lg:justify-items-start lg:items-center lg:gap-14 lg:pb-24 lg:pt-14 will-change-transform"
          style={{ transform: `translate3d(0, ${textY}px, 0)`, opacity: textOpacity }}
        >
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <motion.div
              className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-black/35 px-3.5 py-2 text-xs font-medium text-white/78 backdrop-blur-md sm:px-4 lg:mx-0"
              variants={appear}
              initial="hidden"
              animate="show"
              transition={softTransition}
              style={{ transform: `translate3d(0, ${badgeY}px, 0)` }}
            >
              <span
                aria-hidden="true"
                className="h-1 w-1 shrink-0 rounded-full bg-[color-mix(in_oklab,var(--brand-400)_78%,white)] ring-1 ring-white/25"
              />
              <BlurText
                as="span"
                text="Rules-first trading education"
                delay={12}
                stepDuration={0.22}
                start
                animateBy="words"
                direction="top"
                className="inline-flex tracking-tight"
              />
            </motion.div>

            <div className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-[0.01em] text-white sm:text-6xl">
              <span className="inline-flex flex-wrap items-baseline justify-center gap-x-3 lg:justify-start">
                <BlurText
                  as="span"
                  text="Trade with"
                  delay={12}
                  stepDuration={0.22}
                  start
                  animateBy="words"
                  direction="top"
                  className="flex-nowrap"
                />
                <BlurText
                  as="span"
                  text="discipline."
                  delay={12}
                  stepDuration={0.22}
                  start
                  animateBy="words"
                  direction="top"
                  className="bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-400)_92%,white),var(--brand-700))] bg-clip-text text-transparent"
                />
              </span>
              <span className="inline-block w-2 sm:w-2.5" aria-hidden="true" />
              <BlurText
                as="span"
                text="Build a repeatable system"
                delay={12}
                stepDuration={0.22}
                start
                animateBy="words"
                direction="top"
                className="justify-center lg:justify-start"
              />
            </div>

            <motion.p
              className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base sm:leading-7 lg:mx-0"
              variants={appear}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.8, ease: softEase, delay: 0.14 }}
            >
              <BlurText
                as="span"
                text="A structured, rules-first approach to risk, entries, and execution."
                delay={10}
                stepDuration={0.2}
                start
                animateBy="words"
                direction="top"
                className="justify-center lg:justify-start"
              />
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              variants={appear}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.8, ease: softEase, delay: 0.22 }}
            >
              <motion.a
                href="#free"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-400)_92%,white),var(--brand-700))] px-5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_60px_color-mix(in_oklab,var(--brand-400)_28%,transparent)] transition hover:brightness-110 active:brightness-105"
                variants={buttonAppear}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.85, ease: softEase, delay: 0.28 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.995 }}
              >
                <BlurText
                  as="span"
                  text="Join the free class"
                  delay={10}
                  stepDuration={0.2}
                  start
                  animateBy="words"
                  direction="top"
                />
              </motion.a>
              <motion.a
                href="#program"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/14 hover:ring-white/25"
                variants={buttonAppear}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.85, ease: softEase, delay: 0.34 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
              >
                <BlurText
                  as="span"
                  text="View the program"
                  delay={10}
                  stepDuration={0.2}
                  start
                  animateBy="words"
                  direction="top"
                />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}
