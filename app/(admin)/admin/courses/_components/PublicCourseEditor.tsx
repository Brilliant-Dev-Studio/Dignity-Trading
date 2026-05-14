"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const textareaClass = cn(
  "flex min-h-[120px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm transition-colors placeholder:text-zinc-400",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

type LessonRow = { id: string; videoUrl: string };

type CoursePayload = {
  id: string;
  key: string;
  eyebrow: string;
  title: string;
  descriptionEn1: string;
  descriptionEn2: string;
  descriptionMy1: string;
  descriptionMy2: string;
  lessons: Array<{ id: string; videoUrl: string; sortOrder: number }>;
};

function newRowId() {
  return `tmp_${Math.random().toString(36).slice(2, 11)}`;
}

export function PublicCourseEditor({
  courseKey,
  pageHeading,
  blurb,
  liveHref,
  eyebrowPlaceholder,
  titlePlaceholder,
}: {
  courseKey: string;
  pageHeading: string;
  blurb: ReactNode;
  liveHref: string;
  eyebrowPlaceholder: string;
  titlePlaceholder: string;
}) {
  const apiUrl = `/api/admin/courses/${courseKey}`;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  const [eyebrow, setEyebrow] = useState("");
  const [title, setTitle] = useState("");
  const [descriptionEn1, setDescriptionEn1] = useState("");
  const [descriptionEn2, setDescriptionEn2] = useState("");
  const [descriptionMy1, setDescriptionMy1] = useState("");
  const [descriptionMy2, setDescriptionMy2] = useState("");
  const [lessonRows, setLessonRows] = useState<LessonRow[]>([]);

  const hydrate = useCallback((course: CoursePayload) => {
    setEyebrow(course.eyebrow);
    setTitle(course.title);
    setDescriptionEn1(course.descriptionEn1);
    setDescriptionEn2(course.descriptionEn2);
    setDescriptionMy1(course.descriptionMy1);
    setDescriptionMy2(course.descriptionMy2);
    setLessonRows(
      course.lessons.length > 0
        ? course.lessons.map((l) => ({ id: l.id, videoUrl: l.videoUrl }))
        : [{ id: newRowId(), videoUrl: "" }],
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await fetch(apiUrl, { method: "GET" });
        if (!res.ok) throw new Error(`Load failed (${res.status})`);
        const json = (await res.json()) as { course: CoursePayload };
        if (cancelled) return;
        hydrate(json.course);
      } catch (e) {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : "Failed to load course");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, hydrate]);

  const addLessonRow = () => {
    setLessonRows((rows) => [...rows, { id: newRowId(), videoUrl: "" }]);
  };

  const removeLessonRow = (id: string) => {
    setLessonRows((rows) => (rows.length <= 1 ? rows : rows.filter((r) => r.id !== id)));
  };

  const moveLesson = (index: number, dir: -1 | 1) => {
    setLessonRows((rows) => {
      const next = index + dir;
      if (next < 0 || next >= rows.length) return rows;
      const copy = [...rows];
      const tmp = copy[index]!;
      copy[index] = copy[next]!;
      copy[next] = tmp;
      return copy;
    });
  };

  const updateLessonUrl = (id: string, videoUrl: string) => {
    setLessonRows((rows) => rows.map((r) => (r.id === id ? { ...r, videoUrl } : r)));
  };

  const save = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      setSavedOk(false);
      const lessons = lessonRows
        .map((r) => ({ videoUrl: r.videoUrl.trim() }))
        .filter((r) => r.videoUrl.length > 0);

      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow,
          title,
          descriptionEn1,
          descriptionEn2,
          descriptionMy1,
          descriptionMy2,
          lessons,
        }),
      });

      if (!res.ok) {
        const errJson = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errJson?.error ?? `Save failed (${res.status})`);
      }

      const json = (await res.json()) as { course: CoursePayload };
      hydrate(json.course);
      setSavedOk(true);
      window.setTimeout(() => setSavedOk(false), 3200);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{pageHeading}</h2>
          <div className="mt-1 max-w-2xl text-sm text-zinc-600">{blurb}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={liveHref}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 shadow-sm transition-colors hover:bg-zinc-50",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand-700)]",
            )}
          >
            View live page
          </Link>
          <Button type="button" onClick={save} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </>
            )}
          </Button>
        </div>
      </div>

      {loadError ? (
        <p className="mt-6 text-sm text-red-600">{loadError}</p>
      ) : null}
      {saveError ? (
        <p className="mt-4 text-sm text-red-600">{saveError}</p>
      ) : null}
      {savedOk ? (
        <p className="mt-4 text-sm font-medium text-emerald-700">Saved. Public page was updated.</p>
      ) : null}

      {loading ? (
        <div className="mt-8 space-y-4" aria-busy="true">
          <div className="h-10 animate-pulse rounded-md bg-zinc-200/70" />
          <div className="h-10 animate-pulse rounded-md bg-zinc-200/70" />
          <div className="h-32 animate-pulse rounded-md bg-zinc-200/70" />
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <Card className="!shadow-none">
            <CardHeader>
              <CardTitle>Headings</CardTitle>
              <CardDescription>Shown as the gradient eyebrow and main title.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`eyebrow-${courseKey}`}>Eyebrow (uppercase line)</Label>
                <Input
                  id={`eyebrow-${courseKey}`}
                  value={eyebrow}
                  onChange={(e) => setEyebrow(e.target.value)}
                  placeholder={eyebrowPlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`title-${courseKey}`}>Title</Label>
                <Input
                  id={`title-${courseKey}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={titlePlaceholder}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="!shadow-none">
            <CardHeader>
              <CardTitle>English</CardTitle>
              <CardDescription>Two paragraphs under the “English” section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`en1-${courseKey}`}>Paragraph 1</Label>
                <textarea
                  id={`en1-${courseKey}`}
                  className={textareaClass}
                  value={descriptionEn1}
                  onChange={(e) => setDescriptionEn1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`en2-${courseKey}`}>Paragraph 2</Label>
                <textarea
                  id={`en2-${courseKey}`}
                  className={textareaClass}
                  value={descriptionEn2}
                  onChange={(e) => setDescriptionEn2(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="!shadow-none">
            <CardHeader>
              <CardTitle>မြန်မာ</CardTitle>
              <CardDescription>Two paragraphs under the “မြန်မာ” section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`my1-${courseKey}`}>Paragraph 1</Label>
                <textarea
                  id={`my1-${courseKey}`}
                  className={textareaClass}
                  value={descriptionMy1}
                  onChange={(e) => setDescriptionMy1(e.target.value)}
                  lang="my"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`my2-${courseKey}`}>Paragraph 2</Label>
                <textarea
                  id={`my2-${courseKey}`}
                  className={textareaClass}
                  value={descriptionMy2}
                  onChange={(e) => setDescriptionMy2(e.target.value)}
                  lang="my"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="!shadow-none">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div>
                <CardTitle>Video lessons</CardTitle>
                <CardDescription>
                  One YouTube URL per row (watch link or youtu.be). Order = lesson order on the
                  site.
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addLessonRow}>
                <Plus className="mr-1 h-4 w-4" />
                Add row
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessonRows.map((row, index) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 sm:flex-row sm:items-center"
                >
                  <span className="w-10 shrink-0 text-xs font-semibold tabular-nums text-zinc-500">
                    {index + 1}.
                  </span>
                  <Input
                    className="flex-1 font-mono text-xs sm:text-sm"
                    value={row.videoUrl}
                    onChange={(e) => updateLessonUrl(row.id, e.target.value)}
                    placeholder="https://youtu.be/… or https://www.youtube.com/watch?v=…"
                  />
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      title="Move up"
                      onClick={() => moveLesson(index, -1)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      title="Move down"
                      onClick={() => moveLesson(index, 1)}
                      disabled={index === lessonRows.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-600 hover:text-red-700"
                      title="Remove row"
                      onClick={() => removeLessonRow(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
