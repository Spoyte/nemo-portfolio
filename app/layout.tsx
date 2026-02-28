import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { Toaster } from "@/components/toaster";
import { KonamiCodeEasterEgg } from "@/components/konami-easter-egg";
import { AchievementSystem } from "@/components/achievement-system-portfolio";
import { TerminalToggle } from "@/components/interactive-terminal";

export const metadata: Metadata = {
  title: "Nemo | Creative Developer & Designer",
  description: "Portfolio of Nemo - A creative developer crafting digital experiences with code and design.",
  keywords: ["developer", "designer", "portfolio", "react", "nextjs", "typescript"],
  authors: [{ name: "Nemo" }],
  openGraph: {
    title: "Nemo | Creative Developer & Designer",
    description: "Portfolio of Nemo - A creative developer crafting digital experiences.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ScrollProgress />
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          {/* Easter Egg */}
          <KonamiCodeEasterEgg />
          
          {/* Achievement System */}
          <AchievementSystem />
          
          {/* Terminal Toggle */}
          <TerminalToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
