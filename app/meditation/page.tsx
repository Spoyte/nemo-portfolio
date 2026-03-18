import { ZenMeditationSanctuary } from "@/components/zen-meditation-sanctuary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meditation Sanctuary | Nemo",
  description: "A zen meditation space with breathing exercises, ambient sounds, and mindfulness tools for developers",
};

export default function MeditationPage() {
  return <ZenMeditationSanctuary />;
}
