import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Lora,
  Playfair_Display,
} from "next/font/google";
import config from "./config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});
const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});
export const metadata: Metadata = {
  title: config.siteName,
  description: config.siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${playfair.variable} ${lora.variable} ${jetbrainsMono.variable} font-sans antialiased relative`}
      >
        {children}
      </body>
    </html>
  );
}
