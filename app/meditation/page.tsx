import type { Metadata } from "next";
import MeditationPageClient from "./client";

export const metadata: Metadata = {
  title: "Code Meditation Garden | Nemo",
  description: "A zen-like interactive space where code breathes and flows. Take a moment to breathe, reset, and return to your code with clarity and focus.",
  keywords: ["meditation", "mindfulness", "developer wellness", "breathing exercises", "code meditation"],
  openGraph: {
    title: "Code Meditation Garden | Nemo",
    description: "A zen-like interactive space where code breathes and flows.",
    type: "website",
  },
};

export default function MeditationPage() {
  return <MeditationPageClient />;
}
