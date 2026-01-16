import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  display: "swap",
});

const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
});

export const metadata: Metadata = {
  title: "相模原市の天気 | Sagamihara Weather",
  description: "相模原市（神奈川県西部）の今日・明日の天気予報と週間予報。過去1年間の天気履歴も確認できます。",
  keywords: ["相模原", "天気", "天気予報", "神奈川県", "週間予報"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenKaku.variable} ${shipporiMincho.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
