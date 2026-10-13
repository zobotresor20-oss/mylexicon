"use client";

import { useEffect } from "react";

/**
 * Enregistre le service worker une fois l'app chargée (côté client uniquement).
 * Actif en production ET en dev (pour tester l'installabilité PWA localement).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    // En dev, on attend le chargement complet pour éviter les conflits avec HMR.
    const isDev = process.env.NODE_ENV !== "production";
    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          if (isDev) console.log("[PWA] Service Worker enregistré", reg.scope);
        })
        .catch((err) => {
          if (isDev) console.warn("[PWA] Échec SW:", err);
        });
    };
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);
  return null;
}
