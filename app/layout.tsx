import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import CursorEffects from "./components/CursorEffects";
import AppFrame from "./components/AppFrame";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Dignity Trading",
  description: "Trade with our capital, keep up to 95% of profits.",
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
        <LenisProvider>
          <CursorEffects />
          <AppFrame>{children}</AppFrame>
        </LenisProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
