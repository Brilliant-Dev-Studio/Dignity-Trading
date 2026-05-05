"use client";

import { usePathname } from "next/navigation";
import StickyCursor from "./StickyCursor";

export default function CursorEffects() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return <StickyCursor />;
}

