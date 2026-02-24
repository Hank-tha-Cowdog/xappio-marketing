import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "xappio.io — Creative Intelligence for Video Libraries",
  description:
    "Conversational search across your entire video library. Ask questions in plain language. Everything runs locally, on your hardware.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased bg-black text-white`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
