import HeroIntro from "./components/HeroIntro";
import StarBorder from "./components/StarBorder";
import DotGrid from "./components/DotGrid";
import Aurora from "./components/Aurora";
import Reveal from "./components/Reveal";
import StaggerIn, { FadeUpItem } from "./components/StaggerIn";

export default function Home() {
  const cardBase =
    "relative overflow-hidden rounded-3xl bg-white/[0.045] ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur";
  const cardGlow =
    "before:pointer-events-none before:absolute before:inset-0 before:opacity-95 before:[background-image:radial-gradient(520px_320px_at_16%_8%,rgba(255,190,55,0.22),transparent_62%),radial-gradient(640px_380px_at_82%_92%,rgba(84,168,230,0.18),transparent_64%)] after:pointer-events-none after:absolute after:inset-0 after:opacity-60 after:[background-image:linear-gradient(to_bottom,rgba(255,255,255,0.10),rgba(255,255,255,0.03)_18%,transparent_52%)]";
  const cardReflect =
    "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.55)] before:[mask-image:radial-gradient(140%_90%_at_50%_0%,black_40%,transparent_72%)] after:[mask-image:linear-gradient(to_bottom,black_0%,black_28%,transparent_64%)]";
  const cardHover =
    "transition will-change-transform hover:-translate-y-0.5 hover:ring-white/20";
  const cardAuroraWrap =
    "pointer-events-none absolute inset-0 z-0 opacity-65 mix-blend-screen blur-[1px]";
  const cardPattern =
    "pointer-events-none absolute inset-0 z-[1] opacity-40 mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10),transparent_55%)] [background-size:18px_18px,100%_100%] [mask-image:radial-gradient(110%_85%_at_50%_0%,black_35%,transparent_75%)]";
  const iconBadge =
    "grid h-11 w-11 shrink-0 aspect-square place-items-center overflow-hidden rounded-full bg-black/40 ring-1 ring-white/12 shadow-[0_18px_40px_rgba(0,0,0,0.45)]";
  const chromeTitle =
    "bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,color-mix(in_oklab,var(--brand-400)_78%,white)_22%,rgba(255,255,255,0.85)_46%,color-mix(in_oklab,var(--brand-700)_62%,white)_72%,rgba(255,255,255,0.90)_100%)] bg-clip-text text-transparent [text-shadow:0_0_22px_color-mix(in_oklab,var(--brand-400)_22%,transparent)]";
  const chromeDesc =
    "bg-[linear-gradient(135deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.55)_40%,color-mix(in_oklab,var(--brand-400)_45%,white)_100%)] bg-clip-text text-transparent opacity-80";

  const auroraVariants: Array<[string, string, string]> = [
    ["#54a8e6", "#2f66d4", "#243b9c"], // primary blue
    ["#54a8e6", "#ff3232", "#2f66d4"], // blue + red
    ["#54a8e6", "#ffbe37", "#2f66d4"], // blue + yellow
    ["#54a8e6", "#7cff67", "#2f66d4"], // blue + green
    ["#ff3232", "#ffbe37", "#54a8e6"], // red + yellow + blue
    ["#7cff67", "#54a8e6", "#ff3232"], // green + blue + red
  ];

  return (
    <div className="min-h-dvh bg-black text-white">
      <HeroIntro />

      <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(700px_180px_at_50%_0%,rgba(84,168,230,0.18),transparent_70%)]" />

        <section id="mission" className="relative isolate w-full bg-black">
          {/* Full-bleed background behind the section */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-100 [background-image:radial-gradient(1100px_520px_at_18%_42%,color-mix(in_oklab,var(--brand-400)_32%,transparent),transparent_62%),radial-gradient(1100px_620px_at_82%_64%,color-mix(in_oklab,var(--brand-700)_26%,transparent),transparent_68%),radial-gradient(900px_460px_at_55%_18%,color-mix(in_oklab,var(--brand-600)_18%,transparent),transparent_62%)] blur-2xl" />
          <div className="pointer-events-none absolute inset-0 z-0 opacity-18">
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

          <div className="relative z-10 mx-auto w-[95%] max-w-none px-4 py-[200px] sm:px-6 lg:px-8">
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
              <h2
                className={`mt-4 text-3xl font-semibold tracking-tight sm:text-4xl ${chromeTitle}`}
              >
                Why trade with Dignity Trading?
              </h2>
              <p
                className={`mx-auto mt-4 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7 ${chromeDesc}`}
              >
                We teach a rules-first, repeatable process—so you can practice with
                clarity, manage risk, and build consistency over time.
              </p>
            </Reveal>

            <StaggerIn className="mt-12 grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Your skill, our focus",
                  desc: "Learn a structured process without hype—risk, context, and execution.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/80">
                      <path
                        fill="currentColor"
                        d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 15-4-4 1.4-1.4L11 14.2l5.6-5.6L18 10l-7 7Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Fast, clear roadmap",
                  desc: "A step-by-step plan to build fundamentals, then sharpen execution.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/80">
                      <path
                        fill="currentColor"
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-9 14H7v-2h3v2Zm0-4H7v-2h3v2Zm0-4H7V7h3v2Zm7 8h-5V7h5v10Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Support & accountability",
                  desc: "Coaching, reviews, and community—so you stay consistent and improve.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/80">
                      <path
                        fill="currentColor"
                        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2-8 4.5V21h16v-2.5C20 16 16.42 14 12 14Z"
                      />
                    </svg>
                  ),
                },
              ].map((c, idx) => (
                <FadeUpItem key={c.title}>
                  <div
                    className={`${cardBase} ${cardGlow} ${cardReflect} ${cardHover} p-6`}
                  >
                    <div className={cardAuroraWrap} aria-hidden="true">
                      <Aurora
                        colorStops={auroraVariants[idx % auroraVariants.length]}
                      blend={0.58}
                      amplitude={1.1}
                        speed={1.25}
                      />
                    </div>
                    <div className={cardPattern} aria-hidden="true" />
                    <div className="relative flex items-start gap-3">
                      <div className={`${iconBadge} mt-0.5`} aria-hidden="true">
                        {c.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{c.title}</div>
                        <div className="mt-2 text-sm text-white/70">{c.desc}</div>
                        <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                          Learn more <span aria-hidden="true">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeUpItem>
              ))}
            </StaggerIn>
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

          <div className="relative z-10 mx-auto w-[95%] max-w-none px-4 py-[200px] sm:px-6 lg:px-8">
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
                  <div
                    className={`${cardBase} ${cardGlow} ${cardReflect} ${cardHover} p-6`}
                  >
                    <div className={cardAuroraWrap} aria-hidden="true">
                      <Aurora
                        colorStops={auroraVariants[idx % auroraVariants.length]}
                      blend={0.58}
                      amplitude={1.1}
                        speed={1.25}
                      />
                    </div>
                    <div className={cardPattern} aria-hidden="true" />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className={`${iconBadge} mt-0.5`} aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/80">
                          <path
                            fill="currentColor"
                            d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 14.5h-2v-2h2v2Zm0-4h-2V7.5h2v5Z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{card.title}</div>
                        <div className="mt-2 text-sm text-white/70">
                          {card.desc}
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                          Learn more
                          <span aria-hidden="true">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeUpItem>
              ))}
            </StaggerIn>
          </div>
        </section>
      </main>
    </div>
  );
}
