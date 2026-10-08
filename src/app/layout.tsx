import type { Metadata } from "next";
import { Noto_Color_Emoji, Noto_Sans_Bengali } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import AuthToast from "@/components/AuthToast";
import "./globals.css";

const bn = Noto_Sans_Bengali({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-bn" });

const emoji = Noto_Color_Emoji({ subsets: ["emoji"], weight: "400", variable: "--font-emoji" });

export const metadata: Metadata = {
  title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description: "চাল, ডাল, তেল, সবজি, মাছ ও মাংসের আজকের বাজারদর।",
  icons: { icon: "/logo-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" data-theme="bazar">
      <body className={`${bn.variable} ${emoji.variable} min-h-screen flex flex-col`}>
        <Navbar />
        <Ticker />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" />
        <Suspense fallback={null}><AuthToast /></Suspense>
      </body>
    </html>
  );
}