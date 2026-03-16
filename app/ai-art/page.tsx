import { AIArtGenerator } from "@/components/ai-art-generator";

export const metadata = {
  title: "AI Art Generator | Nemo",
  description: "Create unique generative art with AI-powered algorithms",
};

export default function AIArtPage() {
  return (
    <main className="min-h-screen">
      <AIArtGenerator />
    </main>
  );
}
