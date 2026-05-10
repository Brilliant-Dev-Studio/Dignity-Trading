"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./StickyCursor.module.css";

type Vec2 = { x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function StickyCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef<Vec2>({ x: 0, y: 0 });
  const dot = useRef<Vec2>({ x: 0, y: 0 });
  const ring = useRef<Vec2>({ x: 0, y: 0 });
  const sticky = useRef<HTMLElement | null>(null);
  const stickyRect = useRef<DOMRect | null>(null);
  const rafId = useRef<number | null>(null);

  const canUse = useMemo(() => {
    if (typeof window === "undefined") return false;
    return matchMedia("(pointer:fine)").matches;
  }, []);

  useEffect(() => {
    if (!canUse) return;
    setEnabled(true);
  }, [canUse]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    const shouldDisableForTarget = (el: Element | null) => {
      if (!el) return false;
      return Boolean(el.closest("input,textarea,select,[contenteditable='true']"));
    };

    const isStickyTarget = (el: Element | null) => {
      if (!el) return null;
      if (shouldDisableForTarget(el)) return null;
      // Skip primary nav / headers: sticky ring + glow reads as noisy over dense menus.
      if (el.closest("header,[data-cursor-no-sticky]")) return null;
      return (
        (el.closest(
          'a,button,[role="button"],[data-cursor-sticky]',
        ) as HTMLElement | null) ?? null
      );
    };

    const onOver = (e: MouseEvent) => {
      const t = isStickyTarget(e.target as Element | null);
      if (!t) return;
      sticky.current = t;
      stickyRect.current = t.getBoundingClientRect();
    };

    const onOut = (e: MouseEvent) => {
      const t = isStickyTarget(e.target as Element | null);
      if (!t) return;
      if (sticky.current === t) {
        sticky.current = null;
        stickyRect.current = null;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });

    const update = () => {
      const dotEl = dotRef.current;
      const ringEl = ringRef.current;
      if (!dotEl || !ringEl) {
        rafId.current = requestAnimationFrame(update);
        return;
      }

      const m = mouse.current;
      const st = sticky.current;
      const rect = stickyRect.current;

      let target: Vec2 = m;
      let stickStrength = 0;
      let ringW = 42;
      let ringH = 42;
      if (st && rect) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = m.x - cx;
        const dy = m.y - cy;
        const dist = Math.hypot(dx, dy);
        stickStrength = clamp(1 - dist / 150, 0, 1);
        target = {
          x: cx + dx * 0.1,
          y: cy + dy * 0.1,
        };

        ringW = clamp(rect.width + 18, 42, 110);
        ringH = clamp(rect.height + 14, 38, 70);
      }

      // Smoothly follow (ring steadier; dot snappier).
      dot.current.x += (target.x - dot.current.x) * 0.42;
      dot.current.y += (target.y - dot.current.y) * 0.42;

      const ringTarget = st ? target : m;
      ring.current.x += (ringTarget.x - ring.current.x) * 0.22;
      ring.current.y += (ringTarget.y - ring.current.y) * 0.22;

      // Size/opacity changes on sticky
      ringEl.style.width = `${ringW}px`;
      ringEl.style.height = `${ringH}px`;
      ringEl.style.borderRadius = `${Math.max(ringH, 28)}px`;
      ringEl.style.opacity = `${0.38 + stickStrength * 0.28}`;

      const dotSize = 10 + stickStrength * 6;
      dotEl.style.width = `${dotSize}px`;
      dotEl.style.height = `${dotSize}px`;
      dotEl.style.opacity = `${0.62 + stickStrength * 0.26}`;

      dotEl.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate3d(-50%, -50%, 0)`;

      // Keep rect fresh if layout moves
      if (st) stickyRect.current = st.getBoundingClientRect();

      rafId.current = requestAnimationFrame(update);
    };
    rafId.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={styles.cursor} aria-hidden="true">
      <div
        ref={ringRef}
        className={[styles.ring, !visible ? styles.hidden : ""]
          .filter(Boolean)
          .join(" ")}
      />
      <div
        ref={dotRef}
        className={[styles.dot, !visible ? styles.hidden : ""]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
}

