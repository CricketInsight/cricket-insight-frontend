import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cricket Analysis & Insights - Live Scores, Statistics & Analytics",
  description: "Advanced cricket analysis platform with real-time scores, player statistics, team analytics, match predictions, and comprehensive cricket insights. Best cricket analysis tool for fans and professionals.",
  keywords: "cricket analysis, cricket analytics, cricket insights, live cricket scores, cricket statistics, player analysis, team analytics, match predictions, cricket data analysis, cricket performance metrics, cricket trends, cricket intelligence",
  authors: [{ name: "Cricket Insights Team" }],
  creator: "Cricket Insights",
  publisher: "Cricket Insights",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "Cricket Analysis & Insights - Advanced Cricket Analytics Platform",
    description: "Advanced cricket analysis platform with real-time scores, player statistics, team analytics, match predictions, and comprehensive cricket insights.",
    type: "website",
    locale: "en_US",
    siteName: "Cricket Insights",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cricket Analysis & Insights",
    description: "Advanced cricket analysis platform with real-time scores and comprehensive analytics.",
  },
  alternates: {
    canonical: "https://cricketinsights.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}