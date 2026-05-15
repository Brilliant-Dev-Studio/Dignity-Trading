import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  FOREX_FREE_BEGINNER_COURSE_KEY,
  FOREX_FREE_INTERMEDIATE_COURSE_KEY,
  MARKET_ANALYSIS_COURSE_KEY,
  PROFESSIONAL_ADVANCE_COURSE_KEY,
} from "@/lib/public-course-defaults";
import {
  ensurePublicCourseByKey,
  isAdminManagedPublicCourseKey,
} from "@/lib/public-course";

const MAX_LESSONS = 80;

type PutBody = {
  eyebrow?: string;
  title?: string;
  descriptionEn1?: string;
  descriptionEn2?: string;
  descriptionMy1?: string;
  descriptionMy2?: string;
  lessons?: Array<{ videoUrl?: string }>;
};

function revalidatePathsForCourseKey(key: string) {
  if (key === FOREX_FREE_BEGINNER_COURSE_KEY) {
    revalidatePath("/learn-forex");
  }
  if (key === FOREX_FREE_INTERMEDIATE_COURSE_KEY) {
    revalidatePath("/learn-forex-intermediate");
  }
  if (key === PROFESSIONAL_ADVANCE_COURSE_KEY) {
    revalidatePath("/learn-forex-advanced");
  }
  if (key === MARKET_ANALYSIS_COURSE_KEY) {
    revalidatePath("/resources");
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ key: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { key } = await context.params;
  if (!isAdminManagedPublicCourseKey(key)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const course = await ensurePublicCourseByKey(key);
  return NextResponse.json({ course });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ key: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { key } = await context.params;
  if (!isAdminManagedPublicCourseKey(key)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: PutBody;
  try {
    body = (await req.json()) as PutBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const eyebrow = body.eyebrow !== undefined ? String(body.eyebrow) : undefined;
  const title = body.title !== undefined ? String(body.title) : undefined;
  const descriptionEn1 =
    body.descriptionEn1 !== undefined ? String(body.descriptionEn1) : undefined;
  const descriptionEn2 =
    body.descriptionEn2 !== undefined ? String(body.descriptionEn2) : undefined;
  const descriptionMy1 =
    body.descriptionMy1 !== undefined ? String(body.descriptionMy1) : undefined;
  const descriptionMy2 =
    body.descriptionMy2 !== undefined ? String(body.descriptionMy2) : undefined;

  const rawLessons = body.lessons;
  const shouldReplaceLessons = Array.isArray(rawLessons);
  const lessonUrls = shouldReplaceLessons
    ? rawLessons
        .map((row) => String((row as { videoUrl?: string })?.videoUrl ?? "").trim())
        .filter(Boolean)
    : null;

  if (lessonUrls && lessonUrls.length > MAX_LESSONS) {
    return NextResponse.json(
      { error: "too_many_lessons", max: MAX_LESSONS },
      { status: 400 },
    );
  }

  const course = await ensurePublicCourseByKey(key);

  await prisma.$transaction(async (tx) => {
    await tx.publicCourse.update({
      where: { id: course.id },
      data: {
        ...(eyebrow !== undefined ? { eyebrow } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(descriptionEn1 !== undefined ? { descriptionEn1 } : {}),
        ...(descriptionEn2 !== undefined ? { descriptionEn2 } : {}),
        ...(descriptionMy1 !== undefined ? { descriptionMy1 } : {}),
        ...(descriptionMy2 !== undefined ? { descriptionMy2 } : {}),
      },
    });

    if (lessonUrls !== null) {
      await tx.publicCourseLesson.deleteMany({ where: { courseId: course.id } });
      if (lessonUrls.length > 0) {
        await tx.publicCourseLesson.createMany({
          data: lessonUrls.map((videoUrl, i) => ({
            courseId: course.id,
            videoUrl,
            sortOrder: i,
          })),
        });
      }
    }
  });

  const updated = await prisma.publicCourse.findUniqueOrThrow({
    where: { id: course.id },
    include: { lessons: { orderBy: { sortOrder: "asc" } } },
  });

  revalidatePathsForCourseKey(key);

  return NextResponse.json({ course: updated });
}
