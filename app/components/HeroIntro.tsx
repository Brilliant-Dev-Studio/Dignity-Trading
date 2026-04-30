"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import BlurText from "./BlurText";
import BorderGlow from "./BorderGlow";
import LightRays from "./LightRays";
import StarBorder from "./StarBorder";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const appear = {
  hidden: { opacity: 0, y: -8, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function HeroIntro() {
  const [step, setStep] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [headerH, setHeaderH] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const [canPortal, setCanPortal] = useState(false);
  const lastScrollYRef = useRef(0);

  const steps = useMemo(
    () => [
      { id: "logo", delay: 120 },
      { id: "menu", delay: 140 },
      { id: "headerCta", delay: 160 },
      { id: "pill", delay: 160 },
      { id: "motto", delay: 160 },
    ],
    [],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Start quickly but not instantly (feels smoother)
      await wait(80);
      setShowButtons(false);
      for (let i = 0; i < steps.length; i++) {
        if (!mounted) return;
        setStep(i + 1);
        await wait(steps[i].delay);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [steps]);

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
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const sticky = y > 100;
        setIsSticky(sticky);

        // Hide on scroll down, show on scroll up (only after sticky activates).
        if (!sticky) {
          setIsHeaderHidden(false);
          lastScrollYRef.current = y;
          return;
        }

        const lastY = lastScrollYRef.current;
        const dy = y - lastY;
        const deadzone = 4;
        if (dy > deadzone) setIsHeaderHidden(true);
        else if (dy < -deadzone) setIsHeaderHidden(false);
        lastScrollYRef.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setCanPortal(true);
  }, []);

  const headerContent = (
    <div
      className="mx-auto w-[95%] max-w-none px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-2 sm:py-3">
        <motion.a
          href="#home"
          className="flex items-center gap-3 justify-self-start"
          variants={appear}
          initial="hidden"
          animate={step >= 1 ? "show" : "hidden"}
          transition={{ duration: 0.45, ease: "easeOut" }}
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
          className="hidden justify-self-center md:block"
          variants={appear}
          initial="hidden"
          animate={step >= 2 ? "show" : "hidden"}
          transition={{ duration: 0.45, ease: "easeOut" }}
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
          >
            <nav className="flex items-center gap-2 rounded-full px-2 py-1">
              {[
                { label: "Home", href: "#home" },
                { label: "Mission", href: "#mission" },
                { label: "Learn", href: "#learn" },
                { label: "Free", href: "#free" },
                { label: "Program", href: "#program" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "Blog", href: "#blog" },
                { label: "Disclaimer", href: "#disclaimer" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </BorderGlow>
        </motion.div>

        <motion.div
          className="justify-self-end"
          variants={appear}
          initial="hidden"
          animate={step >= 3 ? "show" : "hidden"}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <StarBorder
            as="a"
            href="https://www.youtube.com/@dignityforexcryptostocktra5933"
            target="_blank"
            rel="noopener noreferrer"
            color="color-mix(in oklab, var(--brand-400) 85%, white)"
            speed="5s"
            thickness={2}
            className="hidden sm:inline-block"
          >
            Join Youtube
          </StarBorder>
        </motion.div>
      </div>
    </div>
  );

  const stickyHeader = (
    <header
      ref={headerRef}
      className={[
        "fixed left-0 right-0 top-0 z-[1000]",
        "transition-transform duration-300 ease-out will-change-transform",
        isHeaderHidden ? "-translate-y-full pointer-events-none" : "translate-y-0",
        isSticky
          ? "border-b border-white/10 bg-black/55 backdrop-blur-xl"
          : "bg-transparent",
      ].join(" ")}
    >
      {headerContent}
    </header>
  );

  return (
    <section
      id="home"
      className="relative isolate min-h-dvh w-full overflow-hidden bg-black"
    >
      <video
        className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-95"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4"
          type="video/mp4"
        />
      </video>

      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 [background-image:radial-gradient(900px_520px_at_85%_78%,rgba(84,168,230,0.26),transparent_60%),radial-gradient(700px_420px_at_18%_88%,rgba(47,102,212,0.20),transparent_62%),linear-gradient(to_top,rgba(84,168,230,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_460px_at_18%_22%,color-mix(in_oklab,var(--brand-400)_18%,transparent),transparent_72%),linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.52))]" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-12 [background-image:radial-gradient(rgba(255,255,255,0.24)_1px,transparent_1px)] [background-size:14px_14px]" />

      <div className="pointer-events-none absolute inset-0 z-0 opacity-85 mix-blend-screen [filter:contrast(1.25)_saturate(1.15)]">
        <LightRays
          raysOrigin="top-center"
          raysColor="#a8e8ff"
          raysSpeed={1.45}
          lightSpread={1.25}
          rayLength={1.6}
          followMouse={true}
          mouseInfluence={0.14}
          noiseAmount={0.08}
          distortion={0.06}
          fadeDistance={1.25}
          saturation={1.0}
        />
      </div>

      {/* Fade hero into the next black section (no blur seams) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,1)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-[95%] max-w-none flex-col px-4 pb-5 pt-0 sm:px-6 sm:pb-6 lg:px-8">
        <div aria-hidden="true" style={{ height: headerH }} />

        {canPortal
          ? createPortal(stickyHeader, document.body)
          : stickyHeader}

        <div className="grid flex-1 gap-10 pb-14 pt-14 sm:pb-20 sm:pt-20 lg:items-center lg:gap-14 lg:pb-24 lg:pt-24">
          <div className="max-w-2xl">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-xs font-medium text-white/80 ring-1 ring-white/10 backdrop-blur"
              variants={appear}
              initial="hidden"
              animate={step >= 4 ? "show" : "hidden"}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <span
                aria-hidden="true"
                className="text-[color-mix(in_oklab,rgba(255,215,90,1)_92%,white)]"
              >
                ★
              </span>
              <span>Rules-first trading education</span>
            </motion.div>

            <div className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-[0.01em] text-white sm:text-6xl">
              {step >= 5 ? (
                <>
                  <span className="inline-flex flex-wrap items-baseline gap-x-3">
                    <BlurText
                      as="span"
                      text="Trade with"
                      delay={120}
                      animateBy="words"
                      direction="top"
                      className="flex-nowrap"
                    />
                    <BlurText
                      as="span"
                      text="discipline."
                      delay={120}
                      animateBy="words"
                      direction="top"
                      className="bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-400)_92%,white),var(--brand-700))] bg-clip-text text-transparent"
                    />
                  </span>
                  <BlurText
                    as="span"
                    text="Build a repeatable system"
                    delay={120}
                    animateBy="words"
                    direction="top"
                    onAnimationComplete={() => setShowButtons(true)}
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
              animate={step >= 5 ? "show" : "hidden"}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              A structured, rules-first approach to risk, entries, and execution.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              variants={appear}
              initial="hidden"
              animate={showButtons ? "show" : "hidden"}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <a
                href="#free"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-400)_92%,white),var(--brand-700))] px-5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_60px_color-mix(in_oklab,var(--brand-400)_28%,transparent)] transition hover:brightness-110 active:brightness-105"
              >
                Join the free class
              </a>
              <a
                href="#program"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/14 hover:ring-white/25"
              >
                View the program
              </a>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

