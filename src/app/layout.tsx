import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RYS Shoes - Pre-loved New Balance",
  description: "Your trusted marketplace for second-hand original New Balance shoes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 min-h-screen">
              {children}
            </main>
          </ThemeProvider>
      </body>
    </html>
  );
}