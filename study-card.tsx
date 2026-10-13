"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card as UICard } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AccentColor = "primary" | "destructive" | "teal" | "violet" | "amber" | "rose";

const ACCENT_CLASSES: Record<AccentColor, { border: string; iconBg: string; text: string; bar: string }> = {
  primary: {
    border: "border-l-primary",
    iconBg: "bg-primary/15 text-primary",
    text: "text-primary",
    bar: "bg-primary",
  },
  destructive: {
    border: "border-l-destructive",
    iconBg: "bg-destructive/15 text-destructive",
    text: "text-destructive",
    bar: "bg-destructive",
  },
  teal: {
    border: "border-l-teal-500",
    iconBg: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    text: "text-teal-600 dark:text-teal-300",
    bar: "bg-teal-500",
  },
  violet: {
    border: "border-l-violet-500",
    iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    text: "text-violet-600 dark:text-violet-300",
    bar: "bg-violet-500",
  },
  amber: {
    border: "border-l-amber-500",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    text: "text-amber-600 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  rose: {
    border: "border-l-rose-500",
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-300",
    bar: "bg-rose-500",
  },
};

/**
 * Carte du hub d'étude avec bordure gauche colorée, badge compteur optionnel
 * et micro-interaction au survol/pressé.
 */
export function StudyCard({
  icon: Icon,
  title,
  description,
  accent = "primary",
  count,
  onClick,
  disabled,
  footer,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent?: AccentColor;
  /** Si > 0, affiche un badge compteur à droite. */
  count?: number;
  onClick: () => void;
  disabled?: boolean;
  footer?: React.ReactNode;
}) {
  const c = ACCENT_CLASSES[accent];
  return (
    <motion.div
      whileHover={disabled ? undefined : { scale: 1.01, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <UICard
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={
          disabled
            ? undefined
            : (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
        }
        className={cn(
          "p-4 cursor-pointer transition-colors border-l-4 overflow-hidden",
          c.border,
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "bg-card"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-xl shrink-0",
                c.iconBg
              )}
            >
              <Icon className="h-5 w-5" />
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    "absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-md tabular-nums",
                    c.bar
                  )}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{title}</p>
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            </div>
          </div>
          {!disabled && <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />}
        </div>
        {footer && <div className="mt-3">{footer}</div>}
      </UICard>
    </motion.div>
  );
}
