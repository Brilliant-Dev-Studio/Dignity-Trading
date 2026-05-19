import Image from "next/image";
import type { SVGProps } from "react";

const SOCIAL = {
  facebook: "https://www.facebook.com/",
  youtube: "https://www.youtube.com/@dignityforexcryptostocktra5933",
  viber: "viber://chat?number=+959970276429",
  email: "mailto:contact@dignitytrading.com",
} as const;

const VIBER_DISPLAY = "09 970 276 429";
const CONTACT_EMAIL_DISPLAY = "contact@dignitytrading.com";

function IconFacebook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function IconYoutube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  );
}

function IconViber(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M11.4 0C9.473 0 5.684.033 3.525 2.168c-1.724 1.704-2.272 4.28-2.272 7.112 0 3.636-.022 7.428 3.947 8.8v4.004l3.587-1.996c.91.063 1.926.09 2.613.09 1.928 0 5.717-.033 7.876-2.168 1.724-1.704 2.272-4.28 2.272-7.112 0-3.636.022-7.428-3.947-8.8C17.316.033 13.327 0 11.4 0zm.193 1.96c1.833 0 5.38.03 7.38 1.99 1.17 1.15 1.54 3.18 1.54 6.33 0 5.46-2.37 7.72-9.92 7.72-.79 0-1.58-.03-2.37-.09l-.25-.02-.02-.15-.01-.12-.01h-.09l-2.61 1.45v-3.09c-3.18-1.02-3.18-4.47-3.18-5.97 0-3.15.37-5.18 1.54-6.33 2-1.96 5.55-1.99 7.38-1.99zm.45 3.38c-.19 0-.38.01-.57.03-.48.05-.95.15-1.4.3-.45.15-.88.35-1.28.6-.4.25-.77.55-1.1.9-.33.35-.62.75-.87 1.18-.25.43-.45.9-.6 1.38-.15.48-.25.98-.3 1.48-.05.5-.05 1 0 1.5.05.5.15.98.3 1.45.15.47.35.92.6 1.35.25.43.54.82.87 1.17.33.35.7.65 1.1.9.4.25.83.45 1.28.6.45.15.92.25 1.4.3.48.05.97.05 1.45 0 .48-.05.95-.15 1.4-.3.45-.15.88-.35 1.28-.6.4-.25.77-.55 1.1-.9.33-.35.62-.74.87-1.17.25-.43.45-.88.6-1.35.15-.47.25-.95.3-1.45.05-.5.05-1 0-1.5-.05-.5-.15-.98-.3-1.48-.15-.48-.35-.95-.6-1.38-.25-.43-.54-.83-.87-1.18-.33-.35-.7-.65-1.1-.9-.4-.25-.83-.45-1.28-.6-.45-.15-.92-.25-1.4-.3-.19-.02-.38-.03-.57-.03zm0 1.44c.15 0 .3.01.45.02.38.04.75.12 1.1.24.35.12.68.28.98.48.3.2.57.44.8.72.23.28.42.6.57.94.15.34.25.7.3 1.08.05.38.05.76 0 1.14-.05.38-.15.74-.3 1.08-.15.34-.34.66-.57.94-.23.28-.5.52-.8.72-.3.2-.63.36-.98.48-.35.12-.72.2-1.1.24-.38.04-.77.04-1.15 0-.38-.04-.75-.12-1.1-.24-.35-.12-.68-.28-.98-.48-.3-.2-.57-.44-.8-.72-.23-.28-.42-.6-.57-.94-.15-.34-.25-.7-.3-1.08-.05-.38-.05-.76 0-1.14.05-.38.15-.74.3-1.08.15-.34.34-.66.57-.94.23-.28.5-.52.8-.72.3-.2.63-.36.98-.48.35-.12.72-.2 1.1-.24.15-.01.3-.02.45-.02z"
      />
    </svg>
  );
}

function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
      />
    </svg>
  );
}

const linkClass =
  "grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] text-white/80 ring-1 ring-white/12 transition hover:bg-white/10 hover:text-white hover:ring-white/20";

const items = [
  { key: "facebook", href: SOCIAL.facebook, label: "Facebook", Icon: IconFacebook },
  { key: "youtube", href: SOCIAL.youtube, label: "YouTube", Icon: IconYoutube },
  { key: "viber", href: SOCIAL.viber, label: "Viber", Icon: IconViber },
  { key: "email", href: SOCIAL.email, label: "Email", Icon: IconMail },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90 [background-image:radial-gradient(900px_520px_at_18%_30%,rgba(84,168,230,0.16),transparent_62%),radial-gradient(800px_520px_at_86%_78%,rgba(255,190,55,0.10),transparent_64%),linear-gradient(to_top,rgba(47,102,212,0.10),transparent_45%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:14px_14px]"
      />
      <div className="mx-auto w-[97%] max-w-none px-4 py-14 sm:w-[85%] sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10">
                <Image
                  src="/logo.png"
                  alt="Dignity Trading"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide text-white">
                  Dignity Trading
                </div>
                <div className="text-xs text-white/55">
                  Rules-first. Repeatable. Risk-aware.
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
              Learn trading with a clear, rules-first process—so you can manage risk
              and build consistency over time.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {items.map(({ key, href, label, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target={key === "email" || key === "viber" ? undefined : "_blank"}
                  rel={key === "email" || key === "viber" ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  className={linkClass}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="text-sm font-semibold text-white">Contact</div>
            <div className="mt-4 space-y-2 text-sm text-white/65">
              <a
                href={SOCIAL.email}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-white/10 hover:text-white"
              >
                <span className="text-white/55">Email:</span> {CONTACT_EMAIL_DISPLAY}
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-white/10 hover:text-white"
              >
                <span className="text-white/55">YouTube:</span> Join & learn
              </a>
              <a
                href={SOCIAL.viber}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-white/10 hover:text-white"
              >
                <span className="text-white/55">Viber:</span> {VIBER_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/50">
            © {year} Dignity Trading. All rights reserved.
          </p>
          <a
            href="#home"
            className="text-xs font-medium text-white/65 transition hover:text-white"
          >
            Back to top
          </a>
        </div>

        <p className="mt-6 max-w-4xl text-[11px] leading-5 text-white/45">
          <span className="font-semibold text-white/55">Risk Disclaimer:</span> Forex trading
          involves high risk. All content on this website is for educational purposes only and is
          not financial advice. We do not guarantee profits or results. Trade only with money you
          can afford to lose.
        </p>
      </div>
    </footer>
  );
}
