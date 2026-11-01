"use client";

import { highlightMatches } from "@/lib/search";

/** Affiche un texte en surlignant les correspondances de la requête. */
export function HighlightedText({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const segments = highlightMatches(text, query);
  if (segments.length === 1 && !segments[0].hit) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.hit ? (
          <mark key={i} className="search-hit">
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}
