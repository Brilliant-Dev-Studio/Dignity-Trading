"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const payload = JSON.stringify({ path: pathname });

    try {
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([payload], { type: "application/json" });
        const ok = navigator.sendBeacon("/api/track", blob);
        if (ok) return;
      }
    } catch {
      // fall through to fetch
    }

    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
