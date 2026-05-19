import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackToHomeButton({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-white/75 transition",
        "border border-white/12 bg-white/[0.04] backdrop-blur-sm",
        "hover:border-white/25 hover:bg-white/[0.08] hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        className,
      )}
    >
      <ArrowLeft
        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden
      />
      Back to home
    </Link>
  );
}
