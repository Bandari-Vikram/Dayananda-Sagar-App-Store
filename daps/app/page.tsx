"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HandWrittenTitle } from "@/components/ui/hand-written-title";

export default function Home() {
  const router = useRouter();
  const showSplash = true;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2800);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="text-foreground transition-colors duration-300">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.5 }}
            className="flex min-h-screen items-center justify-center px-6"
          >
            <HandWrittenTitle />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
