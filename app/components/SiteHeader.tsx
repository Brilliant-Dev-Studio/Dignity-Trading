"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

const softEase = [0.22, 1, 0.36, 1] as const;

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const menu = useMemo(
    () => [
      { label: "Home", href: "/" },
      {
        label: "Mission",
        href: "/#mission",
        children: [
          { label: "Your skill our focus", href: "/#mission" },
          { label: "Fast Clear Road Map", href: "/#mission" },
          { label: "Support and Accountability", href: "/#mission" },
        ],
      },
      {
        label: "Trading Course",
        href: "/courses",
        children: [
          { label: "Free Forex Beginner Trading Course", href: "/learn-forex" },
          { label: "Free Intermediate Trading Course", href: "/courses?level=intermediate" },
          { label: "Professional Advance Trading Course", href: "/courses?level=advance" },
        ],
      },
      { label: "Market Anaylsis", href: "/resources" },
      {
        label: "Forex Tools",
        href: "/tools",
        children: [
          { label: "Economics Calendar", href: "/tools/economics-calendar" },
          { label: "Position Sizing Calculator", href: "/tools/position-sizing-calculator" },
          { label: "Pip Calculator", href: "/tools/pip-calculator" },
          { label: "Market Hours", href: "/tools/market-hours" },
          { label: "Charts", href: "/tools/charts" },
        ],
      },
      { label: "Blog", href: "/blog" },
      { label: "Testimonial", href: "/#testimonial" },
      { label: "Open Trading Account", href: "/#open-account" },
      { label: "Contact", href: "/contact" },
      { label: "Disclaimer", href: "/#disclaimer" },
    ],
    [],
  );

  return (
    <header
      className={[
        overlay ? "fixed left-0 right-0 top-0" : "sticky top-0",
        "z-[1400] w-full",
        isScrolled
          ? "border-b border-white/10 bg-black/65 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto w-full max-w-none px-4 py-3 sm:w-[95%] sm:px-6 lg:px-8">
        <div className="grid h-12 grid-cols-[auto_1fr_auto] items-center gap-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-3 justify-self-start shrink-0 cursor-pointer"
          >
            <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10 sm:h-9 sm:w-9">
              <Image
                src="/logo.png"
                alt="Dignity Trading"
                width={48}
                height={48}
                className="h-full w-full object-cover"
                priority={false}
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide sm:text-base text-white">
                Dignity Trading
              </div>
            </div>
          </Link>

          <div className="hidden justify-self-center md:block min-w-0">
            <div className="relative z-[1200] max-w-full overflow-visible rounded-full border border-white/12 bg-white/[0.05] shadow-sm backdrop-blur">
              <div className="flex h-12 items-center gap-2 rounded-full px-2 max-w-full overflow-visible">
                {menu.map((item) =>
                  "children" in item && item.children ? (
                    <div key={item.label} className="group relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu((cur) => (cur === item.label ? null : item.label))
                        }
                        aria-haspopup="menu"
                        aria-expanded={openMenu === item.label}
                        className="inline-flex h-12 cursor-pointer items-center gap-1.5 rounded-full px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 whitespace-nowrap"
                      >
                        {item.label}
                        <ChevronDown
                          className={[
                            "h-3.5 w-3.5 transition-transform",
                            openMenu === item.label
                              ? "rotate-180"
                              : "rotate-0 group-hover:rotate-180",
                          ].join(" ")}
                        />
                      </button>

                      <div aria-hidden="true" className="absolute left-0 top-full h-3 w-full" />

                      <div
                        role="menu"
                        className={[
                          "absolute left-0 top-full z-[1100] min-w-52 overflow-hidden rounded-xl border border-white/10 bg-black/80 p-1 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur-xl",
                          "opacity-0 pointer-events-none translate-y-1 transition-[opacity,transform] duration-200",
                          "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-2",
                          openMenu === item.label
                            ? "opacity-100 pointer-events-auto translate-y-2"
                            : "",
                        ].join(" ")}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            role="menuitem"
                            className="flex !cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[11px] font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                          >
                            <span>{child.label}</span>
                            <span className="text-[10px] text-white/35">↗</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="inline-flex h-12 cursor-pointer items-center rounded-full px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="justify-self-end shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-12 w-11 cursor-pointer items-center justify-center rounded-full bg-transparent text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[2000] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 h-full w-[88%] max-w-[380px] border-l border-white/10 bg-black/85 shadow-[0_40px_120px_rgba(0,0,0,0.75)] backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            style={{ transitionTimingFunction: `cubic-bezier(${softEase.join(",")})` }}
          >
            <div className="relative">
              <div className="relative flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10">
                    <Image
                      src="/logo.png"
                      alt="Dignity Trading"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      priority={false}
                    />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold tracking-wide text-white">
                      Dignity Trading
                    </div>
                    <div className="text-[11px] text-white/55">Menu</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/8 text-white/90 ring-1 ring-white/12 transition hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="h-[calc(100%-64px)] overflow-y-auto px-3 pb-6">
              <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
                {menu.map((item) => {
                  const hasChildren = "children" in item && item.children?.length;
                  if (!hasChildren) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="group flex h-12 cursor-pointer items-center justify-between rounded-xl px-3 text-[15px] font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                      >
                        <span className="truncate">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-white/35 transition group-hover:text-white/60" />
                      </Link>
                    );
                  }

                  const isOpen = mobileOpenGroup === item.label;
                  return (
                    <div key={item.label} className="rounded-xl">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileOpenGroup((cur) => (cur === item.label ? null : item.label))
                        }
                        className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-[15px] font-semibold text-white/90 transition hover:bg-white/10"
                        aria-expanded={isOpen}
                      >
                        <span className="truncate">{item.label}</span>
                        <ChevronDown
                          className={[
                            "h-4 w-4 transition-transform",
                            isOpen ? "rotate-180" : "rotate-0",
                          ].join(" ")}
                        />
                      </button>
                      {isOpen ? (
                        <div className="pb-2 pt-1">
                          {item.children!.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="group ml-1 mr-1 flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-white/72 transition hover:bg-white/10 hover:text-white"
                            >
                              <span className="truncate">{child.label}</span>
                              <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:text-white/55" />
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

