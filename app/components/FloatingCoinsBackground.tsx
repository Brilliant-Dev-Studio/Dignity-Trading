"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type FloatingCoinsBackgroundProps = {
  count?: number;
  className?: string;
  showGradient?: boolean;
  opacityMin?: number;
  opacityMax?: number;
};

type CoinSpec = {
  id: string;
  src: string;
  size: number;
  left: string;
  top: string;
  opacity: number;
  rotateDeg: number;
  floatDurationMs: number;
  floatDelayMs: number;
  driftDurationMs: number;
  driftDelayMs: number;
};

const COIN_SOURCES = ["/bitcoin.png", "/ethum.png", "/dogeCoin.png", "/sol.png"];

function rand01() {
  // crypto-based randomness to avoid predictable sequences
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] / 0xffffffff;
  }
  return Math.random();
}

function randRange(min: number, max: number) {
  return min + (max - min) * rand01();
}

export default function FloatingCoinsBackground({
  count = 12,
  className,
  showGradient = true,
  opacityMin = 0.22,
  opacityMax = 0.48,
}: FloatingCoinsBackgroundProps) {
  const [coins, setCoins] = useState<CoinSpec[] | null>(null);

  useEffect(() => {
    const COUNT = Math.max(1, Math.min(40, count));
    const list: CoinSpec[] = [];

    // Scatter coins across the screen without clumping:
    // split viewport into cells, then jitter within each cell.
    const cols = 6;
    const rows = 5;
    const cells: Array<{ x: number; y: number }> = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({ x: c, y: r });
      }
    }
    // shuffle cells
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(randRange(0, i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    for (let i = 0; i < COUNT; i++) {
      const src = COIN_SOURCES[Math.floor(randRange(0, COIN_SOURCES.length))];
      const size = Math.round(randRange(78, 168));
      const cell = cells[i % cells.length];

      const cellW = 100 / cols;
      const cellH = 100 / rows;
      const gutter = 2.2; // keep away from edges a bit
      const jitterX = randRange(gutter, cellW - gutter);
      const jitterY = randRange(gutter, cellH - gutter);

      const left = `${(cell.x * cellW + jitterX).toFixed(2)}%`;
      const top = `${(cell.y * cellH + jitterY).toFixed(2)}%`;
      const opacity = Number(randRange(opacityMin, opacityMax).toFixed(2));
      const rotateDeg = Math.round(randRange(-22, 22));

      const floatDurationMs = Math.round(randRange(4600, 7800));
      const driftDurationMs = Math.round(randRange(8200, 14600));
      const floatDelayMs = Math.round(randRange(0, 1200));
      const driftDelayMs = Math.round(randRange(0, 1200));

      list.push({
        id: `coin-${i}-${Math.round(randRange(1000, 9999))}`,
        src,
        size,
        left,
        top,
        opacity,
        rotateDeg,
        floatDurationMs,
        floatDelayMs,
        driftDurationMs,
        driftDelayMs,
      });
    }

    setCoins(list);
  }, [count, opacityMax, opacityMin]);

  // Avoid hydration mismatch: render nothing on the server, generate on mount.
  if (!coins) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className ?? ""}`}
    >
      {showGradient ? (
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_20%,rgba(84,168,230,0.09),transparent_64%),radial-gradient(900px_520px_at_82%_76%,rgba(255,190,55,0.05),transparent_66%)]" />
      ) : null}

      {coins.map((coin) => {
        return (
          <div
            key={coin.id}
            className="absolute"
            style={{
              left: coin.left,
              top: coin.top,
            }}
          >
            <div
              className="coinFloat"
              style={
                {
                  ["--floatDuration" as any]: `${coin.floatDurationMs}ms`,
                  ["--floatDelay" as any]: `${coin.floatDelayMs}ms`,
                  ["--driftDuration" as any]: `${coin.driftDurationMs}ms`,
                  ["--driftDelay" as any]: `${coin.driftDelayMs}ms`,
                  opacity: coin.opacity,
                  filter: "saturate(1.12) contrast(1.05)",
                  transform: `rotate(${coin.rotateDeg}deg)`,
                } as CSSProperties
              }
            >
              <Image
                src={coin.src}
                alt=""
                width={coin.size}
                height={coin.size}
                className="rounded-full object-contain drop-shadow-[0_22px_60px_rgba(0,0,0,0.68)]"
                sizes={`${coin.size}px`}
                priority={false}
              />
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .coinFloat {
          animation:
            coinFloatY var(--floatDuration) ease-in-out var(--floatDelay) infinite,
            coinDriftX var(--driftDuration) ease-in-out var(--driftDelay) infinite;
        }

        @keyframes coinFloatY {
          0% {
            translate: 0 0;
          }
          50% {
            translate: 0 -14px;
          }
          100% {
            translate: 0 0;
          }
        }

        @keyframes coinDriftX {
          0% {
            margin-left: 0px;
          }
          50% {
            margin-left: 18px;
          }
          100% {
            margin-left: 0px;
          }
        }
      `}</style>
    </div>
  );
}

