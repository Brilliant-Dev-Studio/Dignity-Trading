"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

import BlurText from "./BlurText";
import BorderGlow from "./BorderGlow";
import StarBorder from "./StarBorder";

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

export default function HeroIntro() {
  const [step, setStep] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [headerH, setHeaderH] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [parallax, setParallax] = useState({ p: 0, vh: 0 });
  const headerRef = useRef<HTMLDivElement | null>(null);
  const didBootRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const canPortal = typeof document !== "undefined";

  useEffect(() => {
    // Prevent double-running in React StrictMode dev, which can cause animation flicker.
    if (didBootRef.current) return;
    didBootRef.current = true;

    const t = window.setTimeout(() => {
      // Kick off everything together (no sequential waiting).
      setStep(5);
    }, 120);
    return () => {
      window.clearTimeout(t);
    };
  }, []);

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
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const cancelCloseMenu = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleCloseMenu = () => {
    cancelCloseMenu();
    closeTimerRef.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

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
          { label: "Free Intermediate Trading Course", href: "/courses?level=intermediate" },
          { label: "Professional Advance Trading Course", href: "/courses?level=advance" },
        ],
      },
      { label: "Market Anaylsis", href: "/resources" },
      { label: "Forex Tools", href: "/tools" },
      { label: "Blog", href: "/blog" },
      { label: "Testimonial", href: "/#testimonial" },
      { label: "Open Trading Account", href: "/#open-account" },
      { label: "Contact", href: "/contact" },
      { label: "Disclaimer", href: "/#disclaimer" },
    ],
    [],
  );

  // Keep header padding/height consistent between initial + sticky states.
  // Sticky state should only change placement/background, not vertical rhythm.
  const headerRowH = "h-12";

  const headerContent = (
    <div
      className="mx-auto w-[95%] max-w-none px-4 sm:px-6 lg:px-8"
    >
      <div
        className={`grid ${headerRowH} grid-cols-[auto_1fr_auto] items-center gap-4 min-w-0`}
      >
        <motion.a
          href="#home"
          className="flex items-center gap-3 justify-self-start shrink-0"
          variants={appear}
          initial="hidden"
          animate={step >= 1 ? "show" : "hidden"}
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
          animate={step >= 2 ? "show" : "hidden"}
          transition={softTransition}
        >
          <BorderGlow
            borderRadius={9999}
            glowRadius={22}
            edgeSensitivity={10}
            coneSpread={35}
            glowIntensity={1.05}
            backgroundColor="rgba(255,255,255,0.05)"
            colors={["#54a8e6", "#2f66d4", "#243b9c"]}
            fillOpacity={0.35}
            className={`${headerRowH} max-w-full`}
          >
            <div
              className={`flex ${headerRowH} items-center gap-2 rounded-full px-2 max-w-full overflow-visible`}
            >
              {menu.map((item, idx) =>
                "children" in item && item.children ? (
                  <div
                    key={item.label}
                    className={[
                      "relative hero-nav-item",
                      step >= 2 ? "is-in" : "",
                    ].join(" ")}
                    style={{ ["--i" as any]: idx }}
                    onMouseEnter={() => {
                      cancelCloseMenu();
                      setOpenMenu(item.label);
                    }}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu((cur) => (cur === item.label ? null : item.label))
                      }
                      aria-haspopup="menu"
                      aria-expanded={openMenu === item.label}
                      className={`inline-flex ${headerRowH} items-center gap-1.5 rounded-full px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 whitespace-nowrap`}
                    >
                      {item.label}
                      <ChevronDown
                        className={[
                          "h-3.5 w-3.5 transition-transform",
                          openMenu === item.label ? "rotate-180" : "rotate-0",
                        ].join(" ")}
                      />
                    </button>

                    {openMenu === item.label ? (
                      <motion.div
                        role="menu"
                        onMouseEnter={cancelCloseMenu}
                        onMouseLeave={scheduleCloseMenu}
                        className="absolute left-0 top-full z-[1100] mt-2 min-w-52 overflow-hidden rounded-xl border border-white/10 bg-black/80 p-1 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                        variants={appear}
                        initial="hidden"
                        animate="show"
                        transition={{ duration: 0.55, ease: softEase }}
                      >
                        {item.children.map((child) => (
                          <motion.a
                            key={child.label}
                            href={child.href}
                            role="menuitem"
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                            variants={navItem}
                            transition={{ duration: 0.65, ease: softEase }}
                          >
                            <span>{child.label}</span>
                            <span className="text-[10px] text-white/35">
                              ↗
                            </span>
                          </motion.a>
                        ))}
                      </motion.div>
                    ) : null}
                  </div>
                ) : (
                  <a
                    key={item.label}
                    href={"href" in item ? item.href : "#"}
                    className={[
                      `inline-flex ${headerRowH} items-center rounded-full px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white`,
                      "hero-nav-item",
                      step >= 2 ? "is-in" : "",
                    ].join(" ")}
                    style={{ ["--i" as any]: idx }}
                  >
                    {item.label}
                  </a>
                ),
              )}
            </div>
          </BorderGlow>
        </motion.div>

        <motion.div
          className="justify-self-end shrink-0"
          variants={appear}
          initial="hidden"
          animate={step >= 3 ? "show" : "hidden"}
          transition={softTransition}
        >
          {/* Join Youtube CTA removed (header already dense) */}
        </motion.div>
      </div>
    </div>
  );

  const stickyHeader = (
    <div
      ref={headerRef}
      className={[
        // Use the app's default font to avoid remote font fetches.
        "fixed left-0 right-0 top-0 z-[1000]",
        // Keep the same "breathing room" as the main header, but let the
        // glass background extend all the way to the top edge.
        "pt-3 sm:pt-4",
        isScrolled ? "pb-3 sm:pb-4" : "",
        // Glass background after scrolling a bit.
        isScrolled
          ? "bg-black/55 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.55)] ring-1 ring-white/12"
          : "bg-transparent",
      ].join(" ")}
    >
      {headerContent}
    </div>
  );

  const heroStart = step >= 5;
  const p = parallax.p;
  const textY = Math.round(p * -46); // move up slightly while scrolling
  const badgeY = Math.round(p * -26);
  const mediaY = Math.round(p * 24); // subtle counter-move
  const mediaScale = 1 + p * 0.04;
  const textOpacity = 1 - p * 0.22;

  return (
    <section
      id="home"
      className="font-hero relative isolate min-h-dvh w-full overflow-hidden rounded-b-[64px] bg-black sm:rounded-b-[84px] lg:rounded-b-[110px]"
    >
      <video
        ref={heroVideoRef}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-100 will-change-transform"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
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

      <div className="relative z-10 mx-auto flex min-h-dvh w-[85%] max-w-none flex-col px-4 pb-5 pt-0 sm:px-6 sm:pb-6 lg:px-8">
        <div aria-hidden="true" style={{ height: headerH }} />

        {canPortal
          ? createPortal(stickyHeader, document.body)
          : stickyHeader}

        <div
          className="grid flex-1 gap-10 pb-14 pt-4 sm:pb-20 sm:pt-10 lg:items-center lg:gap-14 lg:pb-24 lg:pt-14 will-change-transform"
          style={{ transform: `translate3d(0, ${textY}px, 0)`, opacity: textOpacity }}
        >
          <div className="max-w-2xl">
            <motion.div
              className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-black/35 px-3.5 py-2 text-xs font-medium text-white/78 backdrop-blur-md sm:px-4"
              variants={appear}
              initial="hidden"
              animate={step >= 4 ? "show" : "hidden"}
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
                delay={70}
                start={step >= 4}
                animateBy="words"
                direction="top"
                className="inline-flex tracking-tight"
              />
            </motion.div>

            <div className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-[0.01em] text-white sm:text-6xl">
              {step >= 5 ? (
                <>
                  <span className="inline-flex flex-wrap items-baseline gap-x-3">
                    <BlurText
                      as="span"
                      text="Trade with"
                      delay={70}
                      start={heroStart}
                      animateBy="words"
                      direction="top"
                      className="flex-nowrap"
                    />
                    <BlurText
                      as="span"
                      text="discipline."
                      delay={70}
                      start={heroStart}
                      animateBy="words"
                      direction="top"
                      className="bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-400)_92%,white),var(--brand-700))] bg-clip-text text-transparent"
                    />
                  </span>
                  <span className="inline-block w-2 sm:w-2.5" aria-hidden="true" />
                  <BlurText
                    as="span"
                    text="Build a repeatable system"
                    delay={70}
                    start={heroStart}
                    animateBy="words"
                    direction="top"
                  />
                </>
              ) : (
                <span className="opacity-0">Loading</span>
              )}
            </div>

            <motion.p
              className="mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base sm:leading-7"
              variants={appear}
              initial="hidden"
              animate={heroStart ? "show" : "hidden"}
              transition={{ duration: 0.8, ease: softEase, delay: 0.14 }}
            >
              <BlurText
                as="span"
                text="A structured, rules-first approach to risk, entries, and execution."
                delay={55}
                start={heroStart}
                animateBy="words"
                direction="top"
              />
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              variants={appear}
              initial="hidden"
              animate={heroStart ? "show" : "hidden"}
              transition={{ duration: 0.8, ease: softEase, delay: 0.22 }}
            >
              <motion.a
                href="#free"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-400)_92%,white),var(--brand-700))] px-5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_60px_color-mix(in_oklab,var(--brand-400)_28%,transparent)] transition hover:brightness-110 active:brightness-105"
                variants={buttonAppear}
                initial="hidden"
                animate={heroStart ? "show" : "hidden"}
                transition={{ duration: 0.85, ease: softEase, delay: 0.28 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.995 }}
              >
                <BlurText
                  as="span"
                  text="Join the free class"
                  delay={60}
                  start={heroStart}
                  animateBy="words"
                  direction="top"
                />
              </motion.a>
              <motion.a
                href="#program"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/14 hover:ring-white/25"
                variants={buttonAppear}
                initial="hidden"
                animate={heroStart ? "show" : "hidden"}
                transition={{ duration: 0.85, ease: softEase, delay: 0.34 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
              >
                <BlurText
                  as="span"
                  text="View the program"
                  delay={60}
                  start={heroStart}
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
