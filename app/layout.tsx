import type { Metadata } from "next";
import "./globals.css";
import CursorEffects from "./components/CursorEffects";
import AppFrame from "./components/AppFrame";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Dignity Trading",
    template: "%s | Dignity Trading",
  },
  description:
    "Rules-first forex trading education and funded trading program. Learn to trade with discipline, build a repeatable system, and grow with Dignity Trading Academy.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dignitytrading.com"),
  openGraph: {
    type: "website",
    siteName: "Dignity Trading",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Dignity Trading",
      },
    ],
  },
  twitter: {
    card: "summary",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CursorEffects />
        <AppFrame>{children}</AppFrame>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
