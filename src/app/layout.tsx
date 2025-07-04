import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toption - Top Options Trading Platform',
  description: 'Smart options screening with Yahoo Finance data, real-time market quotes, and trade journal.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
} 