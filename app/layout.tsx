import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import StickyCursor from "./components/StickyCursor";

export const metadata: Metadata = {
  title: "Dignity Trading",
  description: "Trade with our capital, keep up to 95% of profits.",
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
          <StickyCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
