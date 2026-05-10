"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { defaultDraft, saveDraft } from "./blogDraftState";

/** Clears local draft when opening the create flow with `?new=1`. */
export default function ResetNewBlogDraft() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("new") !== "1") return;
    saveDraft(defaultDraft);
    window.history.replaceState({}, "", "/admin/blogs/new/details");
  }, [searchParams]);

  return null;
}
