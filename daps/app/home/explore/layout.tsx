import { RequireAuth } from "@/components/auth/require-auth";

export default function HomeExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
