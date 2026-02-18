import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";

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
          <Analytics />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
