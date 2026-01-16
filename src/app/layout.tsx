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
  title: {
    default: "相模原市の天気 | Sagamihara Weather",
    template: "%s | 相模原市の天気",
  },
  description: "相模原市（神奈川県西部）の今日・明日の天気予報と週間予報。過去1年間の天気履歴もカレンダー形式で確認できます。気象庁データを毎日更新。",
  keywords: ["相模原", "天気", "天気予報", "神奈川県", "週間予報", "西部", "丹沢"],
  authors: [{ name: "Sagamihara Weather" }],
  creator: "Sagamihara Weather",
  metadataBase: new URL("https://sagamihara-weather.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://sagamihara-weather.vercel.app",
    siteName: "相模原市の天気",
    title: "相模原市の天気 | Sagamihara Weather",
    description: "相模原市（神奈川県西部）の今日・明日の天気予報と週間予報。過去1年間の天気履歴も確認できます。",
  },
  twitter: {
    card: "summary_large_image",
    title: "相模原市の天気 | Sagamihara Weather",
    description: "相模原市（神奈川県西部）の今日・明日の天気予報と週間予報。",
  },
  robots: {
    index: true,
    follow: true,
  },
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
