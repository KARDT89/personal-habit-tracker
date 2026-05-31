import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "streak. — personal habit tracker",
  description: "Track your daily habits and build lasting streaks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
         <ThemeProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
