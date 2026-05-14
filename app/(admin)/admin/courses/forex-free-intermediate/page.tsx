import Link from "next/link";
import { PublicCourseEditor } from "../_components/PublicCourseEditor";
import {
  FOREX_FREE_INTERMEDIATE_COURSE_KEY,
  defaultForexFreeIntermediateEyebrow,
  defaultForexFreeIntermediateTitle,
} from "@/lib/public-course-defaults";

export default function AdminForexFreeIntermediateCoursePage() {
  return (
    <PublicCourseEditor
      courseKey={FOREX_FREE_INTERMEDIATE_COURSE_KEY}
      pageHeading="Free Intermediate course"
      liveHref="/learn-forex-intermediate"
      eyebrowPlaceholder={defaultForexFreeIntermediateEyebrow}
      titlePlaceholder={defaultForexFreeIntermediateTitle}
      blurb={
        <p>
          Edit the public{" "}
          <Link
            href="/learn-forex-intermediate"
            className="font-medium text-sky-700 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            /learn-forex-intermediate
          </Link>{" "}
          page. Content is stored separately from the beginner course.
        </p>
      }
    />
  );
}
