import React from "react"
import { Geist, Geist_Mono, JetBrains_Mono, Roboto } from "next/font/google"
import type { Metadata } from "next"
import "./index.css"

import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"

export const metadata: Metadata = {
  title: "Kewti - Ethiopian React UI Components Library",
  description:
    "Beautiful, interactive, and production-ready React UI components styled with Tailwind CSS, custom-built for modern Ethiopian web applications. Copy and paste components like calendars, widgets, and cards in seconds.",
  keywords: [
    "kewti",
    "react ui components",
    "ethiopian web design",
    "ethiopian developers",
    "tailwind css components",
    "kewti-mon",
  ],
  authors: [{ name: "Kewti Devs" }],
  openGraph: {
    title: "Kewti - Ethiopian React UI Components Library",
    description:
      "Beautiful, interactive, and production-ready React UI components styled with Tailwind CSS, custom-built for modern Ethiopian web applications.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kewti - Ethiopian React UI Components Library",
    description:
      "Beautiful, interactive, and production-ready React UI components styled with Tailwind CSS, custom-built for modern Ethiopian web applications.",
  },
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", roboto.className, jetbrainsMono.variable)}
    >
      <body>{children}</body>
    </html>
  )
}
