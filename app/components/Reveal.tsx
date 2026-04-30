"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

export type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  scaleFrom?: number;
  duration?: number;
  once?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 10,
  blur = 8,
  scaleFrom = 0.985,
  duration = 0.5,
  once = true,
  threshold = 0.01,
  // Trigger when the element reaches the "focus band" (a bit earlier than center).
  rootMargin = "-25% 0px -35% 0px",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, rootMargin, threshold]);

  const initial = useMemo(
    () => ({ opacity: 0, y, scale: scaleFrom, filter: `blur(${blur}px)` }),
    [y, blur, scaleFrom],
  );
  const animate = useMemo(
    () => ({ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }),
    [],
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={inView ? animate : initial}
      transition={{ duration, delay, ease: "easeOut" }}
      style={{ willChange: "transform, filter, opacity" }}
    >
      {children}
    </motion.div>
  );
}

