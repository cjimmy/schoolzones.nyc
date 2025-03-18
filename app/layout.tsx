import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NYC School Zones | Unofficial Map",
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
      </body>
    </html>
  );
}
