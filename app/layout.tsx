import type { Metadata } from "next";
import { Inter, Russo_One } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const russoOne = Russo_One({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-russo"
});

export const metadata: Metadata = {
  title: "PullCave - Marketplace di Carte Collezionabili",
  description: "Acquista e vendi carte Pokemon, Magic, Yu-Gi-Oh e altro.",
};

import { CartProvider } from "@/context/cart-context";
import LiveBanner from "@/components/live-banner";
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} ${russoOne.variable} font-sans bg-stone-950 text-stone-100 antialiased selection:bg-orange-500 selection:text-white`}>
        <SessionProvider>
            <CartProvider>
            <LiveBanner />
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
            </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
