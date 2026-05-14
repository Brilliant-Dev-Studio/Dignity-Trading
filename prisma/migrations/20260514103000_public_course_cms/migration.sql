-- CreateTable
CREATE TABLE "PublicCourse" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "descriptionEn1" TEXT NOT NULL DEFAULT '',
    "descriptionEn2" TEXT NOT NULL DEFAULT '',
    "descriptionMy1" TEXT NOT NULL DEFAULT '',
    "descriptionMy2" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicCourseLesson" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "videoUrl" TEXT NOT NULL,

    CONSTRAINT "PublicCourseLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicCourse_key_key" ON "PublicCourse"("key");

-- CreateIndex
CREATE INDEX "PublicCourseLesson_courseId_sortOrder_idx" ON "PublicCourseLesson"("courseId", "sortOrder");

-- AddForeignKey
ALTER TABLE "PublicCourseLesson" ADD CONSTRAINT "PublicCourseLesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "PublicCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
