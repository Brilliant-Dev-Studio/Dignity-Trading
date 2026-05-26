"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const TOAST_MESSAGES: Record<
  string,
  { type: "success" | "error"; title: string; description?: string }
> = {
  login: {
    type: "success",
    title: "Welcome",
    description: "Signed in successfully.",
  },
  passwordChanged: {
    type: "success",
    title: "Password updated",
    description: "Use the new password the next time you sign in.",
  },
};

const ERROR_MESSAGES: Record<string, { title: string; description?: string }> = {
  missing: {
    title: "Missing fields",
    description: "Please fill in current, new, and confirm password.",
  },
  short: {
    title: "Password too short",
    description: "New password must be at least 8 characters.",
  },
  mismatch: {
    title: "Passwords do not match",
    description: "New password and confirmation must be identical.",
  },
  same: {
    title: "Same password",
    description: "New password must be different from the current one.",
  },
  invalidCurrent: {
    title: "Current password is incorrect",
    description: "Double-check the current password and try again.",
  },
};

export default function AdminToastFromQuery() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const didRunRef = useRef(false);

  useEffect(() => {
    const toastKey = params.get("toast");
    const errorKey = params.get("error");
    if (!toastKey && !errorKey) return;

    if (didRunRef.current) return;
    didRunRef.current = true;

    const dedupeKey = `toast:${pathname}:${toastKey ?? "_"}:${errorKey ?? "_"}`;
    if (window.sessionStorage.getItem(dedupeKey) === "1") {
      router.replace(pathname);
      return;
    }
    window.sessionStorage.setItem(dedupeKey, "1");

    if (toastKey && TOAST_MESSAGES[toastKey]) {
      const m = TOAST_MESSAGES[toastKey];
      if (m.type === "success") {
        toast.success(m.title, { description: m.description });
      } else {
        toast.error(m.title, { description: m.description });
      }
    }

    if (errorKey && ERROR_MESSAGES[errorKey]) {
      const m = ERROR_MESSAGES[errorKey];
      toast.error(m.title, { description: m.description });
    }

    router.replace(pathname);
  }, [params, router, pathname]);

  return null;
}
