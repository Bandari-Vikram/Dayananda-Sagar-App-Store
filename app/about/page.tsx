"use client";

import { PageMenuShell } from "@/components/ui/page-menu-shell";
import {
  CircularTestimonials,
  type Testimonial,
} from "@/components/ui/circular-testimonials";

const TEAM_MEMBERS: Testimonial[] = [
  {
    name: "Bandari Vikram",
    designation: "Project Lead · DAPS",
    quote:
      "Building DAPS means giving Dayananda Sagar students one trusted place to discover and launch the apps they use every day.",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
  {
    name: "BhagyaShree",
    designation: "Frontend Developer · DAPS",
    quote:
      "Every screen should feel fast and familiar — the app store experience students already know, tailored for our campus.",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  },
  {
    name: "Poorvi",
    designation: "UI/UX Designer · DAPS",
    quote:
      "Good design is invisible until you need it; we focus on clarity so anyone can browse, search, and open apps in seconds.",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
  },
  {
    name: "Kavita",
    designation: "Backend Developer · DAPS",
    quote:
      "Reliable infrastructure behind the store keeps listings, auth, and updates stable so the team can ship features with confidence.",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 px-6 py-20 text-foreground">
      <PageMenuShell />
      <div className="flex w-full max-w-5xl flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">About</h1>
        <p className="max-w-2xl text-foreground/75">
          Meet the four core members behind the Dayananda Sagar App Store.
        </p>
      </div>
      <CircularTestimonials
        testimonials={TEAM_MEMBERS}
        autoplay
        colors={{
          name: "var(--foreground)",
          designation: "color-mix(in oklab, var(--foreground) 65%, transparent)",
          testimony: "color-mix(in oklab, var(--foreground) 80%, transparent)",
          arrowBackground: "#141414",
          arrowForeground: "#f1f1f7",
          arrowHoverBackground: "#00a6fb",
        }}
      />
    </main>
  );
}
