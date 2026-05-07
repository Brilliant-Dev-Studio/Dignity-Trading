import Image from "next/image";
import { Check } from "lucide-react";

import HeroIntro from "./components/HeroIntro";
import AnimatedCoin from "./components/AnimatedCoin";
import FloatingCoinsBackground from "./components/FloatingCoinsBackground";
import StarBorder from "./components/StarBorder";
import DotGrid from "./components/DotGrid";
import Reveal from "./components/Reveal";
import StaggerIn, { FadeUpItem } from "./components/StaggerIn";
import { cn } from "@/lib/utils";

const CHART_PREVIEW = "/chartBgRemove.png";

const tradingCardShell =
  "relative overflow-hidden rounded-[28px] border border-white/12 bg-zinc-950/85 shadow-[0_24px_80px_rgba(0,0,0,0.55)]";
const cardHoverShell =
  "transition will-change-transform hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_28px_90px_rgba(0,0,0,0.6)]";

function RedGreenBars({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 666 375"
      className={cn("h-full w-full", className)}
      fill="none"
    >
      <style>
        {`
          .bar { transform-box: fill-box; transform-origin: center bottom; }
          @keyframes barsPulse { 0% { transform: scaleY(0.22); opacity: 0.55; } 55% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(0.42); opacity: 0.75; } }
          #bar-1 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 0ms; }
          #bar-2 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 260ms; }
          #bar-3 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 520ms; }
          #bar-4 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 780ms; }
          #bar-5 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 1040ms; }
          #bar-6 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 1300ms; }
          #bar-7 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 1560ms; }
          #bar-8 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 1820ms; }
          #bar-9 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 2080ms; }
          #bar-10 { animation: barsPulse 6.5s ease-in-out infinite; animation-delay: 2340ms; }
        `}
      </style>

      <g id="crypto-chart-bars">
        <rect id="bar-1" className="bar" x="70" y="210" width="34" height="145" rx="10" fill="#22C55E" />
        <rect id="bar-2" className="bar" x="120" y="175" width="34" height="180" rx="10" fill="#EF4444" />
        <rect id="bar-3" className="bar" x="170" y="235" width="34" height="120" rx="10" fill="#22C55E" />
        <rect id="bar-4" className="bar" x="240" y="140" width="34" height="215" rx="10" fill="#EF4444" />
        <rect id="bar-5" className="bar" x="290" y="95" width="34" height="260" rx="10" fill="#22C55E" />
        <rect id="bar-6" className="bar" x="340" y="160" width="34" height="195" rx="10" fill="#EF4444" />
        <rect id="bar-7" className="bar" x="410" y="120" width="34" height="235" rx="10" fill="#22C55E" />
        <rect id="bar-8" className="bar" x="460" y="70" width="34" height="285" rx="10" fill="#EF4444" />
        <rect id="bar-9" className="bar" x="510" y="150" width="34" height="205" rx="10" fill="#22C55E" />
        <rect id="bar-10" className="bar" x="580" y="260" width="34" height="95" rx="10" fill="#EF4444" />
      </g>
    </svg>
  );
}

