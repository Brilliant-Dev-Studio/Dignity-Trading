import Link from "next/link";
import { PublicCourseEditor } from "../_components/PublicCourseEditor";
import {
  FOREX_FREE_BEGINNER_COURSE_KEY,
  defaultForexFreeBeginnerEyebrow,
  defaultForexFreeBeginnerTitle,
} from "@/lib/public-course-defaults";

export default function AdminForexFreeBeginnerCoursePage() {
  return (
    <PublicCourseEditor
      courseKey={FOREX_FREE_BEGINNER_COURSE_KEY}
      pageHeading="Free Forex course (beginner)"
      liveHref="/learn-forex"
      eyebrowPlaceholder={defaultForexFreeBeginnerEyebrow}
      titlePlaceholder={defaultForexFreeBeginnerTitle}
      blurb={
        <p>
          Edit the public{" "}
          <Link
            href="/learn-forex"
            className="font-medium text-sky-700 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            /learn-forex
          </Link>{" "}
          page. Content is stored in the database.
        </p>
      }
    />
  );
}
