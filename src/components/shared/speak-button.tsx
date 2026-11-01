"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { speak } from "@/lib/speech";
import { useLexicon } from "@/lib/store";
import { Button } from "@/components/ui/button";

/** Bouton de prononciation d'un texte anglais, avec effet d'ondes pendant la lecture. */
export function SpeakButton({
  text,
  className,
  size = "icon",
  label,
}: {
  text: string;
  className?: string;
  size?: "icon" | "sm" | "default";
  label?: string;
}) {
  const accent = useLexicon((s) => s.settings.accent);
  const rate = useLexicon((s) => s.settings.speechRate);
  const [speaking, setSpeaking] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  // Nettoyage si le composant se démonte pendant la lecture.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (speaking) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(text, accent, rate);
    // Surveillance de fin d'élocution.
    const check = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setSpeaking(false);
        return;
      }
      if (!window.speechSynthesis.speaking) {
        setSpeaking(false);
        return;
      }
      stopRef.current = requestAnimationFrame(check);
    };
    // Démarre la vérification après un court délai (la lecture démarre asynchroniquement).
    setTimeout(() => {
      stopRef.current = requestAnimationFrame(check);
    }, 100);
  }

  // Nettoyage du requestAnimationFrame.
  useEffect(() => {
    return () => {
      if (stopRef.current) cancelAnimationFrame(stopRef.current);
    };
  }, []);

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      aria-label={label ?? `Prononcer « ${text} »`}
      className={cn("shrink-0 relative", speaking && "text-primary", className)}
      onClick={handleClick}
    >
      <span className="relative flex items-center justify-center">
        {/* Ondes concentriques pendant la lecture */}
        <AnimatePresence>
          {speaking && (
            <>
              <motion.span
                key="ripple1"
                initial={{ scale: 0.6, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-primary/40"
              />
              <motion.span
                key="ripple2"
                initial={{ scale: 0.6, opacity: 0.5 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.4,
                }}
                className="absolute inset-0 rounded-full bg-primary/30"
              />
            </>
          )}
        </AnimatePresence>
        <Volume2
          className={cn(
            "h-4 w-4 relative transition-colors",
            speaking && "animate-pulse"
          )}
        />
      </span>
    </Button>
  );
}
