"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AdminToastFromQuery() {
  const params = useSearchParams();
  const router = useRouter();
  const didRunRef = useRef(false);

  useEffect(() => {
    const key = params.get("toast");
    if (!key) return;

    // React StrictMode in dev can run effects twice; dedupe.
    if (didRunRef.current) return;
    didRunRef.current = true;

    const dedupeKey = `toast:${window.location.pathname}:${key}`;
    if (window.sessionStorage.getItem(dedupeKey) === "1") {
      router.replace("/admin");
      return;
    }
    window.sessionStorage.setItem(dedupeKey, "1");

    if (key === "login") {
      toast.success("Welcome", { description: "Signed in successfully." });
    }

    router.replace("/admin");
  }, [params, router]);

  return null;
}

