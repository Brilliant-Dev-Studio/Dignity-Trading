import { prisma } from "@/lib/prisma";
import {
  FOREX_FREE_BEGINNER_COURSE_KEY,
  FOREX_FREE_INTERMEDIATE_COURSE_KEY,
  defaultForexFreeBeginnerDescriptionEn1,
  defaultForexFreeBeginnerDescriptionEn2,
  defaultForexFreeBeginnerDescriptionMy1,
  defaultForexFreeBeginnerDescriptionMy2,
  defaultForexFreeBeginnerEyebrow,
  defaultForexFreeBeginnerLessonUrls,
  defaultForexFreeBeginnerTitle,
  defaultForexFreeIntermediateDescriptionEn1,
  defaultForexFreeIntermediateDescriptionEn2,
  defaultForexFreeIntermediateDescriptionMy1,
  defaultForexFreeIntermediateDescriptionMy2,
  defaultForexFreeIntermediateEyebrow,
  defaultForexFreeIntermediateLessonUrls,
  defaultForexFreeIntermediateTitle,
} from "@/lib/public-course-defaults";

export type PublicCourseWithLessons = NonNullable<
  Awaited<ReturnType<typeof getPublicCourseWithLessonsByKey>>
>;

export const ADMIN_MANAGED_PUBLIC_COURSE_KEYS = [
  FOREX_FREE_BEGINNER_COURSE_KEY,
  FOREX_FREE_INTERMEDIATE_COURSE_KEY,
] as const;

export type AdminManagedPublicCourseKey =
  (typeof ADMIN_MANAGED_PUBLIC_COURSE_KEYS)[number];

export function isAdminManagedPublicCourseKey(
  key: string,
): key is AdminManagedPublicCourseKey {
  return (ADMIN_MANAGED_PUBLIC_COURSE_KEYS as readonly string[]).includes(key);
}

export async function getPublicCourseWithLessonsByKey(key: string) {
  return prisma.publicCourse.findUnique({
    where: { key },
    include: {
      lessons: { orderBy: { sortOrder: "asc" } },
    },
  });
}

type SeedPayload = {
  eyebrow: string;
  title: string;
  descriptionEn1: string;
  descriptionEn2: string;
  descriptionMy1: string;
  descriptionMy2: string;
  lessonUrls: readonly string[];
};

function seedPayloadForKey(key: string): SeedPayload {
  if (key === FOREX_FREE_BEGINNER_COURSE_KEY) {
    return {
      eyebrow: defaultForexFreeBeginnerEyebrow,
      title: defaultForexFreeBeginnerTitle,
      descriptionEn1: defaultForexFreeBeginnerDescriptionEn1,
      descriptionEn2: defaultForexFreeBeginnerDescriptionEn2,
      descriptionMy1: defaultForexFreeBeginnerDescriptionMy1,
      descriptionMy2: defaultForexFreeBeginnerDescriptionMy2,
      lessonUrls: defaultForexFreeBeginnerLessonUrls,
    };
  }
  if (key === FOREX_FREE_INTERMEDIATE_COURSE_KEY) {
    return {
      eyebrow: defaultForexFreeIntermediateEyebrow,
      title: defaultForexFreeIntermediateTitle,
      descriptionEn1: defaultForexFreeIntermediateDescriptionEn1,
      descriptionEn2: defaultForexFreeIntermediateDescriptionEn2,
      descriptionMy1: defaultForexFreeIntermediateDescriptionMy1,
      descriptionMy2: defaultForexFreeIntermediateDescriptionMy2,
      lessonUrls: defaultForexFreeIntermediateLessonUrls,
    };
  }
  throw new Error(`Unknown public course key: ${key}`);
}

/**
 * Ensures a `PublicCourse` row exists for this key (seeded on first request).
 */
export async function ensurePublicCourseByKey(
  key: AdminManagedPublicCourseKey,
): Promise<PublicCourseWithLessons> {
  const existing = await getPublicCourseWithLessonsByKey(key);
  if (existing) return existing;

  const seed = seedPayloadForKey(key);

  return prisma.$transaction(async (tx) => {
    return tx.publicCourse.create({
      data: {
        key,
        eyebrow: seed.eyebrow,
        title: seed.title,
        descriptionEn1: seed.descriptionEn1,
        descriptionEn2: seed.descriptionEn2,
        descriptionMy1: seed.descriptionMy1,
        descriptionMy2: seed.descriptionMy2,
        lessons: {
          create: seed.lessonUrls.map((videoUrl, i) => ({
            sortOrder: i,
            videoUrl,
          })),
        },
      },
      include: {
        lessons: { orderBy: { sortOrder: "asc" } },
      },
    });
  });
}

export async function getForexFreeBeginnerCourseForPublic() {
  return ensurePublicCourseByKey(FOREX_FREE_BEGINNER_COURSE_KEY);
}

export async function getForexFreeIntermediateCourseForPublic() {
  return ensurePublicCourseByKey(FOREX_FREE_INTERMEDIATE_COURSE_KEY);
}
