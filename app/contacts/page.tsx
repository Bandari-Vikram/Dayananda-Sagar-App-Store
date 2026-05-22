import { PageMenuShell } from "@/components/ui/page-menu-shell";

export default function ContactsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-foreground">
      <PageMenuShell />
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Contacts</h1>
      <p className="max-w-2xl text-foreground/75">
        Contact the DAPS team for app publishing and platform support.
      </p>
    </main>
  );
}
