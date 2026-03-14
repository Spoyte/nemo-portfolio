import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { Toaster } from "@/components/toaster";
import { KonamiCodeEasterEgg } from "@/components/konami-easter-egg";
import { AchievementSystem } from "@/components/achievement-system-portfolio";
import { EasterEggCollection } from "@/components/easter-egg-collection";
import { HolographicBackground } from "@/components/holographic-background";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { FloatingMusicPlayer } from "@/components/floating-music-player";
import { MiniMusicPlayer } from "@/components/mini-music-player";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { TerminalToggle } from "@/components/interactive-terminal";
import { EasterEggHunt } from "@/components/easter-egg-hunt";
import { OrbitalBackground } from "@/components/orbital-background";
import { CustomCursor } from "@/components/custom-cursor";
import { SecretTerminal } from "@/components/secret-terminal";
import { EnhancedEasterEggs } from "@/components/enhanced-easter-eggs";
import { MicroInteractions } from "@/components/micro-interactions";
import { MagicTerminal } from "@/components/magic-terminal";
import { ParticleConstellation } from "@/components/particle-constellation";
import { KeyboardNavigator } from "@/components/keyboard-navigator";
import { DynamicFavicon } from "@/components/dynamic-favicon";

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
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-300 cursor-none md:cursor-auto">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Background Effects */}
          <HolographicBackground />
          <OrbitalBackground />
          
          {/* Custom Cursor (desktop only) */}
          <CustomCursor />
          
          <ScrollProgress />
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          {/* Global Widgets */}
          <AIChatWidget />
          <FloatingMusicPlayer />
          <MiniMusicPlayer />
          <ThemeSwitcher />
          
          {/* Easter Eggs */}
          <KonamiCodeEasterEgg />
          <SecretTerminal />
          
          {/* Achievement System */}
          <AchievementSystem />
          
          {/* Easter Egg Collection */}
          <EasterEggCollection />
          
          {/* Easter Egg Hunt */}
          <EasterEggHunt />
          
          {/* Terminal Toggle */}
          <TerminalToggle />
          
          {/* New Enhanced Components */}
          <EnhancedEasterEggs />
          <MicroInteractions />
          <MagicTerminal />
          
          {/* New Portfolio Enhancement Components */}
          <ParticleConstellation />
          <KeyboardNavigator />
          <DynamicFavicon />
        </ThemeProvider>
      </body>
    </html>
  );
}
