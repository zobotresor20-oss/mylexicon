"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Sparkles, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLexicon } from "@/lib/store";
import { buildDemoBackup } from "@/lib/demo-data";

/** Écran d'accueil affiché quand le dictionnaire est vide. */
export function OnboardingEmpty({ onAdd }: { onAdd: () => void }) {
  const restoreBackup = useLexicon((s) => s.restoreBackup);

  function loadDemo() {
    if (
      !confirm(
        "Charger les données de démonstration ? 5 fiches complètes + 2 incomplètes, supprimables ensuite."
      )
    )
      return;
    restoreBackup(buildDemoBackup(), false);
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4 gap-6">
      {/* Illustration animée */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="relative"
      >
        <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-emerald-700 text-white shadow-xl shadow-primary/30">
          <BookOpen className="h-12 w-12" strokeWidth={1.5} />
          <motion.span
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-md"
          >
            <Sparkles className="h-4 w-4" />
          </motion.span>
        </div>
      </motion.div>

      <div className="space-y-2">
        <h2 className="vocab-word text-2xl">Bienvenue dans MyLexicon</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Votre dictionnaire personnel anglais↔français, 100 % hors ligne.
          Ajoutez des mots, étudiez-les avec des flashcards et la répétition
          espacée, et suivez votre progression.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Button onClick={onAdd} className="h-11" size="default">
          <Plus className="h-4 w-4" /> Ajouter mon premier mot
        </Button>
        <Button onClick={loadDemo} variant="outline" className="h-11">
          <Download className="h-4 w-4" /> Charger des données de démo
        </Button>
      </div>

      {/* Aperçu des fonctionnalités */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm pt-2">
        {[
          { icon: Search, label: "Recherche\nbidirectionnelle" },
          { icon: Sparkles, label: "Flashcards\nSM-2" },
          { icon: BookOpen, label: "Suivi\nde progression" },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-3 text-center"
          >
            <f.icon className="h-5 w-5 text-primary" />
            <span className="text-[10px] text-muted-foreground whitespace-pre-line leading-tight">
              {f.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
