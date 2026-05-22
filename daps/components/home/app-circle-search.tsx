"use client";

import { Search, ExternalLink } from "lucide-react";
import { APP_CARDS, type AppCard } from "@/lib/home-images";

interface AppCircleSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  matchedApp: AppCard | null;
  onOpenMatched: () => void;
}

export function AppCircleSearch({
  query,
  onQueryChange,
  matchedApp,
  onOpenMatched,
}: AppCircleSearchProps) {
  return (
    <div className="pointer-events-auto w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground/45" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && matchedApp) {
              e.preventDefault();
              onOpenMatched();
            }
          }}
          placeholder="Search apps (YouTube, Instagram…)"
          className="h-12 w-full rounded-2xl border border-foreground/15 bg-white/80 pl-12 pr-4 text-sm text-foreground shadow-lg backdrop-blur-md outline-none transition-shadow placeholder:text-foreground/40 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/25 dark:bg-zinc-900/80"
          aria-label="Search apps in the circle"
        />
      </div>

      {query.trim() ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-white/70 px-4 py-2.5 text-sm backdrop-blur-md dark:bg-zinc-900/70">
          {matchedApp ? (
            <>
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: matchedApp.brandColor }}
                >
                  <img src={matchedApp.icon} alt="" className="size-4 object-contain" />
                </span>
                <span className="truncate font-medium text-foreground">
                  {matchedApp.name} found — watch it pop in the circle
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenMatched}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Open
                <ExternalLink className="size-3.5" />
              </button>
            </>
          ) : (
            <span className="text-foreground/60">No app matches &quot;{query}&quot;</span>
          )}
        </div>
      ) : (
        <p className="mt-2 text-center text-xs text-foreground/50">
          Type a name, then press Enter or Open to launch
        </p>
      )}
    </div>
  );
}

export function findAppIndex(query: string): number | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const index = APP_CARDS.findIndex((app) => app.name.toLowerCase().includes(q));
  return index >= 0 ? index : null;
}
