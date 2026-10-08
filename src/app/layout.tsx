import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MODE - 1:1 Coaching",
  description: "1-on-1 coaching for people who train around real life, real injuries, and real schedules.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body bg-bg text-fg`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
