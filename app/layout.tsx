import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { ScrollProgress } from "@/components/scroll-progress";
import { TerminalWidget } from "@/components/terminal-widget";
import { CommandPalette } from "@/components/command-palette";
import { CursorFollower } from "@/components/cursor-follower";
import { EasterEggTracker } from "@/components/easter-egg-tracker";
import { Toaster } from "@/components/toaster";
import { AIChatEnhanced } from "@/components/ai-chat-enhanced";
import { MusicPlayerWidget } from "@/components/music-player";
import { VoiceNavigation } from "@/components/voice-navigation";
import { RealTimeCollaboration } from "@/components/real-time-collaboration";
import { InteractiveTerminal } from "@/components/interactive-terminal";

// New enhanced components
import { CodeRainToggle } from "@/components/code-rain-background";
import { WeatherWidget } from "@/components/weather-widget";
import { FocusModeProvider, FocusModeToggle } from "@/components/focus-mode";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { ParticleCursorTrail } from "@/components/particle-cursor-trail";
import { DynamicFavicon } from "@/components/dynamic-favicon";
import { ScreenSaver } from "@/components/screen-saver";
import { ToastProvider } from "@/components/notification-toast";
import { PomodoroTimer } from "@/components/pomodoro-timer";

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
          <ToastProvider>
            <FocusModeProvider>
              <CursorFollower>
                <ParticleCursorTrail>
                  <DynamicFavicon />
                  <Analytics />
                  <ScrollProgress />
                  <Toaster />
                  
                  <div className="flex flex-col min-h-screen">
                    <Navigation />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>

                  {/* Core Widgets */}
                  <TerminalWidget />
                  <MusicPlayerWidget />
                  <AIChatEnhanced />
                  <CommandPalette />
                  <EasterEggTracker />
                  <VoiceNavigation />
                  <RealTimeCollaboration />
                  <InteractiveTerminal />

                  {/* New Enhanced Features */}
                  <CodeRainToggle />
                  <WeatherWidget />
                  <FocusModeToggle />
                  <KeyboardShortcuts />
                  <ScreenSaver />
                  <PomodoroTimer />
                </ParticleCursorTrail>
              </CursorFollower>
            </FocusModeProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
