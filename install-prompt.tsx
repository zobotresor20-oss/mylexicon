"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Détecte l'événement beforeinstallprompt (Chrome/Android/Edge desktop) et
 * affiche une bannière d'installation. Sur iOS Safari, affiche des instructions
 * car beforeinstallprompt n'est pas supporté.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Détecte si déjà installé (mode standalone).
  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore iOS Safari
      window.navigator.standalone === true);

  useEffect(() => {
    if (isStandalone) return; // déjà installé

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Détection iOS Safari (pas de beforeinstallprompt sur iOS).
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIos && isSafari) {
      const hintDismissed = localStorage.getItem("mylexicon-ios-hint-dismissed");
      if (!hintDismissed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowIosHint(true);
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isStandalone]);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }

  function dismissIos() {
    setShowIosHint(false);
    setDismissed(true);
    localStorage.setItem("mylexicon-ios-hint-dismissed", "1");
  }

  if (isStandalone || dismissed) return null;

  return (
    <AnimatePresence>
      {(deferredPrompt || showIosHint) && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl border-2 border-primary/40 bg-card p-4 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Installer MyLexicon</p>
              {deferredPrompt ? (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Accédez à votre dictionnaire hors ligne, directement depuis
                  votre écran d'accueil.
                </p>
              ) : (
                <div className="text-xs text-muted-foreground mt-0.5 space-y-1">
                  <p>Pour installer sur iPhone/iPad :</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Touchez l'icône Partager</li>
                    <li>« Sur l'écran d'accueil »</li>
                  </ol>
                </div>
              )}
            </div>
            <button
              onClick={() => (deferredPrompt ? setDismissed(true) : dismissIos())}
              className="text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {deferredPrompt && (
            <Button
              onClick={handleInstall}
              className="w-full mt-3 h-9"
              size="sm"
            >
              <Download className="h-4 w-4" /> Installer l'application
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
