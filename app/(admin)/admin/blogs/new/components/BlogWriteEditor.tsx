"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type Quill from "quill";
import { safeReadDraft, saveDraft } from "./blogDraftState";

export default function BlogWriteEditor() {
  const initial = useMemo(() => safeReadDraft(), []);
  const [title, setTitle] = useState(initial.title);
  const [contentHtml, setContentHtml] = useState(initial.contentHtml);
  const [contentText, setContentText] = useState(initial.contentText);
  const [savedState, setSavedState] = useState<"saved" | "saving">("saved");
  const editorElementRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEditor() {
      const { default: QuillEditor } = await import("quill");
      if (!isMounted || !editorElementRef.current || quillRef.current) {
        return;
      }

      const quill = new QuillEditor(editorElementRef.current, {
        modules: {
          toolbar: [
            ["bold", "italic"],
            ["link", "blockquote"],
            [{ header: [2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
        placeholder: "Tell your story...",
        theme: "bubble",
      });

      quill.clipboard.dangerouslyPasteHTML(contentHtml);
      quillRef.current = quill;

      const persist = () => {
        setSavedState("saving");
        const nextHtml = quill.root.innerHTML;
        const nextText = quill.getText();
        setContentHtml(nextHtml);
        setContentText(nextText);
        saveDraft({ ...safeReadDraft(), contentHtml: nextHtml, contentText: nextText });
        setSavedState("saved");
      };

      persist();
      quill.on("text-change", persist);
    }

    loadEditor();
    return () => {
      isMounted = false;
    };
  }, []);

  const wordCount = Math.max(0, contentText.trim().split(/\s+/).filter(Boolean).length);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 text-xs text-zinc-500">
        <span className="truncate">
          Tip: Paste YouTube or image URLs on their own line.
        </span>
        <span className="shrink-0 tabular-nums">
          {savedState === "saving" ? "Saving…" : "Saved"} • {wordCount} words
        </span>
      </div>

      <input
        value={title}
        onChange={(event) => {
          const next = event.target.value;
          setTitle(next);
          saveDraft({ ...safeReadDraft(), title: next });
        }}
        placeholder="Title"
        className="mb-6 w-full bg-transparent font-serif text-5xl leading-[1.05] tracking-tight text-zinc-950 placeholder:text-zinc-300 focus:outline-none"
      />

      <div className="medium-quill">
        <div ref={editorElementRef} />
      </div>
    </div>
  );
}

