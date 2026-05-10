"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ToastFromQuery() {
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
      router.replace("/admin/login");
      return;
    }
    window.sessionStorage.setItem(dedupeKey, "1");

    if (key === "logged_out") {
      toast.success("Logged out", { description: "See you next time." });
    }

    // remove query so it doesn't repeat on refresh
    router.replace("/admin/login");
  }, [params, router]);

  return null;
}

