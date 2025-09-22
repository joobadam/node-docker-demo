import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/joobadam/node-docker-demo"),
  title: {
    default: "Task Manager | Node.js + Next.js Todo",
    template: "%s | Task Manager",
  },
  description:
    "Simple full‑stack Todo app for DevOps demo (Docker, GHCR, GitHub Actions).",
  applicationName: "Task Manager",
  keywords: [
    "todo",
    "task manager",
    "nextjs",
    "express",
    "docker",
    "ghcr",
    "github actions",
  ],
  authors: [{ name: "joobadam" }],
  creator: "joobadam",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Task Manager | Node.js + Next.js Todo",
    description:
      "Simple full‑stack Todo app for DevOps demo (Docker, GHCR, GitHub Actions).",
    siteName: "Task Manager",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Task Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Manager | Node.js + Next.js Todo",
    description:
      "Simple full‑stack Todo app for DevOps demo (Docker, GHCR, GitHub Actions).",
    images: ["/og.png"],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
