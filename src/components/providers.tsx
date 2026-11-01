"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useLexicon } from "@/lib/store";

/** Providers globaux : thème clair/sombre + application de la taille de police. */
export function Providers({ children }: { children: React.ReactNode }) {
  const fontScale = useLexicon((s) => s.settings.fontScale);
  const resetDailyCountersIfNeeded = useLexicon((s) => s.resetDailyCountersIfNeeded);

  // Applique l'échelle de police réglable.
  useEffect(() => {
    document.documentElement.style.setProperty("--app-font-scale", String(fontScale));
  }, [fontScale]);

  // Réinitialise les compteurs quotidiens au besoin (série, objectifs).
  useEffect(() => {
    resetDailyCountersIfNeeded();
  }, [resetDailyCountersIfNeeded]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
