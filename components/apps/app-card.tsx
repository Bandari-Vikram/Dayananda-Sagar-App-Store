"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink, Loader2, Star } from "lucide-react";
import type { StoreApp } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

function AppCard({
  app,
  index,
  onOpen,
}: {
  app: StoreApp;
  index: number;
  onOpen?: (app: StoreApp) => void;
}) {
  const [installed, setInstalled] = useState(app.installed);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    setSpinning(true);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!installed) setInstalled(true);
    setLoading(false);
    setSpinning(false);
  };

  const handleCardOpen = async () => {
    if (loading) return;
    setSpinning(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSpinning(false);
    onOpen?.(app);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardOpen}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/8",
        "bg-[color-mix(in_srgb,var(--background)_88%,var(--foreground)_4%)]",
        "p-4 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.35)] backdrop-blur-sm",
        "transition-shadow duration-300 hover:shadow-[0_16px_40px_-14px_rgba(99,102,241,0.45)]",
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/15 to-cyan-500/10 blur-2xl" />

      <div className="flex gap-3">
        <motion.div
          animate={{ rotate: spinning ? 360 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-lg",
            app.gradient,
          )}
        >
          {app.iconLabel}
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {app.name}
            </h3>
            <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-foreground/60">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              {app.rating}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground/65">
            {app.description}
          </p>
          <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground/45">
            {app.category} · {app.size}
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handleAction}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
          installed
            ? "bg-foreground/8 text-foreground hover:bg-foreground/12"
            : "bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-white shadow-md shadow-indigo-500/25 hover:brightness-110",
        )}
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {installed ? "Opening…" : "Installing…"}
          </>
        ) : installed ? (
          <>
            <ExternalLink size={14} />
            Open
          </>
        ) : (
          <>
            <Download size={14} />
            Install
          </>
        )}
      </motion.button>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-[2px]"
        >
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
        </motion.div>
      )}
    </motion.article>
  );
}

export { AppCard };
