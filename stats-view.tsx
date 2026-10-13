"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  CircleAlert,
  CheckCircle2,
  Flame,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Volume2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useLexicon } from "@/lib/store";
import { Card as UICard } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/shared/speak-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ActivityHeatmap } from "@/components/stats/activity-heatmap";
import { DAY_MS } from "@/lib/sm2";

export function StatsView() {
  const { words, cards, examples, studySessions, settings } = useLexicon();

  const stats = useMemo(() => {
    const incomplete = words.filter((w) => w.status === "incomplete").length;
    const complete = words.filter((w) => w.status === "complete").length;
    const learning = words.filter((w) => w.status === "learning").length;
    const mastered = words.filter((w) => w.status === "mastered").length;
    const masteredCards = cards.filter((c) => c.mastery >= 4).length;
    const totalReviews = studySessions.reduce((s, x) => s + x.total, 0);
    const totalCorrect = studySessions.reduce((s, x) => s + x.correct, 0);
    const successRate = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;
    const totalStudyTime = studySessions.reduce((s, x) => s + x.durationSec, 0);

    return {
      totalWords: words.length,
      totalCards: cards.length,
      totalExamples: examples.length,
      incomplete,
      complete,
      learning,
      mastered,
      masteredCards,
      totalReviews,
      successRate,
      totalStudyTime,
    };
  }, [words, cards, examples, studySessions]);

  // Évolution sur 14 jours.
  const evolution = useMemo(() => {
    const days: { date: string; label: string; reviews: number; correct: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * DAY_MS);
      const key = d.toISOString().slice(0, 10);
      const daySessions = studySessions.filter((s) => new Date(s.date).toISOString().slice(0, 10) === key);
      days.push({
        date: key,
        label: d.toLocaleDateString("fr-FR", { day: "numeric", month: "numeric" }),
        reviews: daySessions.reduce((s, x) => s + x.total, 0),
        correct: daySessions.reduce((s, x) => s + x.correct, 0),
      });
    }
    return days;
  }, [studySessions]);

  // Répartition par statut.
  const statusData = [
    { name: "Incomplètes", value: stats.incomplete, color: "oklch(0.75 0.15 75)" },
    { name: "Complètes", value: stats.complete, color: "oklch(0.6 0.13 160)" },
    { name: "En apprentissage", value: stats.learning, color: "oklch(0.7 0.12 230)" },
    { name: "Maîtrisées", value: stats.mastered, color: "oklch(0.65 0.16 310)" },
  ].filter((x) => x.value > 0);

  // Répartition par nature grammaticale (donut).
  const POS_COLORS: Record<string, string> = {
    nom: "oklch(0.55 0.13 160)",
    verbe: "oklch(0.6 0.2 27)",
    adjectif: "oklch(0.7 0.15 75)",
    adverbe: "oklch(0.65 0.16 310)",
    préposition: "oklch(0.6 0.12 230)",
    conjonction: "oklch(0.7 0.1 200)",
    pronom: "oklch(0.65 0.14 145)",
    déterminant: "oklch(0.5 0.04 200)",
    interjection: "oklch(0.7 0.18 30)",
    expression: "oklch(0.6 0.15 280)",
    autre: "oklch(0.5 0.02 150)",
  };
  const posData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of words) {
      counts.set(w.partOfSpeech, (counts.get(w.partOfSpeech) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: POS_COLORS[name] ?? POS_COLORS.autre,
      }))
      .sort((a, b) => b.value - a.value);
  }, [words]);

  // Objectif quotidien.
  const newWordsPct = Math.min(100, (settings.newWordsToday / Math.max(1, settings.dailyNewWordsGoal)) * 100);
  const reviewsPct = Math.min(100, (settings.reviewsToday / Math.max(1, settings.dailyReviewsGoal)) * 100);

  // Mot du jour.
  const wordOfDay = useMemo(() => {
    if (words.length === 0) return null;
    const seed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
    return words[seed % words.length];
  }, [words]);

  const fmtTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (h > 0) return `${h}h${m > 0 ? ` ${m}min` : ""}`;
    return `${m}min`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 bg-background/80 backdrop-blur sticky top-0 z-10 border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">Statistiques</h1>
          {settings.streak > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400"
              title={`Série de ${settings.streak} jour(s) consécutif(s)`}
            >
              <Flame className="h-3.5 w-3.5" />
              {settings.streak}
            </motion.span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Votre progression</p>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-4 py-3 space-y-4">
        {/* Série + objectif */}
        <div className="grid grid-cols-2 gap-2">
          <StatTile
            icon={Flame}
            label="Série"
            value={`${settings.streak} j.`}
            color="text-orange-500"
            bg="bg-orange-100 dark:bg-orange-900/30"
          />
          <StatTile
            icon={TrendingUp}
            label="Taux de réussite"
            value={`${stats.successRate}%`}
            color="text-emerald-600 dark:text-emerald-400"
            bg="bg-emerald-100 dark:bg-emerald-900/30"
          />
        </div>

        {/* Mot du jour */}
        {wordOfDay && (
          <UICard className="p-4 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Mot du jour
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-2xl font-bold break-words">{wordOfDay.word}</p>
                <p className="text-sm text-muted-foreground break-words">
                  {wordOfDay.translation}
                </p>
              </div>
              <SpeakButton text={wordOfDay.word} />
            </div>
          </UICard>
        )}

        {/* Objectif quotidien */}
        <UICard className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Objectif du jour</span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Nouveaux mots</span>
                <span className="font-medium">
                  {settings.newWordsToday} / {settings.dailyNewWordsGoal}
                </span>
              </div>
              <Progress value={newWordsPct} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Révisions</span>
                <span className="font-medium">
                  {settings.reviewsToday} / {settings.dailyReviewsGoal}
                </span>
              </div>
              <Progress value={reviewsPct} className="h-2" />
            </div>
          </div>
        </UICard>

        {/* Compteurs */}
        <div className="grid grid-cols-2 gap-2">
          <StatTile
            icon={BookOpen}
            label="Fiches"
            value={String(stats.totalWords)}
            sub={`${stats.totalCards} éléments`}
          />
          <StatTile
            icon={CircleAlert}
            label="Incomplètes"
            value={String(stats.incomplete)}
            color="text-amber-600 dark:text-amber-400"
            bg="bg-amber-100 dark:bg-amber-900/30"
          />
          <StatTile
            icon={CheckCircle2}
            label="Éléments maîtrisés"
            value={String(stats.masteredCards)}
            color="text-emerald-600 dark:text-emerald-400"
            bg="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <StatTile
            icon={Clock}
            label="Temps d'étude"
            value={fmtTime(stats.totalStudyTime)}
            sub={`${stats.totalReviews} révisions`}
          />
        </div>

        {/* Répartition par statut */}
        {statusData.length > 0 && (
          <UICard className="p-4">
            <p className="font-semibold text-sm mb-2">Répartition des fiches</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={2}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--popover)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </UICard>
        )}

        {/* Répartition par nature grammaticale (donut) */}
        {posData.length > 0 && (
          <UICard className="p-4">
            <p className="font-semibold text-sm mb-2">Par nature grammaticale</p>
            <div className="flex items-center gap-3">
              <div className="h-36 w-36 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={posData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={62}
                      innerRadius={42}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {posData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--popover)",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold tabular-nums">
                    {posData.reduce((s, x) => s + x.value, 0)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">mots</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-1 content-center">
                {posData.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    <span className="text-muted-foreground truncate capitalize">
                      {s.name}
                    </span>
                    <span className="font-medium ml-auto tabular-nums">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </UICard>
        )}

        {/* Évolution 14 jours */}
        <UICard className="p-4">
          <p className="font-semibold text-sm mb-2">Activité (14 derniers jours)</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolution} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  interval={1}
                />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--popover)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="reviews" name="Révisions" fill="oklch(0.55 0.13 160)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </UICard>

        {/* Heatmap d'activité (12 semaines) */}
        <ActivityHeatmap />

        {/* Taux de réussite par jour */}
        {studySessions.length > 0 && (
          <UICard className="p-4">
            <p className="font-semibold text-sm mb-2">Taux de réussite par jour</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={evolution.map((d) => ({
                    ...d,
                    rate: d.reviews > 0 ? Math.round((d.correct / d.reviews) * 100) : 0,
                  }))}
                  margin={{ top: 5, right: 5, bottom: 0, left: -25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    interval={1}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--popover)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Réussite %"
                    stroke="oklch(0.7 0.15 75)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </UICard>
        )}

        {words.length === 0 && (
          <EmptyState
            icon={BarChart3}
            title="Pas encore de statistiques"
            description="Ajoutez des fiches et étudiez pour voir votre progression ici."
          />
        )}
        <div className="h-24" />
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-foreground",
  bg = "bg-muted",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  bg?: string;
}) {
  return (
    <UICard className="p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </UICard>
  );
}
