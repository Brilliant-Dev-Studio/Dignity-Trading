import type { Metadata } from "next";
import BlogPageChrome from "@/app/blog/BlogPageChrome";
import { blogChromeTitleClass } from "@/app/blog/blog-chrome";

export const metadata: Metadata = {
  title: "Open Trading Account",
  description:
    "Trading account ဖွင့်ရန် link နှင့် DPM Myanmar Team contact information.",
};

export default function OpenTradingAccountPage() {
  return (
    <BlogPageChrome containerClassName="w-full max-w-none px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
      <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}>
        Trading Account
      </p>
      <h1
        className={`mt-4 text-4xl font-semibold leading-[1.22] tracking-tight sm:text-5xl sm:leading-[1.22] ${blogChromeTitleClass} pb-2`}
      >
        Trading Account ဖွင့်ရန်
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
        Trading Account ဖွင့်ရန်အတွက် အောက်ပါ link များကို အသုံးပြုနိုင်ပါသည်။ ဖွင့်သည် Process
        အတွင်း အခက်အခဲတစုံတရာရှိပါက DPM Myanmar Team သို့တိုက်ရိုက် ဆက်သွယ်၍ အကူအညီတောင်းနိုင်ပါသည်။
      </p>

      <div className="mt-10 grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
        <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/10 backdrop-blur-sm sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-100 [background-image:radial-gradient(520px_280px_at_20%_18%,rgba(84,168,230,0.14),transparent_62%),radial-gradient(520px_280px_at_84%_78%,color-mix(in_oklab,var(--brand-400)_14%,transparent),transparent_66%)]"
          />

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
            Trading Account ဖွင့်ရန် Link
          </p>
          <h2 className="relative mt-3 text-xl font-semibold tracking-tight text-white">
            DooPrime Account Opening
          </h2>
          <p className="relative mt-3 text-sm leading-7 text-white/70">
            Link ကိုနှိပ်ပြီး account ဖွင့်နိုင်ပါတယ်။ (Browser/Phone တစ်ခုခုမှာ ဖွင့်ပေးပါ)
          </p>

          <a
            href="https://my.dooprime.com/links/go/10125"
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-400)_92%,white),var(--brand-700))] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition hover:brightness-110 active:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Trading Account ဖွင့်ရန် Link ကိုဖွင့်မယ်
          </a>

          <div className="relative mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
              Direct link
            </p>
            <p className="mt-2 break-all text-xs leading-5 text-white/55">
            https://my.dooprime.com/links/go/10125
            </p>
          </div>
        </section>

        <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/10 backdrop-blur-sm sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-100 [background-image:radial-gradient(520px_280px_at_18%_18%,color-mix(in_oklab,var(--brand-700)_14%,transparent),transparent_62%),radial-gradient(520px_280px_at_84%_78%,rgba(255,190,55,0.10),transparent_66%)]"
          />

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
            DPM Myanmar Team အားဆက်သွယ်ရန်
          </p>
          <h2 className="relative mt-3 text-xl font-semibold tracking-tight text-white">
            Help with the process
          </h2>
          <p className="relative mt-3 text-sm leading-7 text-white/70">
            Account ဖွင့်ရာမှာ မရ / အခက်အခဲရှိရင် အောက်ပါ channel တွေကနေ ဆက်သွယ်နိုင်ပါတယ်။
          </p>

          <div className="relative mt-6 grid gap-3">
            <a
              href="https://www.facebook.com/dooprimemyanmar?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white/80 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="font-semibold">Facebook</span>
              <span className="text-xs text-white/45">Open →</span>
            </a>
            <a
              href="https://t.me/DPMServiceTeam"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white/80 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="font-semibold">Telegram</span>
              <span className="text-xs text-white/45">DPMServiceTeam →</span>
            </a>
            <a
              href="https://t.me/dpmmyanmar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white/80 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="font-semibold">Telegram</span>
              <span className="text-xs text-white/45">dpmmyanmar →</span>
            </a>
          </div>
        </section>
      </div>
    </BlogPageChrome>
  );
}

