"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "oklch(0.55 0.13 160)", // emerald
  "oklch(0.7 0.15 75)", // amber
  "oklch(0.65 0.2 27)", // red
  "oklch(0.7 0.16 310)", // violet
  "oklch(0.6 0.12 230)", // blue
];

/** Affiche une pluie de confettis pendant ~2.5s. */
export function Confetti({ fire }: { fire: number }) {
  const [pieces, setPieces] = useState<
    { id: number; left: number; delay: number; color: string; rotate: number }[]
  >([]);

  useEffect(() => {
    if (fire === 0) return;
    const n = 36;
    const arr = Array.from({ length: n }, (_, i) => ({
      id: i + fire * 1000,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 2800);
    return () => clearTimeout(t);
  }, [fire]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: p.id % 2 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
