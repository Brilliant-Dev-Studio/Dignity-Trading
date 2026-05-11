import type { Metadata } from "next";
import BlogPageChrome from "@/app/blog/BlogPageChrome";
import { blogChromeTitleClass } from "@/app/blog/blog-chrome";

export const metadata: Metadata = {
  title: "Risk Disclaimer | Dignity Trading",
  description:
    "Risk disclaimer for Dignity Trading Academy. Educational information only; forex trading involves substantial risk.",
};

export default function DisclaimerPage() {
  return (
    <BlogPageChrome>
      <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}>
        Disclaimer
      </p>
      <h1 className={`mt-4 text-4xl font-semibold tracking-tight sm:text-5xl ${blogChromeTitleClass}`}>
        Risk Disclaimer
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
        Please read carefully. This page explains the risk of trading and clarifies that our
        content is for education only.
      </p>

      <div className="mt-8">
        <div className="max-w-3xl overflow-hidden rounded-2xl border border-amber-200/15 bg-[linear-gradient(165deg,rgba(255,190,55,0.10)_0%,rgba(255,255,255,0.05)_40%,rgba(255,255,255,0.03)_100%)] p-5 shadow-[0_18px_65px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/10 backdrop-blur-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/80">
            Important
          </p>
          <p className="mt-3 text-sm leading-7 text-white/80 sm:text-base">
            Trading is risky. You may lose some or all of your capital. Only trade with money you
            can afford to lose.
          </p>
        </div>

        <div className="mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_65px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/10 backdrop-blur-sm sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                  English
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
                  Risk Disclaimer
                </h2>
              </div>
              <span className="text-[11px] font-medium text-white/40">Educational only</span>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-7 text-white/75 sm:text-[15px] sm:leading-7">
              <p>
                The information provided by Dignity Trading Academy is for educational purposes
                only and should not be considered financial, investment, or trading advice.
              </p>
              <p>
                Forex trading involves a high level of risk and may not be suitable for everyone.
                Trading with leverage can increase both profits and losses, and you may lose some
                or all of your trading capital.
              </p>
              <p>
                We do not guarantee profits, income, or trading success. Any examples, strategies,
                charts, or testimonials shared are for learning purposes only and do not guarantee
                future results.
              </p>
              <p>
                Past performance is not a reliable indicator of future performance. You are fully
                responsible for your own trading decisions and should only trade with money you
                can afford to lose.
              </p>
              <p>
                We recommend seeking advice from a qualified financial professional before making
                any trading or investment decision.
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_65px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/10 backdrop-blur-sm sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                  မြန်မာ
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
                  Risk Disclaimer
                </h2>
              </div>
              <span className="text-[11px] font-medium text-white/40">ပညာရေးသာ</span>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-7 text-white/75 sm:text-[15px] sm:leading-7">
              <p>
                Dignity Trading Academy မှ ပေးအပ်သော အချက်အလက်များသည် ပညာရေးရည်ရွယ်ချက်အတွက်သာ ဖြစ်ပြီး၊
                Financial Advice, Investment Advice သို့မဟုတ် Trading Advice အဖြစ် မယူဆသင့်ပါ။
              </p>
              <p>
                Forex Trading သည် အန္တရာယ်မြင့်မားသော လုပ်ငန်းတစ်ခုဖြစ်ပြီး လူတိုင်းအတွက် သင့်လျော်မည်မဟုတ်ပါ။
                Leverage ဖြင့် trading ပြုလုပ်ခြင်းသည် အမြတ်ကို တိုးစေနိုင်သကဲ့သို့ အရှုံးကိုလည်း တိုးစေနိုင်ပြီး၊
                သင့် trading capital အချို့ သို့မဟုတ် အားလုံးကို ဆုံးရှုံးနိုင်ပါသည်။
              </p>
              <p>
                ကျွန်ုပ်တို့သည် အမြတ်၊ ဝင်ငွေ သို့မဟုတ် trading success ကို အာမခံခြင်း မပြုပါ။ Website ပေါ်ရှိ
                examples, strategies, charts သို့မဟုတ် testimonials များသည် သင်ယူလေ့လာရန်အတွက်သာ ဖြစ်ပြီး
                အနာဂတ်ရလဒ်များကို အာမခံခြင်း မဟုတ်ပါ။
              </p>
              <p>
                Past performance သည် future performance အတွက် အာမခံချက် မဟုတ်ပါ။ သင်၏ trading decision များအားလုံးအတွက်
                သင်ကိုယ်တိုင် အပြည့်အဝ တာဝန်ရှိပြီး၊ ဆုံးရှုံးနိုင်သော ငွေဖြင့်သာ trading ပြုလုပ်သင့်ပါသည်။
              </p>
            </div>
          </section>
        </div>
      </div>
    </BlogPageChrome>
  );
}

