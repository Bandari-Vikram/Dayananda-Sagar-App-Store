"use client";

import { AuthProvider } from "@/components/auth/auth-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export { Providers };
