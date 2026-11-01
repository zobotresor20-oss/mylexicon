"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenText,
  Plus,
  Sparkles,
  ClipboardPaste,
  Trash2,
  CheckSquare,
  Square,
  CheckCheck,
  ArrowDownUp,
} from "lucide-react";
import { toast } from "sonner";

import { useLexicon } from "@/lib/store";
import {
  analyzeText,
  getUnknownWords,
  sortUnknownWords,
  type TextToken,
  type UnknownSort,
} from "@/lib/text-analysis";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { SpeakButton } from "@/components/shared/speak-button";
import { WordFormDialog } from "@/components/dictionary/word-form-dialog";

/** Mot connu tappable qui ouvre un popover avec la définition. */
function KnownWord({ token, mastery }: { token: TextToken; mastery: number }) {
  const color =
    mastery >= 80
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-b-2 border-emerald-500/50"
      : mastery >= 40
      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-b-2 border-sky-500/50"
      : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-b-2 border-amber-500/50";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn("rounded px-0.5 cursor-pointer font-medium", color)}
        >
          {token.raw}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" side="top">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="vocab-word text-lg font-bold">{token.word?.word}</span>
            <SpeakButton text={token.word?.word ?? ""} />
          </div>
          <p className="text-sm text-muted-foreground">{token.word?.translation}</p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Maîtrise</span>
            <span className="relative inline-flex h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                style={{ width: `${mastery}%` }}
              />
            </span>
            <span className="text-xs font-medium tabular-nums">{mastery}%</span>
          </div>
          {token.word?.partOfSpeech && (
            <Badge variant="outline" className="text-xs capitalize mt-1">
              {token.word.partOfSpeech}
            </Badge>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const SAMPLE_TEXT = `He was a stubborn child who refused to eat his vegetables. Despite his parents' reluctance, he remained thoroughly convinced that broccoli was poison. One day, he caught a brief glimpse of his sister eating a salad, and something changed. Against all odds, he decided to try a piece. It was delicious. From that day on, he achieved a remarkable balance in his diet and became a reluctant hero of healthy eating.`;

export function ActiveReadingView({ onExit }: { onExit?: () => void }) {
  const { words, cards, addWord, addExample } = useLexicon();
  const [text, setText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [prefillWord, setPrefillWord] = useState("");
  const [sort, setSort] = useState<UnknownSort>("appearance");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const tokens = useMemo<TextToken[]>(
    () => (analyzed ? analyzeText(text, words, cards) : []),
    [analyzed, text, words, cards]
  );

  const rawUnknown = useMemo(() => getUnknownWords(tokens), [tokens]);
  const unknownWords = useMemo(
    () => sortUnknownWords(rawUnknown, tokens, sort),
    [rawUnknown, tokens, sort]
  );
  const knownCount = tokens.filter((t) => t.known).length;
  const totalWords = tokens.filter((t) => t.isWord).length;

  function handleAnalyze() {
    if (!text.trim()) {
      toast.error("Collez d'abord un texte en anglais.");
      return;
    }
    setAnalyzed(true);
    setSelected(new Set());
    setBulkMode(false);
    toast.success("Texte analysé !");
  }

  function handleReset() {
    setText("");
    setAnalyzed(false);
    setSelected(new Set());
    setBulkMode(false);
  }

  function handleLoadSample() {
    setText(SAMPLE_TEXT);
    setAnalyzed(false);
  }

  function handlePaste() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.info("Presse-papier non disponible.");
      return;
    }
    navigator.clipboard.readText().then((t) => {
      setText(t);
      setAnalyzed(false);
    }).catch(() => toast.info("Impossible de lire le presse-papier."));
  }

  function openCreateFor(word: string) {
    setPrefillWord(word);
    setCreateOpen(true);
  }

  function toggleSelect(word: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(unknownWords));
  }

  function selectNone() {
    setSelected(new Set());
  }

  function bulkAdd() {
    if (selected.size === 0) {
      toast.error("Sélectionnez au moins un mot.");
      return;
    }
    let added = 0;
    let skipped = 0;
    for (const w of selected) {
      const exists = words.some(
        (x) => x.word.toLowerCase() === w.toLowerCase()
      );
      if (exists) {
        skipped++;
        continue;
      }
      addWord({
        word: w,
        translation: "",
        partOfSpeech: "autre",
        context: "",
        register: "",
        notes: "",
        tags: ["lecture active"],
      });
      added++;
    }
    toast.success(
      `${added} fiche(s) créée(s)${skipped ? `, ${skipped} ignorée(s) (déjà présentes)` : ""}.`
    );
    setSelected(new Set());
    setBulkMode(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 bg-background/80 backdrop-blur sticky top-0 z-10 border-b">
        <h1 className="text-xl font-bold tracking-tight">Lecture active</h1>
        <p className="text-xs text-muted-foreground">
          Collez un texte, repérez les mots connus et créez des fiches pour les inconnus.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-4 py-3 space-y-3">
        {!analyzed ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Texte en anglais</label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handlePaste}
                  >
                    <ClipboardPaste className="h-3 w-3" /> Coller
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleLoadSample}
                  >
                    <Sparkles className="h-3 w-3" /> Exemple
                  </Button>
                </div>
              </div>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Collez ici un article, une page de livre, une conversation… en anglais."
                rows={10}
                className="text-base leading-relaxed"
              />
            </div>
            <Button className="w-full h-11" onClick={handleAnalyze} disabled={!text.trim()}>
              <BookOpenText className="h-4 w-4" /> Analyser le texte
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* En-tête de statistiques */}
            <div className="rounded-xl border bg-card p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium">{totalWords} mots</span>
                <Badge variant="outline" className="gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700">
                  {knownCount} connus
                </Badge>
                <Badge variant="outline" className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-300 dark:border-amber-700">
                  {unknownWords.length} inconnus
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleReset}>
                <Trash2 className="h-3 w-3" /> Effacer
              </Button>
            </div>

            {/* Mots inconnus à créer */}
            {unknownWords.length > 0 && (
              <div className="rounded-xl border-2 border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/20 p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                    Mots à apprendre ({unknownWords.length})
                  </p>
                  <div className="flex items-center gap-1.5">
                    {/* Tri */}
                    <Select value={sort} onValueChange={(v) => setSort(v as UnknownSort)}>
                      <SelectTrigger className="h-7 w-auto text-xs gap-1 border-amber-300 dark:border-amber-700">
                        <ArrowDownUp className="h-3 w-3" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appearance">Ordre d'apparition</SelectItem>
                        <SelectItem value="length">Par longueur</SelectItem>
                        <SelectItem value="alpha">Alphabétique</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Toggle mode sélection */}
                    <Button
                      variant={bulkMode ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setBulkMode(!bulkMode);
                        setSelected(new Set());
                      }}
                    >
                      <CheckSquare className="h-3 w-3" />
                      {bulkMode ? "Annuler" : "Sélectionner"}
                    </Button>
                  </div>
                </div>

                {/* Barre d'actions en masse */}
                {bulkMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 flex-wrap"
                  >
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={selectAll}>
                      <CheckCheck className="h-3 w-3" /> Tout
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={selectNone}>
                      <Square className="h-3 w-3" /> Aucun
                    </Button>
                    <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                      {selected.size} sélectionné(s)
                    </span>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={bulkAdd}
                      disabled={selected.size === 0}
                    >
                      <Plus className="h-3 w-3" /> Créer ({selected.size})
                    </Button>
                  </motion.div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {unknownWords.map((w) => {
                    const isSelected = selected.has(w);
                    return (
                      <button
                        key={w}
                        onClick={() => {
                          if (bulkMode) toggleSelect(w);
                          else openCreateFor(w);
                        }}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                          bulkMode && isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-amber-400 bg-background hover:bg-amber-100 dark:hover:bg-amber-900/40"
                        )}
                      >
                        {bulkMode ? (
                          isSelected ? (
                            <CheckSquare className="h-3 w-3" />
                          ) : (
                            <Square className="h-3 w-3" />
                          )
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Texte annoté */}
            <div className="rounded-xl border bg-card p-4">
              <p className="text-base leading-loose break-words">
                {tokens.map((t, i) => {
                  if (!t.isWord) return <span key={i}>{t.raw}</span>;
                  if (t.known) {
                    const mastery = t.masteryPct ?? 0;
                    return (
                      <KnownWord key={i} token={t} mastery={mastery} />
                    );
                  }
                  // Mot inconnu.
                  return (
                    <button
                      key={i}
                      onClick={() => openCreateFor(t.raw)}
                      title="Ajouter au dictionnaire"
                      className="rounded px-0.5 bg-rose-500/15 text-rose-700 dark:text-rose-300 border-b-2 border-dashed border-rose-500/50 hover:bg-rose-500/25 cursor-pointer transition-colors"
                    >
                      {t.raw}
                    </button>
                  );
                })}
              </p>
            </div>

            {/* Légende */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-500/30 border-b-2 border-emerald-500/50" />
                Maîtrisé
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-sky-500/30 border-b-2 border-sky-500/50" />
                En apprentissage
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-amber-500/30 border-b-2 border-amber-500/50" />
                Nouveau / faible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-rose-500/30 border-b-2 border-dashed border-rose-500/50" />
                Inconnu (touchez pour créer)
              </span>
            </div>

            {totalWords === 0 && (
              <EmptyState
                icon={BookOpenText}
                title="Aucun mot détecté"
                description="Le texte ne contient pas de mots reconnus."
              />
            )}
          </div>
        )}
        <div className="h-24" />
      </div>

      <WordFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        prefillWord={prefillWord}
      />
    </div>
  );
}
