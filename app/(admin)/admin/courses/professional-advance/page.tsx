import Link from "next/link";
import { PublicCourseEditor } from "../_components/PublicCourseEditor";
import {
  PROFESSIONAL_ADVANCE_COURSE_KEY,
  defaultProfessionalAdvanceEyebrow,
  defaultProfessionalAdvanceTitle,
} from "@/lib/public-course-defaults";

export default function AdminProfessionalAdvanceCoursePage() {
  return (
    <PublicCourseEditor
      courseKey={PROFESSIONAL_ADVANCE_COURSE_KEY}
      pageHeading="Professional Advance course"
      liveHref="/learn-forex-advanced"
      eyebrowPlaceholder={defaultProfessionalAdvanceEyebrow}
      titlePlaceholder={defaultProfessionalAdvanceTitle}
      blurb={
        <p>
          Edit the public{" "}
          <Link
            href="/learn-forex-advanced"
            className="font-medium text-sky-700 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            /learn-forex-advanced
          </Link>{" "}
          page. Content is stored separately from the beginner and intermediate courses.
        </p>
      }
    />
  );
}
