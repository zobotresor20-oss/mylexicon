"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  CircleDashed,
  CheckCircle2,
  GraduationCap,
  Award,
  Layers,
  Link2,
  Quote,
} from "lucide-react";
import type { ElementType, WordStatus } from "@/lib/types";

const STATUS_LABEL: Record<WordStatus, string> = {
  incomplete: "Incomplète",
  complete: "Complète",
  learning: "En apprentissage",
  mastered: "Maîtrisée",
};

const STATUS_ICON: Record<WordStatus, React.ComponentType<{ className?: string }>> = {
  incomplete: CircleDashed,
  complete: CheckCircle2,
  learning: GraduationCap,
  mastered: Award,
};

const STATUS_CLASS: Record<WordStatus, string> = {
  incomplete: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200 dark:border-amber-800",
  complete: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
  learning: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200 border-sky-200 dark:border-sky-800",
  mastered: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200 border-violet-200 dark:border-violet-800",
};

export function StatusBadge({
  status,
  className,
  withIcon = true,
}: {
  status: WordStatus;
  className?: string;
  withIcon?: boolean;
}) {
  const Icon = STATUS_ICON[status];
  return (
    <Badge variant="outline" className={cn(STATUS_CLASS[status], "gap-1", className)}>
      {withIcon && <Icon className="h-3 w-3" />}
      {STATUS_LABEL[status]}
    </Badge>
  );
}

const ELEMENT_LABEL: Record<ElementType, string> = {
  chunk: "Chunk",
  collocation: "Collocation",
  expression: "Expression",
};

const ELEMENT_ICON: Record<ElementType, React.ComponentType<{ className?: string }>> = {
  chunk: Layers,
  collocation: Link2,
  expression: Quote,
};

const ELEMENT_CLASS: Record<ElementType, string> = {
  chunk: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200 border-teal-200 dark:border-teal-800",
  collocation: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800",
  expression: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200 border-rose-200 dark:border-rose-800",
};

export function ElementBadge({
  type,
  className,
  withIcon = true,
}: {
  type: ElementType;
  className?: string;
  withIcon?: boolean;
}) {
  const Icon = ELEMENT_ICON[type];
  return (
    <Badge variant="outline" className={cn(ELEMENT_CLASS[type], "gap-1", className)}>
      {withIcon && <Icon className="h-3 w-3" />}
      {ELEMENT_LABEL[type]}
    </Badge>
  );
}

/** Barre de maîtrise 0-5. */
export function MasteryBar({ level, className }: { level: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={`Maîtrise ${level}/5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-4 rounded-full transition-colors",
            i < level ? "bg-emerald-500" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

export { STATUS_LABEL, ELEMENT_LABEL };
