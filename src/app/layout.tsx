import type { Metadata } from "next";
import { Yatra_One, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const yatraOne = Yatra_One({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-yatra-one",
});

const notoSans = Noto_Sans_Devanagari({
  weight: ["400", "500", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "माँ साउंड पार्लर - DUNIYA",
  description: "आज कहाँ बैठोगे? An immersive nostalgic Indian music experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      className={`${yatraOne.variable} ${notoSans.variable} antialiased`}
    >
      <body className="font-sans min-h-screen flex flex-col bg-black overflow-hidden">
        {children}
      </body>
    </html>
  );
}
