"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Brain, BarChart3, Settings as SettingsIcon, Plus } from "lucide-react";

import { DictionaryView } from "@/components/dictionary/dictionary-view";
import { SearchView } from "@/components/search/search-view";
import { StudyView } from "@/components/study/study-view";
import { StatsView } from "@/components/stats/stats-view";
import { SettingsView } from "@/components/settings/settings-view";
import { WordFormDialog } from "@/components/dictionary/word-form-dialog";
import { cn } from "@/lib/utils";

type Tab = "dictionary" | "search" | "study" | "stats" | "settings";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dictionary", label: "Dictionnaire", icon: BookOpen },
  { id: "search", label: "Recherche", icon: Search },
  { id: "study", label: "Étudier", icon: Brain },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "settings", label: "Réglages", icon: SettingsIcon },
];

export default function Page() {
  const [tab, setTab] = useState<Tab>("dictionary");
  const [addOpen, setAddOpen] = useState(false);

  // Garde l'onglet en mémoire via l'URL hash (restauration au chargement).
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Tab;
    if (hash && TABS.some((t) => t.id === hash)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab(hash);
    }
  }, []);
  useEffect(() => {
    window.location.hash = tab;
  }, [tab]);

  return (
    <div className="flex flex-col h-[100dvh] bg-background max-w-md mx-auto relative shadow-xl">
      {/* Contenu */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="h-full flex flex-col"
          >
            {tab === "dictionary" && (
              <DictionaryView onOpenAdd={() => setAddOpen(true)} />
            )}
            {tab === "search" && <SearchView />}
            {tab === "study" && <StudyView />}
            {tab === "stats" && <StatsView />}
            {tab === "settings" && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bouton d'ajout rapide flottant */}
      <motion.button
        onClick={() => setAddOpen(true)}
        aria-label="Ajouter une fiche"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.06 }}
        className="absolute right-4 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground btn-primary-glow transition-shadow"
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Barre d'onglets bas (sticky footer) */}
      <nav className="safe-bottom border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 no-select">
        <div className="grid grid-cols-5">
          {TABS.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 px-1 transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground/80 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    active && "bg-primary/10"
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px]", active && "stroke-[2.4]")} />
                </span>
                <span
                  className={cn(
                    "text-[10px] leading-none",
                    active ? "font-semibold" : "font-medium"
                  )}
                >
                  {t.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <WordFormDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
