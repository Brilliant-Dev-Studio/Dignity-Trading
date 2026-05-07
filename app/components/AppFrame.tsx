"use client";

import { usePathname } from "next/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideChrome =
    pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/_next");
  const isHome = pathname === "/";

  if (hideChrome) return <>{children}</>;

  return (
    <>
      <SiteHeader overlay={isHome} />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}

