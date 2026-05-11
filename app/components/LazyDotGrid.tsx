"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const DotGrid = dynamic(() => import("@/app/components/DotGrid"), { ssr: false });

export default function LazyDotGrid() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[1] opacity-18">
      {active ? (
        <DotGrid
          dotSize={2}
          gap={14}
          baseColor="#5e73b8"
          activeColor="#7fcfff"
          proximity={110}
          shockRadius={260}
          shockStrength={3}
          resistance={500}
          returnDuration={1.9}
        />
      ) : null}
    </div>
  );
}
