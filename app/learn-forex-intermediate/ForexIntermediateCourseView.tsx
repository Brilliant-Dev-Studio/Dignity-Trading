import Link from "next/link";
import BlogPageChrome from "@/app/blog/BlogPageChrome";
import { blogChromeTitleClass } from "@/app/blog/blog-chrome";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import { extractYoutubeId } from "@/lib/blog-html";
import {
  defaultForexFreeIntermediateEyebrow,
  defaultForexFreeIntermediateTitle,
} from "@/lib/public-course-defaults";
import { getForexFreeIntermediateCourseForPublic } from "@/lib/public-course";
import { cn } from "@/lib/utils";

function YoutubeLessonEmbed({
  videoId,
  lessonIndex,
  courseTitle,
  className,
}: {
  videoId: string;
  lessonIndex: number;
  courseTitle: string;
  className?: string;
}) {
  const title = `${courseTitle} — Lesson ${lessonIndex}`;
  const src = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return (
    <div
      className={cn("relative aspect-video w-full overflow-hidden bg-zinc-950", className)}
    >
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export default async function ForexIntermediateCourseView() {
  const course = await getForexFreeIntermediateCourseForPublic();

  const lessons = course.lessons.map((l, i) => ({
    dbId: l.id,
    url: l.videoUrl,
    id: extractYoutubeId(l.videoUrl),
    index: i + 1,
  }));

  const displayTitle =
    course.title.trim() || defaultForexFreeIntermediateTitle;
  const displayEyebrow =
    course.eyebrow.trim() || defaultForexFreeIntermediateEyebrow;

  return (
    <BlogPageChrome lite containerClassName="max-w-7xl">
      <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}>
        {displayEyebrow}
      </p>
      <div className="mt-4 inline-flex flex-col">
        <h1
          className={`text-4xl font-semibold tracking-tight sm:text-5xl ${blogChromeTitleClass} pb-1`}
        >
          {displayTitle}
        </h1>
        <span
          aria-hidden="true"
          className="mt-3 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
        />
      </div>

      <section className="mt-10 w-full max-w-none space-y-4 text-sm leading-relaxed text-white/80 sm:text-base sm:leading-8">
        <h2 className="text-base font-semibold text-white">English</h2>
        <p>{course.descriptionEn1}</p>
        <p>{course.descriptionEn2}</p>
      </section>

      <section
        className="mt-10 w-full max-w-none space-y-4 text-sm leading-relaxed text-white/80 sm:text-base sm:leading-8"
        lang="my"
      >
        <h2 className="text-base font-semibold text-white">မြန်မာ</h2>
        <p>{course.descriptionMy1}</p>
        <p>{course.descriptionMy2}</p>
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight text-white">Lessons</h2>
        {lessons.length > 0 ? (
          <>
            <p className="mt-2 text-sm text-white/60">
              {lessons.length} video lessons — watch in order. Large screens use three columns;
              tablet uses two; phone uses one.
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
              {lessons.map((lesson) => (
                <li key={lesson.dbId} className="min-w-0">
                  {lesson.id ? (
                    <article
                      className={cn(
                        "flex h-full flex-col overflow-hidden rounded-2xl",
                        "border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02]",
                        "shadow-[0_20px_50px_-18px_rgba(0,0,0,0.9)]",
                        "transition-[border-color,box-shadow,transform] duration-300",
                        "hover:border-white/20 hover:shadow-[0_28px_60px_-16px_rgba(0,0,0,0.95)]",
                        "hover:-translate-y-0.5",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/25 px-3.5 py-3 sm:px-4">
                        <h3 className="text-sm font-semibold tracking-tight text-white">
                          Lesson {lesson.index}
                        </h3>
                        <span className="tabular-nums text-xs font-medium text-white/40">
                          {lesson.index}/{lessons.length}
                        </span>
                      </div>
                      <YoutubeLessonEmbed
                        videoId={lesson.id}
                        lessonIndex={lesson.index}
                        courseTitle={displayTitle}
                      />
                    </article>
                  ) : (
                    <p className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-200/90">
                      Could not read YouTube video ID for lesson {lesson.index}. Check the URL in
                      admin.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-4 text-sm text-white/55">
            No lessons yet. Add video links in Admin → Free Intermediate course.
          </p>
        )}
      </section>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/learn-forex"
          className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
        >
          Beginner course
        </Link>
        <Link
          href="/courses"
          className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
        >
          View courses
        </Link>
        <BackToHomeButton />
      </div>
    </BlogPageChrome>
  );
}
