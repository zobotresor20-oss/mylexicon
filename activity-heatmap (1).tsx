"use client";

import { useMemo } from "react";
import { useLexicon } from "@/lib/store";
import { DAY_MS } from "@/lib/sm2";
import { cn } from "@/lib/utils";

/**
 * Heatmap d'activité type GitHub sur les 12 dernières semaines.
 * Chaque cellule = un jour ; la couleur dépend du nombre de révisions.
 */
export function ActivityHeatmap() {
  const studySessions = useLexicon((s) => s.studySessions);

  const data = useMemo(() => {
    // Construit un map date -> nb révisions.
    const byDay = new Map<string, number>();
    for (const s of studySessions) {
      const key = new Date(s.date).toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) ?? 0) + s.total);
    }
    // Génère 12 semaines (84 jours) en colonnes de 7 (lun..dim).
    const weeks: { date: string; count: number; future: boolean }[][] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Trouve le lundi de la semaine courante.
    const dayOfWeek = (today.getDay() + 6) % 7; // 0 = lundi
    const lastMonday = new Date(today.getTime() - dayOfWeek * DAY_MS);
    const start = new Date(lastMonday.getTime() - 11 * 7 * DAY_MS);

    for (let w = 0; w < 12; w++) {
      const col: { date: string; count: number; future: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
        const key = date.toISOString().slice(0, 10);
        const isFuture = date.getTime() > today.getTime();
        col.push({
          date: key,
          count: byDay.get(key) ?? 0,
          future: isFuture,
        });
      }
      weeks.push(col);
    }
    return weeks;
  }, [studySessions]);

  const maxCount = useMemo(() => {
    let m = 0;
    for (const w of data) for (const c of w) m = Math.max(m, c.count);
    return m;
  }, [data]);

  function colorFor(count: number, future: boolean): string {
    if (future) return "bg-transparent";
    if (count === 0) return "bg-muted";
    const ratio = maxCount > 0 ? count / maxCount : 0;
    if (ratio < 0.25) return "bg-emerald-200 dark:bg-emerald-900";
    if (ratio < 0.5) return "bg-emerald-400 dark:bg-emerald-700";
    if (ratio < 0.75) return "bg-emerald-500 dark:bg-emerald-600";
    return "bg-emerald-600 dark:bg-emerald-400";
  }

  const totalReviews = studySessions.reduce((s, x) => s + x.total, 0);
  const activeDays = useMemo(
    () => new Set(studySessions.map((s) => new Date(s.date).toISOString().slice(0, 10))).size,
    [studySessions]
  );

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm">Calendrier d'étude</p>
        <span className="text-xs text-muted-foreground">
          {activeDays} jour(s) actif(s) · {totalReviews} révisions
        </span>
      </div>
      <div className="flex gap-[3px] overflow-x-auto thin-scroll pb-1">
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((cell) => (
              <div
                key={cell.date}
                title={`${cell.date} : ${cell.count} révision(s)`}
                className={cn(
                  "heat-cell h-3 w-3 rounded-sm",
                  colorFor(cell.count, cell.future)
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-2 text-xs text-muted-foreground">
        <span>Moins</span>
        <span className="h-3 w-3 rounded-sm bg-muted" />
        <span className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
        <span className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
        <span className="h-3 w-3 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
        <span>Plus</span>
      </div>
    </div>
  );
}
