import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Playfair_Display,
} from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emanuel Website Design | Church Websites",
  description:
    "Emanuel Website Design builds peaceful, reliable church websites with weekly updates, sermons, and secure giving handled for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} antialiased`}
        >
          <SiteHeader />
          <main>{children}</main>
          <footer className="mt-16 border-t border-border/60 bg-[#f9f9f7]/85 px-6 py-8 text-center text-sm text-foreground/60 backdrop-blur sm:px-10 lg:px-16">
            © 2026 Emanuel Website Design. All rights reserved.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
