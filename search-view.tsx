"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search as SearchIcon,
  History,
  X,
  ArrowRight,
  BookOpen,
  Plus,
} from "lucide-react";

import { useLexicon } from "@/lib/store";
import { buildSearchIndex, search } from "@/lib/search";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ElementBadge } from "@/components/shared/badges";
import { SpeakButton } from "@/components/shared/speak-button";
import { ClickableCard } from "@/components/shared/clickable-card";
import { HighlightedText } from "@/components/shared/highlighted-text";
import { WordDetailSheet } from "@/components/dictionary/word-detail-sheet";
import { WordFormDialog } from "@/components/dictionary/word-form-dialog";
import type { Word, SearchResult } from "@/lib/types";

const KIND_LABEL: Record<SearchResult["kind"], string> = {
  word: "Mot",
  chunk: "Chunk",
  collocation: "Collocation",
  expression: "Expression",
  example: "Exemple",
};

export function SearchView() {
  const { words, cards, examples, searchHistory, addSearchHistory, clearSearchHistory } =
    useLexicon();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<SearchResult["kind"] | "all">("all");

  const TYPE_FILTERS: { id: SearchResult["kind"] | "all"; label: string }[] = [
    { id: "all", label: "Tout" },
    { id: "word", label: "Mots" },
    { id: "chunk", label: "Chunks" },
    { id: "collocation", label: "Colloc." },
    { id: "expression", label: "Expr." },
    { id: "example", label: "Exemples" },
  ];

  // Index reconstruit à chaque changement des données.
  const index = useMemo(
    () => buildSearchIndex(words, cards, examples),
    [words, cards, examples]
  );

  // Anti-rebond pendant la frappe.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  const rawResults = useMemo(() => search(index, debounced, 50), [index, debounced]);
  const results = useMemo(
    () =>
      typeFilter === "all"
        ? rawResults
        : rawResults.filter((r) => r.kind === typeFilter),
    [rawResults, typeFilter]
  );

  // Enregistre l'historique quand l'utilisateur arrête de taper.
  useEffect(() => {
    if (!debounced.trim()) return;
    const t = setTimeout(() => addSearchHistory(debounced.trim()), 600);
    return () => clearTimeout(t);
  }, [debounced, addSearchHistory]);

  function openResult(r: SearchResult) {
    const w = words.find((x) => x.id === r.wordId);
    if (w) {
      setSelectedWord(w);
      setDetailOpen(true);
    }
  }

  const hasQuery = debounced.trim().length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 bg-background/80 backdrop-blur sticky top-0 z-10 border-b space-y-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Recherche</h1>
          <p className="text-xs text-muted-foreground">
            Française, anglaise, avec fautes de frappe ou accents oubliés.
          </p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ex : je n'ai jamais fréquenté d'école privée"
            className="pl-9 pr-9 h-11 text-base"
            autoFocus={false}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Effacer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {hasQuery && (
          <div className="flex gap-1.5 overflow-x-auto thin-scroll -mx-1 px-1 pb-1">
            {TYPE_FILTERS.map((f) => {
              const count =
                f.id === "all"
                  ? rawResults.length
                  : rawResults.filter((r) => r.kind === f.id).length;
              const active = typeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setTypeFilter(f.id)}
                  disabled={count === 0 && !active}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors border",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : count === 0
                      ? "bg-transparent text-muted-foreground/40 border-border/40"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {f.label}
                  {count > 0 && (
                    <span className={cn("ml-1 tabular-nums", active ? "opacity-80" : "opacity-60")}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-4 py-3">
        {!hasQuery ? (
          // Historique + suggestions.
          <div className="space-y-4">
            {searchHistory.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    <History className="h-4 w-4" /> Recherches récentes
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={clearSearchHistory}
                  >
                    Effacer
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {searchHistory.map((h) => (
                    <Button
                      key={h.id}
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setQuery(h.query)}
                    >
                      {h.query}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <EmptyState
              icon={SearchIcon}
              title="Recherchez dans tout votre dictionnaire"
              description="Tapez un mot, une phrase, un fragment — en français ou en anglais. La recherche tolère les fautes et les accents oubliés."
            />
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="Aucun résultat"
            description={`Rien ne correspond à « ${debounced} ». Ajoutez ce mot à votre dictionnaire en un geste.`}
            action={
              <Button
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" /> Créer la fiche « {debounced} »
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {results.length} résultat(s) pour « {debounced} »
            </p>
            {results.map((r, i) => (
              <ClickableCard
                key={`${r.kind}-${r.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: Math.min(i * 0.015, 0.15) }}
                onClick={() => openResult(r)}
                className="p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={
                          r.kind === "word"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
                            : r.kind === "example"
                            ? "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                            : ""
                        }
                      >
                        {KIND_LABEL[r.kind]}
                      </Badge>
                      {r.kind !== "word" && r.kind !== "example" && (
                        <ElementBadge type={r.kind} />
                      )}
                      {r.kind !== "word" && (
                        <span className="text-xs text-muted-foreground">
                          fiche : {r.wordLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium break-words">
                      <HighlightedText text={r.textEn} query={debounced} />
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      <HighlightedText text={r.textFr} query={debounced} />
                    </p>
                    {r.kind !== "word" && (
                      <p className="text-xs text-muted-foreground pt-0.5">
                        <ArrowRight className="inline h-3 w-3" /> {r.wordLabel} —{" "}
                        {r.wordTranslation}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <SpeakButton text={r.textEn} />
                  </div>
                </div>
              </ClickableCard>
            ))}
          </div>
        )}
        <div className="h-24" />
      </div>

      <WordDetailSheet
        word={selectedWord}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <WordFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        prefillWord={debounced}
      />
    </div>
  );
}
