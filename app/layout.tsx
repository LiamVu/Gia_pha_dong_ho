import type { Metadata } from "next";
import { Lora } from "next/font/google";
import config from "./config";
import "./globals.css";

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora",
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
        className={`${lora.variable} font-sans antialiased relative`}
      >
        {children}
      </body>
    </html>
  );
}