function TradingFeatureCard({
  title,
  desc,
  dotIndex,
}: {
  title: string;
  desc: string;
  dotIndex: number;
}) {
  const variant = dotIndex % 4;
  // Subtle finance-style patterns (avoid "busy" looks)
  const patternA =
    "bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px]";
  const patternB =
    "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_16px)]";
  const patternC =
    "bg-[radial-gradient(1.2px_1.2px_at_10%_20%,rgba(255,255,255,0.10),transparent_55%),radial-gradient(1.2px_1.2px_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(1.2px_1.2px_at_35%_78%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(1.2px_1.2px_at_70%_82%,rgba(255,255,255,0.06),transparent_55%)]";
  const patternD =
    "bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_8px)]";

  const patternClass =
    variant === 0 ? patternA : variant === 1 ? patternB : variant === 2 ? patternC : patternD;

  const gradClass =
    variant === 0
      ? "bg-[radial-gradient(900px_520px_at_18%_30%,rgba(34,197,94,0.22),transparent_62%),radial-gradient(820px_560px_at_86%_78%,rgba(239,68,68,0.18),transparent_64%),linear-gradient(135deg,rgba(34,197,94,0.10),rgba(0,0,0,0.55)_52%,rgba(239,68,68,0.08)),linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0.68))]"
      : variant === 1
        ? "bg-[radial-gradient(900px_520px_at_22%_70%,rgba(239,68,68,0.22),transparent_62%),radial-gradient(820px_560px_at_82%_22%,rgba(34,197,94,0.18),transparent_64%),linear-gradient(135deg,rgba(239,68,68,0.10),rgba(0,0,0,0.55)_52%,rgba(34,197,94,0.08)),linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0.68))]"
        : variant === 2
          ? "bg-[radial-gradient(900px_520px_at_65%_28%,rgba(34,197,94,0.18),transparent_62%),radial-gradient(820px_560px_at_28%_80%,rgba(239,68,68,0.18),transparent_64%),linear-gradient(135deg,rgba(34,197,94,0.08),rgba(0,0,0,0.58)_52%,rgba(239,68,68,0.06)),linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0.70))]"
          : "bg-[radial-gradient(900px_520px_at_50%_18%,rgba(239,68,68,0.18),transparent_62%),radial-gradient(820px_560px_at_50%_86%,rgba(34,197,94,0.16),transparent_64%),linear-gradient(135deg,rgba(239,68,68,0.08),rgba(0,0,0,0.58)_52%,rgba(34,197,94,0.06)),linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0.70))]";

  const barsClass =
    variant === 0
      ? "scale-[1.02]"
      : variant === 1
        ? "scale-[1.05]"
        : variant === 2
          ? "scale-[1.03]"
          : "scale-[1.08]";

  return (
    <div className={cn(tradingCardShell, cardHoverShell, "text-left")}>
      {/* Background: dot grid + vignette (like reference) */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0 opacity-18",
          patternClass,
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          gradClass,
        )}
      />

      {/* Card background: red/green bars animation (behind content) */}
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-70">
        <RedGreenBars className={cn("absolute inset-0 h-full w-full", barsClass)} />
        {/* Fade so text stays readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(900px_520px_at_75%_40%,rgba(0,0,0,0.10),rgba(0,0,0,0.65)_60%,rgba(0,0,0,0.78)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.55)_48%,rgba(0,0,0,0.28)_100%)]"
        />
      </div>

      <div className="relative z-10">
        <div className="relative p-6 sm:p-7">
          {/* Left content glass panel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.66),rgba(0,0,0,0.36))]"
          />
          <div className="flex items-start gap-5">
            <div
              className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/[0.10] ring-1 ring-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur"
              aria-hidden="true"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(18px_18px_at_30%_28%,rgba(255,255,255,0.30),transparent_60%),radial-gradient(26px_26px_at_72%_76%,rgba(84,168,230,0.30),transparent_62%)] opacity-90"
              />
              <Check className="relative h-5 w-5 text-white" strokeWidth={2.6} />
            </div>

            <div className="relative min-w-0 flex-1">
              <h3 className="text-xl font-semibold leading-tight tracking-tight text-white">
                {title}
              </h3>
              <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-white/70">
                {desc}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/80">
                Learn more <span aria-hidden="true">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const chromeTitle =
    "bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,color-mix(in_oklab,var(--brand-400)_78%,white)_22%,rgba(255,255,255,0.85)_46%,color-mix(in_oklab,var(--brand-700)_62%,white)_72%,rgba(255,255,255,0.90)_100%)] bg-clip-text text-transparent [text-shadow:0_0_22px_color-mix(in_oklab,var(--brand-400)_22%,transparent)]";
  const chromeDesc =
    "bg-[linear-gradient(135deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.55)_40%,color-mix(in_oklab,var(--brand-400)_45%,white)_100%)] bg-clip-text text-transparent opacity-80";

  return (
    <div className="relative min-h-dvh bg-black text-white">
      <FloatingCoinsBackground />
      <div className="relative z-10">
        <HeroIntro showHeader={false} />

        <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(700px_180px_at_50%_0%,rgba(84,168,230,0.18),transparent_70%)]" />

        <section id="mission" className="relative isolate w-full bg-black">
          {/* Full-bleed background behind the section */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-100 [background-image:radial-gradient(1100px_520px_at_18%_42%,color-mix(in_oklab,var(--brand-400)_32%,transparent),transparent_62%),radial-gradient(1100px_620px_at_82%_64%,color-mix(in_oklab,var(--brand-700)_26%,transparent),transparent_68%),radial-gradient(900px_460px_at_55%_18%,color-mix(in_oklab,var(--brand-600)_18%,transparent),transparent_62%)] blur-2xl" />
          <FloatingCoinsBackground
            className="z-[2] opacity-100"
            count={10}
            showGradient={false}
            opacityMin={0.28}
            opacityMax={0.55}
          />
          <div className="pointer-events-none absolute inset-0 z-[1] opacity-18">
            <DotGrid
              dotSize={2}
              gap={14}
              baseColor="#5e73b8"
              activeColor="#7fcfff"
              proximity={110}
              shockRadius={260}
              shockStrength={3}
              resistance={500}
              returnDuration={1.9}
            />
          </div>

          <div className="relative z-10 mx-auto w-[97%] max-w-none px-4 py-[200px] sm:w-[85%] sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <StarBorder
                as="div"
                color="color-mix(in oklab, var(--brand-400) 85%, white)"
                speed="6s"
                thickness={2}
                className="inline-block"
              >
                Our mission
              </StarBorder>
              <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3">
                <h2
                  className={`text-3xl font-semibold tracking-tight sm:text-4xl ${chromeTitle}`}
                >
                  Our Mission
                </h2>
              </div>
              <p
                className={`mx-auto mt-4 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7 ${chromeDesc}`}
              >
                Clearer, safer, more practical forex education—for serious learners.
              </p>
            </Reveal>

            <div className="mx-auto mt-12 max-w-5xl">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                    English
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Dignity Trading Academy exists to make forex education clearer,
                    safer, and more practical for serious learners.
                  </h3>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                    <p>
                      We help traders move away from hype, guessing, and emotional
                      decision-making by teaching a structured process built on risk
                      management, discipline, and continuous improvement.
                    </p>
                    <p>
                      Our goal is not to promise quick profits. Our goal is to help
                      students understand how trading works, protect their capital,
                      develop patience, and build the skills needed to trade with
                      confidence and responsibility.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur sm:p-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-0 z-0 h-40 w-72 sm:h-44 sm:w-80"
                  >
                    <Image
                      src={CHART_PREVIEW}
                      alt=""
                      fill
                      className="object-contain object-bottom-right opacity-100 drop-shadow-[0_22px_55px_rgba(0,0,0,0.65)] [filter:saturate(1.08)_contrast(1.05)]"
                      sizes="256px"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(520px_320px_at_100%_100%,rgba(0,0,0,0.02),rgba(0,0,0,0.58)_60%,rgba(0,0,0,0.72)_100%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[1] rounded-3xl [background-image:radial-gradient(520px_280px_at_20%_18%,rgba(84,168,230,0.18),transparent_62%),radial-gradient(520px_280px_at_84%_78%,rgba(255,190,55,0.10),transparent_66%)]"
                  />
                  <div className="relative z-[2]">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                      မြန်မာ
                    </p>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                      <p>
                        Dignity Trading Academy ၏ ရည်မှန်းချက်မှာ Forex Edcuation ကို
                        နားလည်လွယ်ကူစေပြီး၊ ပိုမိုလုံခြုံစွာ လေ့လာနိုင်စေကာ၊
                        စိတ်အားထက်သန်ပြီး အမှန်တကယ် သင်ယူလိုသူများအတွက်
                        လက်တွေ့အသုံးချနိုင်သော ပညာရေးအဖြစ် ပံ့ပိုးပေးရန်ဖြစ်ပါတယ်။
                      </p>
                      <p>
                        မြန်မာပြည်သား Trader များအတွက် hype, ခန့်မှန်းချက်များနှင့်
                        စိတ်ခံစားမှုအပေါ်မူတည်သော ဆုံးဖြတ်ချက်များမှ ဝေးကွာစေပြီး၊
                        Risk Management, Discipline နှင့် Continuous Improvement
                        တို့အပေါ် အခြေခံထားသော စနစ်တကျရှိသည့် rules-based trading
                        process ကို သင်ကြားပေးမှာဖြစ်ပါတယ်။
                      </p>
                      <p>
                        Dignity Trading Academy ၏ ရည်ရွယ်ချက်မှာ Trading ဘယ်လိုအလုပ်လုပ်သည်ကို
                        နားလည်စေခြင်း၊ မိမိ၏ capital ကို ကာကွယ်တတ်စေခြင်း၊
                        စိတ်ရှည်မှုကို တည်ဆောက်စေခြင်းနှင့် ယုံကြည်မှု၊ တာဝန်ယူမှုတို့ဖြင့်
                        trade လုပ်နိုင်ရန် လိုအပ်သော skill များကို တည်ဆောက်ပေးရန်ဖြစ်ပါတယ်။
                        သို့မှသာအောင်မြင်သော Trader ဖြစ်ဖို့အတွက်လမ်းကြောင်းပေါ်သို့ရောက်ရှိမှာဖြစ်ပါတယ်။
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-5xl">
              <div
                aria-hidden="true"
                className="h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent"
              />
              <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                    1. Your Skill, Our Focus
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Become more than someone who follows signals.
                  </h3>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                    <p>
                      At Dignity Trading Academy, our focus is to help you become more
                      than someone who simply follows signals. We aim to help you become
                      a trader who can understand the market, make informed decisions,
                      and follow a structured trading process with confidence.
                    </p>
                    <p>
                      We help you develop the core skills every trader needs, including
                      market structure, risk control, trade planning, execution, and
                      emotional discipline. These skills are the foundation of responsible
                      trading and long-term improvement.
                    </p>
                    <p>
                      Successful trading is not only about having a strategy. It is also
                      about knowing when to trade, when to wait, how to manage risk, and
                      how to protect your capital when the market does not go as expected.
                    </p>
                    <p>
                      Our teaching approach is built around a rules-based process, not hype,
                      guessing, or blind signal-following. We guide students to plan each
                      trade with a clear reason, manage risk carefully, and make decisions
                      with discipline instead of emotion.
                    </p>
                    <p>
                      Our goal is not to promise quick profits. Our goal is to help you build
                      the skill, discipline, and confidence needed to grow as a responsible trader.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur sm:p-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-0 z-0 h-40 w-72 sm:h-44 sm:w-80"
                  >
                    <Image
                      src={CHART_PREVIEW}
                      alt=""
                      fill
                      className="object-contain object-bottom-right opacity-100 drop-shadow-[0_22px_55px_rgba(0,0,0,0.65)] [filter:saturate(1.08)_contrast(1.05)]"
                      sizes="256px"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(520px_320px_at_100%_100%,rgba(0,0,0,0.02),rgba(0,0,0,0.58)_60%,rgba(0,0,0,0.72)_100%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[1] rounded-3xl [background-image:radial-gradient(520px_280px_at_18%_18%,rgba(84,168,230,0.16),transparent_62%),radial-gradient(520px_280px_at_84%_78%,rgba(255,190,55,0.10),transparent_66%)]"
                  />
                  <div className="relative z-[2]">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                      မြန်မာ
                    </p>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                      <p>
                        Dignity Trading Academy ၏ အဓိကရည်ရွယ်ချက်မှာ သင့်ကို signal များကိုသာ လိုက်နာသူတစ်ဦးအဖြစ်
                        မဟုတ်ဘဲ၊ Market ကို ကိုယ်တိုင်နားလည်နိုင်ပြီး၊ စနစ်တကျဆုံးဖြတ်နိုင်သော trader တစ်ဦးအဖြစ်
                        တိုးတက်လာစေရန် ကူညီပေးခြင်းဖြစ်ပါတယ်။
                      </p>
                      <p>
                        Trader တစ်ဦးအတွက် မရှိမဖြစ်လိုအပ်သော အဓိက skill များကို တည်ဆောက်နိုင်ရန် ကူညီပေးကာ
                        Market Structure နားလည်ခြင်း၊ Risk Control ပြုလုပ်ခြင်း၊ Trade Plan ရေးဆွဲခြင်း၊
                        Entry/Exit ကို စနစ်တကျလုပ်ဆောင်ခြင်း နှင့် စိတ်ခံစားမှုကို ထိန်းချုပ်နိုင်ခြင်း တို့ ပါဝင်ပါတယ်။
                      </p>
                      <p>
                        အောင်မြင်သော trading သည် strategy တစ်ခုရှိခြင်းတစ်ခုတည်း နဲ့မပြည့်စုံပါ။
                        မည်သည့်အချိန်တွင် trade ဝင်သင့်သလဲ၊ မည်သည့်အချိန်တွင် စောင့်သင့်သလဲ၊ risk ကို ဘယ်လိုစီမံခန့်ခွဲရမလဲ၊
                        market သည် မိမိမျှော်လင့်ထားသည့်အတိုင်း မသွားသောအခါ capital ကို ဘယ်လိုကာကွယ်ရမလဲ ဆိုသည်များကို
                        နားလည်ရန်လည်း အရေးကြီးပါတ​ယ်။
                      </p>
                      <p>
                        Dignity Trading Academy ၏သင်ကြားမှုပုံစံသည် rules-based process အပေါ် အခြေခံထားပြီး၊
                        hype, ခန့်မှန်းချက်များ သို့မဟုတ် blind signal-following များအပေါ် မမှီခိုပါ။
                        လေ့လာသူများအား trade တစ်ခုချင်းစီကို အကြောင်းပြချက်ရှိစွာ စီစဉ်နိုင်ရန်၊ risk ကို သေချာစွာထိန်းချုပ်နိုင်ရန်နှင့်
                        စိတ်ခံစားမှုထက် စည်းကမ်းရှိသောဆုံးဖြတ်ချက်များ ချနိုင်ရန် လမ်းညွှန်ပေးပါတယ်။
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div
                  aria-hidden="true"
                  className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                      2. Clear Learning Roadmap
                    </p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
                      A step-by-step path—so learning never feels confusing.
                    </h3>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                      <p>
                        At Dignity Trading Academy, we believe that learning forex should
                        not feel confusing, random, or overwhelming. Many beginners
                        struggle because they do not know what to learn first, what to
                        practice next, or how to measure their progress.
                      </p>
                      <p>
                        That is why we provide a clear, step-by-step learning roadmap
                        designed to guide students from the basics of forex trading to more
                        advanced trading concepts. Each stage is structured to help you
                        build knowledge, practice the right skills, and grow with confidence.
                      </p>
                      <p>
                        Our roadmap begins with the foundations, such as understanding
                        currency pairs, market sessions, pips, leverage, risk, and basic
                        chart reading. From there, students progress into market structure,
                        technical analysis, trade planning, risk management, execution, and
                        trading psychology.
                      </p>
                      <p>
                        Instead of jumping from one strategy to another, our learning path
                        helps you focus on one stage at a time. This allows you to build a
                        strong foundation before moving to advanced topics. With a clear
                        roadmap, you know exactly where you are, what you are learning, and
                        what your next step should be.
                      </p>
                      <p>
                        Our goal is to help students learn with direction, structure, and
                        confidence, so they can avoid confusion and develop better trading
                        habits over time.
                      </p>
                      <div className="pt-1 text-sm font-medium text-white/80">
                        Learn more <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur sm:p-7">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 right-0 z-0 h-40 w-72 sm:h-44 sm:w-80"
                    >
                      <Image
                        src={CHART_PREVIEW}
                        alt=""
                        fill
                        className="object-contain object-bottom-right opacity-100 drop-shadow-[0_22px_55px_rgba(0,0,0,0.65)] [filter:saturate(1.08)_contrast(1.05)]"
                        sizes="256px"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(520px_320px_at_100%_100%,rgba(0,0,0,0.02),rgba(0,0,0,0.58)_60%,rgba(0,0,0,0.72)_100%)]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-[1] rounded-3xl [background-image:radial-gradient(520px_280px_at_18%_18%,rgba(84,168,230,0.16),transparent_62%),radial-gradient(520px_280px_at_84%_78%,rgba(255,190,55,0.10),transparent_66%)]"
                    />
                    <div className="relative z-[2]">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                        မြန်မာ
                      </p>
                      <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                        <p>
                          Dignity Trading Academy တွင် ကျွန်ုပ်တို့ယုံကြည်ထားသည်မှာ Forex ကို သင်ယူခြင်းသည်
                          ရှုပ်ထွေးခြင်း၊ အစီအစဉ်မရှိခြင်း သို့မဟုတ် စိတ်ဖိစီးစေခြင်း မဖြစ်သင့်ပါ။
                          Beginner အများစုသည် ဘာကိုအရင်သင်ရမလဲ၊ ဘာကိုနောက်တစ်ဆင့် လေ့ကျင့်ရမလဲ၊
                          မိမိတိုးတက်မှုကို ဘယ်လိုတိုင်းတာရမလဲ ဆိုသည်ကို မသိသောကြောင့် အခက်အခဲတွေ့တတ်ကြပါတယ်။
                        </p>
                        <p>
                          ထို့ကြောင့်လေ့လာသူများအား Forex Trading ၏ အခြေခံမှ စတင်၍ ပိုမိုအဆင့်မြင့်သော trading concept
                          များအထိ လမ်းညွှန်ပေးနိုင်ရန် step-by-step learning roadmap တစ်ခုကို ပံ့ပိုးပေးပါသည်။
                          အဆင့်တိုင်းကို knowledge တည်ဆောက်ရန်၊ မှန်ကန်သော skill များကို လေ့ကျင့်ရန်နှင့်
                          ယုံကြည်မှုဖြင့် တိုးတက်လာစေရန် စနစ်တကျ ဖွဲ့စည်းထားပါသည်။
                        </p>
                        <p>
                          သင်ရိုး roadmap သည် currency pairs, market sessions, pips, leverage, risk နှင့် basic chart reading
                          ကဲ့သို့သော အခြေခံများမှ စတင်ပါတယ်။ ထို့နောက် market structure, technical analysis, trade planning,
                          risk management, execution နှင့် trading psychology စသည့် အဆင့်များသို့ ဆက်လက်သင်ကြားပေးမှာဖြစ်ပါတယ်။
                        </p>
                        <p>
                          Strategy တစ်ခုမှ တစ်ခုသို့ အစီအစဉ်မရှိဘဲ ပြောင်းလဲလေ့လာခြင်းအစား၊ learning path သည်
                          အဆင့်တစ်ခုချင်းစီကို သေချာနားလည်ပြီးမှ နောက်အဆင့်သို့ တက်နိုင်ရန် ကူညီပေးပါလိမ့်မယ်။
                          ထိုကြောင့် advanced topic များသို့ မသွားမီ အခြေခံအားကောင်းသော foundation တစ်ခုကို တည်ဆောက်နိုင်ပါတယ်။
                        </p>
                        <p>
                          ရှင်းလင်းသော roadmap ရှိခြင်းကြောင့် လေ့လာသင်ယူသူအနေနဲ့ မိမိလက်ရှိဘယ်အဆင့်တွင်ရှိနေသည်၊
                          ဘာကိုလေ့လာနေသည်၊ နောက်တစ်ဆင့် ဘာလုပ်ရမည်ဆိုသည်ကို ရှင်းရှင်းလင်းလင်း သိနိုင်ပါတယ်။
                        </p>
                        <p>
                          ကျွန်ုပ်တို့၏ ရည်ရွယ်ချက်မှာ ကျောင်းသားများအား direction, structure နှင့် confidence ဖြင့် သင်ယူနိုင်စေပြီး၊
                          ရှုပ်ထွေးမှုများကို လျှော့ချကာ အချိန်ကြာလာသည်နှင့်အမျှ ပိုမိုကောင်းမွန်သော trading habit များ
                          တည်ဆောက်နိုင်စေရန် ကူညီပေးနိုင်ဖို့ရန်အတွက်ဖြစ်ပါတယ်။
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div
                  aria-hidden="true"
                  className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                      3. Support &amp; Accountability
                    </p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
                      Learn consistently—with guidance, feedback, and community.
                    </h3>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                      <p>
                        At Dignity Trading Academy, we understand that learning trading is
                        not only about watching lessons or memorizing strategies. Real
                        growth happens when students practice consistently, review their
                        mistakes, ask questions, and stay disciplined through the learning
                        process.
                      </p>
                      <p>
                        Trading can feel challenging when you are learning alone. Many
                        traders lose direction because they do not have proper guidance,
                        feedback, or accountability. That is why we provide support to
                        help students stay focused, avoid common beginner mistakes, and
                        continue improving step by step.
                      </p>
                      <p>
                        Through coaching, trade reviews, learning guidance, and community
                        support, we help students understand what they are doing well and
                        what needs improvement. This allows students to build better
                        habits, manage emotions, and make more structured trading
                        decisions.
                      </p>
                      <p>
                        Our goal is to create a supportive learning environment where
                        students do not feel alone in their trading journey. With the
                        right guidance and accountability, traders can stay consistent,
                        learn from their mistakes, and develop the discipline needed for
                        long-term growth.
                      </p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur sm:p-7">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 right-0 z-0 h-40 w-72 sm:h-44 sm:w-80"
                    >
                      <Image
                        src={CHART_PREVIEW}
                        alt=""
                        fill
                        className="object-contain object-bottom-right opacity-100 drop-shadow-[0_22px_55px_rgba(0,0,0,0.65)] [filter:saturate(1.08)_contrast(1.05)]"
                        sizes="256px"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(520px_320px_at_100%_100%,rgba(0,0,0,0.02),rgba(0,0,0,0.58)_60%,rgba(0,0,0,0.72)_100%)]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-[1] rounded-3xl [background-image:radial-gradient(520px_280px_at_18%_18%,rgba(84,168,230,0.16),transparent_62%),radial-gradient(520px_280px_at_84%_78%,rgba(255,190,55,0.10),transparent_66%)]"
                    />
                    <div className="relative z-[2]">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                        မြန်မာ
                      </p>
                      <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                        <p>
                          Dignity Trading Academy တွင် Trading ကို လေ့လာသင်ယူခြင်းဆိုတာ lesson များကိုကြည့်ခြင်း
                          သို့မဟုတ် strategy များကို မှတ်သားခြင်းတစ်ခုတည်းမဟုတ်ပါ။ တကယ့်တိုးတက်မှုဟာ
                          အဆက်မပြတ် လေ့ကျင့်ခြင်း၊ မိမိအမှားများကို ပြန်လည်သုံးသပ်ခြင်း၊ မေးခွန်းများမေးခြင်းနှင့်
                          သင်ယူမှုလုပ်ငန်းစဉ်တစ်လျှောက် စည်းကမ်းရှိစွာ လိုက်နာခြင်းမှ ဖြစ်ပေါ်လာခြင်းဖြစ်ပါတယ်။
                        </p>
                        <p>
                          တစ်ဦးတည်း Trading သင်ယူသည့်အခါ အခက်အခဲများနှင့် ရှုပ်ထွေးမှုများ ကြုံတွေ့နိုင်ပါတယ်။
                          Trader အများစုသည် မှန်ကန်သော လမ်းညွှန်မှု၊ feedback နှင့် accountability မရှိသောကြောင့်
                          လမ်းကြောင်းပျောက်တတ်ကြပါတယ်။ ဒါကြောင့် beginner mistake များကို ရှောင်ရှားနိုင်ရန်နှင့်
                          အဆင့်လိုက် ဆက်လက်တိုးတက်နိုင်ရန် ပံ့ပိုးကူညီပေးမှာဖြစ်ပါတယ်။
                        </p>
                        <p>
                          Coaching, trade reviews, learning guidance နှင့် community support များမှတစ်ဆင့်
                          လေ့လာသင်ယူသူများဟာ မိမိလုပ်ဆောင်နေသည့်အရာများထဲမှ ဘယ်အရာကတိုးတတ်မှုရှိလဲ
                          ဘယ်အရာကိုပြင်ဆင်တိုးတက်ရန်လိုလာမလဲဆိုတာကို ပိုမိုနားလည်လာနိုင်ပါတယ်။ ဒါကြောင့်
                          ပိုမိုကောင်းမွန်သော habit များ တည်ဆောက်နိုင်ပြီး၊ စိတ်ခံစားမှုကို ထိန်းချုပ်နိုင်ကာ
                          စနစ်တကျသော trading decision များ ချမှတ်လာနိုင်မှာဖြစ်ပါတယ်။
                        </p>
                        <p>
                          Dignity Trading Academy ၏ရည်ရွယ်ချက်မှာ လေ့လာသင်ယူသူများအနေနဲ့ မိမိရဲ့ trading journey တွင်
                          တစ်ဦးတည်းမဟုတ်ကြောင်း ခံစားနိုင်စေရန် supportive learning environment တစ်ခု ဖန်တီးပေးရန်ဖြစ်ပါတယ်။
                          မှန်ကန်သော guidance နှင့် accountability ရှိပါက trader များသည် consistency ထိန်းနိုင်ပြီး၊
                          အမှားများမှ သင်ယူနိုင်ကာ long-term growth အတွက် လိုအပ်သော discipline ကို တည်ဆောက်နိုင်မှာဖြစ်ပါတယ်။
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smooth fade into next section */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-44 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_52%,rgba(0,0,0,1)_100%)]" />
        </section>

        {/* Transition band (Mission -> Learn) */}
        <div
          aria-hidden="true"
          className="-mt-10 h-28 w-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,1)_100%)]"
        />

        <section
          id="learn"
          className="relative isolate w-full"
        >
          <div className="pointer-events-none absolute inset-0 z-0 opacity-100 [background-image:radial-gradient(1100px_520px_at_22%_18%,color-mix(in_oklab,var(--brand-400)_26%,transparent),transparent_64%),radial-gradient(1100px_620px_at_78%_72%,color-mix(in_oklab,var(--brand-700)_22%,transparent),transparent_70%),radial-gradient(900px_460px_at_55%_40%,color-mix(in_oklab,var(--brand-600)_14%,transparent),transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-56 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.65)_32%,rgba(0,0,0,0.18)_72%,rgba(0,0,0,0)_100%)] opacity-60" />

          <div className="relative z-10 mx-auto w-[97%] max-w-none px-4 py-[200px] sm:w-[85%] sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <StarBorder
                as="div"
                color="color-mix(in oklab, var(--brand-400) 85%, white)"
                speed="6s"
                thickness={2}
                className="inline-block"
              >
                What students will learn
              </StarBorder>
              <h2
                className={`mt-4 text-3xl font-semibold tracking-tight sm:text-4xl ${chromeTitle}`}
              >
                A step-by-step system you can repeat.
              </h2>
              <p
                className={`mx-auto mt-4 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7 ${chromeDesc}`}
              >
                A strategy is only as good as your execution. This roadmap is built
                to take you from fundamentals to confident, repeatable practice.
              </p>
            </Reveal>

            <StaggerIn className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Risk management",
                  desc: "Position sizing, daily limits, R:R thinking, drawdown control",
                },
                {
                  title: "Market structure",
                  desc: "Trend, ranges, liquidity, key levels, and context",
                },
                {
                  title: "Setup + checklist",
                  desc: "A simple repeatable checklist for entries & exits",
                },
                {
                  title: "Trade management",
                  desc: "Partial, stop placement, invalidation, and journaling",
                },
                {
                  title: "Psychology & habits",
                  desc: "Consistency, discipline, and avoiding revenge trading",
                },
                {
                  title: "Execution practice",
                  desc: "Backtesting workflow + replay sessions + review routine",
                },
              ].map((card, idx) => (
                <FadeUpItem key={card.title}>
                  <TradingFeatureCard
                    title={card.title}
                    desc={card.desc}
                    dotIndex={idx}
                  />
                </FadeUpItem>
              ))}
            </StaggerIn>
          </div>
        </section>
        </main>
      </div>
    </div>
  );
}
