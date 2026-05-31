import type { Metadata } from "next";
import { Instrument_Serif, Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "streak. — personal habit tracker",
  description: "Track your daily habits and build lasting streaks",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} ${geist.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen bg-background">
            {/*<Sidebar />*/}
            {/* offset for fixed sidebar on desktop, full width on mobile */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}