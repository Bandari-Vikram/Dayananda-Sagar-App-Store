"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { PageMenuShell } from "@/components/ui/page-menu-shell";
import { AppCard } from "@/components/apps/app-card";
import { APP_CATEGORIES, NAV_TRANSITION_KEY, STORE_APPS, type StoreApp } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

function AppsScreen() {
  const [entered, setEntered] = useState(false);
  const [category, setCategory] = useState<(typeof APP_CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [openingApp, setOpeningApp] = useState<StoreApp | null>(null);

  useEffect(() => {
    const fromNav = sessionStorage.getItem(NAV_TRANSITION_KEY) === "1";
    if (fromNav) sessionStorage.removeItem(NAV_TRANSITION_KEY);
    const t = setTimeout(() => setEntered(true), fromNav ? 80 : 0);
    return () => clearTimeout(t);
  }, []);

  const filteredApps = useMemo(() => {
    return STORE_APPS.filter((app) => {
      const matchesCategory = category === "All" || app.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
      animate={
        entered
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.94, filter: "blur(6px)" }
      }
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen pb-24 text-foreground"
    >
      <PageMenuShell />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 12 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -180, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 shadow-lg shadow-indigo-500/30"
            >
              <Sparkles size={20} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Apps</h1>
              <p className="text-xs text-foreground/60 sm:text-sm">
                DSU mini store · {STORE_APPS.length} apps
              </p>
            </div>
          </div>

          <div className="relative mt-5">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/45"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps"
              className={cn(
                "w-full rounded-2xl border border-foreground/10 bg-[color-mix(in_srgb,var(--background)_90%,var(--foreground)_6%)]",
                "py-3 pl-10 pr-4 text-sm outline-none ring-0 transition-shadow",
                "placeholder:text-foreground/40 focus:border-indigo-400/40 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]",
              )}
            />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {APP_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                  category === cat
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25"
                    : "bg-foreground/8 text-foreground/70 hover:bg-foreground/12",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.header>

        <motion.section
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, index) => (
              <AppCard
                key={app.id}
                app={app}
                index={index}
                onOpen={(selected) => setOpeningApp(selected)}
              />
            ))}
          </AnimatePresence>
        </motion.section>

        {filteredApps.length === 0 && (
          <p className="py-16 text-center text-sm text-foreground/55">No apps match your search.</p>
        )}
      </div>

      <AnimatePresence>
        {openingApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-background/50 px-6 backdrop-blur-sm"
            onClick={() => setOpeningApp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-foreground/10 bg-[color-mix(in_srgb,var(--background)_92%,var(--foreground)_5%)] p-6 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className={cn(
                  "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white",
                  openingApp.gradient,
                )}
              >
                {openingApp.iconLabel}
              </motion.div>
              <p className="text-lg font-semibold">{openingApp.name}</p>
              <p className="mt-1 text-sm text-foreground/65">{openingApp.description}</p>
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-foreground/50">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
                Launching app…
              </div>
              <button
                type="button"
                onClick={() => setOpeningApp(null)}
                className="mt-5 text-xs font-medium text-indigo-500 hover:underline"
              >
                Close preview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

export { AppsScreen };
