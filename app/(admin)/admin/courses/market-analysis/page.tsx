import Link from "next/link";
import { PublicCourseEditor } from "../_components/PublicCourseEditor";
import {
  MARKET_ANALYSIS_COURSE_KEY,
  defaultMarketAnalysisEyebrow,
  defaultMarketAnalysisTitle,
} from "@/lib/public-course-defaults";

export default function AdminMarketAnalysisPage() {
  return (
    <PublicCourseEditor
      courseKey={MARKET_ANALYSIS_COURSE_KEY}
      pageHeading="Market Analysis"
      liveHref="/resources"
      eyebrowPlaceholder={defaultMarketAnalysisEyebrow}
      titlePlaceholder={defaultMarketAnalysisTitle}
      blurb={
        <p>
          Edit the public{" "}
          <Link
            href="/resources"
            className="font-medium text-sky-700 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            /resources
          </Link>{" "}
          page. Add video links below — they appear as a lesson grid on the public page.
        </p>
      }
    />
  );
}
