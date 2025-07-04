import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virtera Energy - Sustainable Energy Solutions",
  description: "Partnerships with our neighbors. Leading sustainable energy solutions for a cleaner future.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F0F2F5] text-gray-800`}>
        <div className="relative min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
