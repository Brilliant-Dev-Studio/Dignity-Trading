"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

const softEase = [0.22, 1, 0.36, 1] as const;

function pathMatches(pathname: string, basePath: string): boolean {
  if (basePath === "/") return pathname === "/";
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function queryMatches(required: string, currentSearch: string): boolean {
  if (!required) return true;
  const want = new URLSearchParams(required);
  const cur = new URLSearchParams(currentSearch.replace(/^\?/, ""));
  for (const [k, v] of want.entries()) {
    if (cur.get(k) !== v) return false;
  }
  return true;
}

/** pathname from Next, hash/search from window (fragments not in usePathname). */
function isHrefActive(href: string, pathname: string, hash: string, search: string): boolean {
  const hashPos = href.indexOf("#");
  const beforeHash = hashPos === -1 ? href : href.slice(0, hashPos);
  const wantedHash = hashPos === -1 ? "" : href.slice(hashPos);

  const qPos = beforeHash.indexOf("?");
  const path = (qPos === -1 ? beforeHash : beforeHash.slice(0, qPos)) || "/";
  const query = qPos === -1 ? "" : beforeHash.slice(qPos + 1);

  if (!pathMatches(pathname, path)) return false;
  if (!queryMatches(query, search)) return false;

  if (wantedHash) {
    return hash === wantedHash;
  }
  if (path === "/") {
    return !hash || hash === "#";
  }
  return true;
}

function isParentNavActive(
  item: { href: string; children: { href: string }[] },
  pathname: string,
  hash: string,
  search: string,
): boolean {
  if (isHrefActive(item.href, pathname, hash, search)) return true;
  return item.children.some((c) => isHrefActive(c.href, pathname, hash, search));
}

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  type NavItem =
    | { label: string; href: string }
    | {
        label: string;
        href: string;
        children: { label: string; href: string }[];
      };

  const menu: NavItem[] = useMemo(
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
      { label: "Market Analysis", href: "/resources" },
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
      { label: "Testimonial", href: "/testimonials" },
      { label: "Open Trading Account", href: "/open-trading-account" },
      { label: "Contact", href: "/contact" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
    [],
  );

  const pathname = usePathname();
  const [clientRoute, setClientRoute] = useState({ hash: "", search: "" });

  useLayoutEffect(() => {
    const sync = () => {
      setClientRoute({
        hash: window.location.hash,
        search: window.location.search,
      });
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname]);

  const deskBase =
    "relative inline-flex h-9 cursor-pointer items-center gap-0.5 rounded-full px-2 text-[11px] font-medium tracking-wide text-zinc-400 antialiased transition-[color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--brand-400)_45%,transparent)] focus-visible:ring-offset-0 whitespace-nowrap lg:px-2.5 lg:text-[12px] lg:leading-none";
  const deskOn =
    "bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";
  const deskOff = "hover:bg-white/[0.05] hover:text-zinc-100";

  const mobileRowBase =
    "group flex h-12 cursor-pointer items-center justify-between rounded-xl px-3 text-[15px] font-medium transition";
  const mobileRowOn = "bg-white/12 text-white ring-1 ring-white/15";
  const mobileRowOff = "text-white/85 hover:bg-white/10 hover:text-white";

  const mobileChildBase =
    "group ml-1 mr-1 flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition";
  const mobileChildOn = "bg-white/10 text-white";
  const mobileChildOff = "text-white/72 hover:bg-white/10 hover:text-white";

  const dropdownItemBase =
    "flex !cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[11px] font-medium tracking-wide transition";
  const dropdownItemOn = "bg-white/[0.08] text-white";
  const dropdownItemOff = "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100";

  return (
    <header
      className={[
        overlay ? "fixed left-0 right-0 top-0" : "sticky top-0",
        "z-[1400] w-full",
        isScrolled
          ? "border-b border-white/[0.05] bg-black/65 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.55)]"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto w-full max-w-none px-4 py-2.5 sm:w-[95%] sm:px-6 lg:px-8">
        <div className="grid h-10 grid-cols-[auto_1fr_auto] items-center gap-3 min-w-0 md:gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 justify-self-start shrink-0 cursor-pointer"
          >
            <div className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10">
              <Image
                src="/logo.png"
                alt="Dignity Trading"
                width={36}
                height={36}
                className="h-full w-full object-cover"
                priority={false}
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-white sm:text-[15px]">
                Dignity Trading
              </div>
            </div>
          </Link>

          <div className="hidden min-w-min justify-self-center lg:block">
            <div className="relative z-[1200] w-max shrink-0 overflow-visible rounded-full border border-white/[0.08] bg-zinc-950/55 p-0.5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl">
              <div className="flex h-9 w-max items-center gap-px overflow-visible rounded-full px-0.5">
                {menu.map((item) => {
                  if ("children" in item && item.children) {
                    return (
                    <div key={item.label} className="group relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu((cur) => (cur === item.label ? null : item.label))
                        }
                        aria-haspopup="menu"
                        aria-expanded={openMenu === item.label}
                        className={cn(
                          deskBase,
                          "shrink-0",
                          isParentNavActive(item, pathname, clientRoute.hash, clientRoute.search)
                            ? deskOn
                            : deskOff,
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={[
                            "h-3 w-3 shrink-0 opacity-50 transition-transform",
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
                          "absolute left-0 top-full z-[1100] min-w-52 overflow-hidden rounded-xl border border-white/[0.09] bg-zinc-950/95 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl",
                          "opacity-0 pointer-events-none translate-y-1 transition-[opacity,transform] duration-200",
                          "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-2",
                          openMenu === item.label
                            ? "opacity-100 pointer-events-auto translate-y-2"
                            : "",
                        ].join(" ")}
                      >
                        {item.children.map((child) => {
                          const childActive = isHrefActive(
                            child.href,
                            pathname,
                            clientRoute.hash,
                            clientRoute.search,
                          );
                          return (
                            <Link
                              key={child.label}
                              href={child.href}
                              role="menuitem"
                              aria-current={childActive ? "page" : undefined}
                              className={cn(
                                dropdownItemBase,
                                childActive ? dropdownItemOn : dropdownItemOff,
                              )}
                            >
                              <span>{child.label}</span>
                              <span className="text-[10px] text-white/35">↗</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    );
                  }
                  const leafActive = isHrefActive(
                    item.href,
                    pathname,
                    clientRoute.hash,
                    clientRoute.search,
                  );
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-current={leafActive ? "page" : undefined}
                      className={cn(deskBase, "shrink-0", leafActive ? deskOn : deskOff)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="justify-self-end shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 -mr-2 cursor-pointer items-center justify-center rounded-full border border-transparent text-zinc-300 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--brand-400)_40%,transparent)] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {mounted && mobileOpen
        ? createPortal(
            <div className="fixed inset-0 z-[2000] lg:hidden">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
              <div
                className="fixed right-0 top-0 bottom-0 w-[88%] max-w-[380px] border-l border-white/10 bg-black/85 shadow-[0_40px_120px_rgba(0,0,0,0.75)] backdrop-blur-xl"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile menu"
                style={{ transitionTimingFunction: `cubic-bezier(${softEase.join(",")})` }}
              >
                <div className="relative">
                  <div className="relative flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10">
                        <Image
                          src="/logo.png"
                          alt="Dignity Trading"
                          width={36}
                          height={36}
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
                        const leafActive = isHrefActive(
                          item.href,
                          pathname,
                          clientRoute.hash,
                          clientRoute.search,
                        );
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            aria-current={leafActive ? "page" : undefined}
                            className={cn(
                              mobileRowBase,
                              leafActive ? mobileRowOn : mobileRowOff,
                            )}
                          >
                            <span className="truncate">{item.label}</span>
                            <ChevronRight className="h-4 w-4 text-white/35 transition group-hover:text-white/60" />
                          </Link>
                        );
                      }

                      const isOpen = mobileOpenGroup === item.label;
                      const sectionActive = isParentNavActive(
                        item,
                        pathname,
                        clientRoute.hash,
                        clientRoute.search,
                      );
                      return (
                        <div key={item.label} className="rounded-xl">
                          <button
                            type="button"
                            onClick={() =>
                              setMobileOpenGroup((cur) => (cur === item.label ? null : item.label))
                            }
                            className={cn(
                              "flex h-12 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-[15px] font-semibold transition",
                              sectionActive ? mobileRowOn : "text-white/90 hover:bg-white/10",
                            )}
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
                              {item.children!.map((child) => {
                                const childActive = isHrefActive(
                                  child.href,
                                  pathname,
                                  clientRoute.hash,
                                  clientRoute.search,
                                );
                                return (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    aria-current={childActive ? "page" : undefined}
                                    className={cn(
                                      mobileChildBase,
                                      childActive ? mobileChildOn : mobileChildOff,
                                    )}
                                  >
                                    <span className="truncate">{child.label}</span>
                                    <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:text-white/55" />
                                  </Link>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}