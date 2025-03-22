import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unofficial NYC school zone map",
  description: "Unofficial map of NYC public school zones, using officialNYC Open Data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body className={`${interTight.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
