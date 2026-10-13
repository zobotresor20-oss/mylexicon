"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * Carte cliquable accessible qui n'utilise PAS un <button> natif.
 * Permet d'éviter l'imbrication invalide <button> dans <button> quand
 * la carte contient elle-même des boutons (prononciation, actions…).
 * Reste accessible via role="button" + navigation clavier.
 */
export const ClickableCard = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { disabled?: boolean }
>(function ClickableCard({ className, onClick, disabled, children, ...rest }, ref) {
  return (
    <motion.div
      ref={ref}
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? undefined : 0}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          (onClick as ((e: React.MouseEvent) => void) | undefined)?.(
            e as unknown as React.MouseEvent
          );
        }
      }}
      className={cn(
        "relative w-full text-left rounded-xl border bg-card card-elevated transition-all outline-none",
        !disabled &&
          "hover:shadow-md hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer group active:scale-[0.99]",
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
