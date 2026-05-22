"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { readAuthSession } from "@/lib/auth";
import { useAuth } from "@/components/auth/auth-provider";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, refreshSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const hasSession = isAuthenticated || Boolean(readAuthSession()?.user?.email);

  useEffect(() => {
    if (isLoading) return;
    if (!hasSession) {
      const next = encodeURIComponent(pathname || "/home/explore");
      router.replace(`/login?next=${next}`);
    }
  }, [hasSession, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          <p className="text-sm text-foreground/60">Checking session…</p>
        </motion.div>
      </div>
    );
  }

  if (!hasSession) {
    return null;
  }

  return <>{children}</>;
}

export { RequireAuth };
