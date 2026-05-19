import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import BackToHomeButton from "@/app/components/BackToHomeButton";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Dignity Trading Academy team via email or Viber.",
  openGraph: {
    title: "Contact — Dignity Trading",
    description: "Reach the Dignity Trading Academy team directly.",
    url: "/contact",
  },
};

const CONTACT_EMAIL = "contact@dignitytrading.com";
const VIBER_DISPLAY = "09 970 276 429";
const VIBER_INTL = "+959970276429";

export default function ContactPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-100 [background-image:radial-gradient(900px_500px_at_18%_24%,color-mix(in_oklab,var(--brand-400)_22%,transparent),transparent_64%),radial-gradient(900px_540px_at_82%_72%,color-mix(in_oklab,var(--brand-700)_20%,transparent),transparent_68%)] blur-xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(700px_180px_at_50%_0%,rgba(84,168,230,0.18),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto w-[92%] max-w-3xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Let&apos;s talk.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
          Have a question about a course, a trade idea, or anything else? Reach
          us directly through one of the channels below.
        </p>

        <div className="mt-12 space-y-4">
          <ContactCard
            Icon={Mail}
            label="Email"
            primary={CONTACT_EMAIL}
            href={`mailto:${CONTACT_EMAIL}`}
            actionText="Send email"
          />
          <ContactCard
            Icon={MessageCircle}
            label="Viber"
            primary={VIBER_DISPLAY}
            href={`viber://chat?number=${VIBER_INTL}`}
            actionText="Open in Viber"
          />
        </div>

        <div className="mt-14">
          <BackToHomeButton />
        </div>
      </div>
    </main>
  );
}

function ContactCard({
  Icon,
  label,
  primary,
  href,
  actionText,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  label: string;
  primary: string;
  href: string;
  actionText: string;
}) {
  return (
    <a
      href={href}
      className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/5.5 to-white/2 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_60px_rgba(0,0,0,0.38)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_28px_72px_rgba(0,0,0,0.5)] sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[color-mix(in_oklab,var(--brand-400)_70%,white)] to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90"
      />
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.07] ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-white/[0.10]">
        <Icon
          className="h-5 w-5 text-[color-mix(in_oklab,var(--brand-400)_78%,white)]"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
          {label}
        </p>
        <p className="mt-1 truncate text-base font-medium text-white sm:text-lg">
          {primary}
        </p>
      </div>
      <span className="hidden shrink-0 text-sm font-medium text-white/60 transition-colors duration-300 group-hover:text-white sm:inline">
        {actionText} <span aria-hidden>→</span>
      </span>
    </a>
  );
}
