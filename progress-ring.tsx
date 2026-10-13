"use client";

import { motion } from "framer-motion";

/** Anneau de progression circulaire (SVG). */
export function ProgressRing({
  progress,
  size = 36,
  strokeWidth = 3.5,
  className,
  showLabel = true,
}: {
  /** 0-100. */
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <div
      className={"relative inline-flex items-center justify-center " + (className ?? "")}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute text-[10px] font-semibold tabular-nums text-foreground"
          style={{ fontSize: Math.max(8, size / 4.5) }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
