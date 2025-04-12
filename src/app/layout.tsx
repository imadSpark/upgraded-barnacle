import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SparkMeals - Quick Meal Order Service",
  description: "Order your favorite meals quickly and easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {children}
            <ThemeToggle />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
