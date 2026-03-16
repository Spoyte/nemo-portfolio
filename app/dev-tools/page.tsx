import { DeveloperFocusMode } from "@/components/developer-focus-mode";
import { ApiPlayground } from "@/components/api-playground";
import { DesignTokenStudio } from "@/components/design-token-studio";
import { CodeCompareTool } from "@/components/code-compare-tool";
import { CodeTypingCinema } from "@/components/code-typing-cinema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Tools | Nemo",
  description: "A collection of developer tools including focus timer, API playground, design token studio, and code comparison.",
};

export default function DeveloperToolsPage() {
  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Developer <span className="text-gradient-animated">Tools</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A collection of utilities to boost productivity and streamline your workflow.
        </p>
      </div>

      <DeveloperFocusMode />
      <ApiPlayground />
      <DesignTokenStudio />
      <CodeCompareTool />
      <CodeTypingCinema />
    </div>
  );
}
