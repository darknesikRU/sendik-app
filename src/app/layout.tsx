import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TelegramProvider } from "@/components/TelegramProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sendik - P2P доставка",
  description: "Telegram WebApp для доставки посылок попутчиками",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <TelegramProvider>  {/* ← Вот здесь */}
          {children}
        </TelegramProvider>
      </body>
    </html>
  );
}