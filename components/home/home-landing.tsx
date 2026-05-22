"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageMenuShell } from "@/components/ui/page-menu-shell";
import { Button } from "@/components/ui/button";

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => {
      const html = document.documentElement;
      if (html.classList.contains("dark")) {
        setIsDark(true);
      } else if (html.classList.contains("light")) {
        setIsDark(false);
      } else {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}

function HomeLightBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 min-h-screen w-full"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
        }}
      />
    </div>
  );
}

function HomeDarkBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-black"
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#3b1e54,transparent)]" />
    </div>
  );
}

function HomeLanding() {
  const router = useRouter();
  const isDark = useIsDarkMode();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleGetStarted = () => {
    setIsLeaving(true);
    window.setTimeout(() => {
      router.push("/login?next=/home/explore");
    }, 420);
  };

  const content = (
    <>
      <PageMenuShell />
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={
          isLeaving
            ? { opacity: 0, y: -16, scale: 0.96, filter: "blur(6px)" }
            : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-w-xl flex-col items-center gap-6 px-6 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/60">
          Dayananda Sagar University
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Dayananda Sagar App Store
        </h1>
        <p className="text-sm leading-relaxed text-foreground/75 sm:text-base">
          Department of Artificial Intelligence and Machine Learning. Discover campus apps,
          tools, and innovations in one place.
        </p>
        <Button
          size="lg"
          className="mt-2 rounded-full px-8 shadow-lg"
          onClick={handleGetStarted}
          disabled={isLeaving}
        >
          {isLeaving ? "Opening login…" : "Get Started"}
        </Button>
      </motion.div>
    </>
  );

  if (isDark) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center text-foreground transition-colors duration-300">
        <HomeDarkBackground />
        {content}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center text-foreground transition-colors duration-300">
      <HomeLightBackground />
      {content}
    </div>
  );
}

export { HomeLanding };
