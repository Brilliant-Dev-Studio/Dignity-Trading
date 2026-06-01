"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Blog", href: "/admin/blogs", icon: FileText },
  { label: "Free Forex course", href: "/admin/courses/forex-free-beginner", icon: GraduationCap },
  {
    label: "Intermediate course",
    href: "/admin/courses/forex-free-intermediate",
    icon: Layers,
  },
  {
    label: "Professional Advance",
    href: "/admin/courses/professional-advance",
    icon: TrendingUp,
  },
  {
    label: "Market Analysis",
    href: "/admin/courses/market-analysis",
    icon: BarChart2,
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const SIDEBAR_COLLAPSED_KEY = "admin-sidebar-collapsed";
const SIDEBAR_COLLAPSED_EVENT = "admin-sidebar-collapsed-change";

function subscribeToSidebarCollapsed(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key === SIDEBAR_COLLAPSED_KEY) callback();
  };

  const onCustom = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener(SIDEBAR_COLLAPSED_EVENT, onCustom);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SIDEBAR_COLLAPSED_EVENT, onCustom);
  };
}

function getSidebarCollapsedSnapshot() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
}

function getSidebarCollapsedServerSnapshot() {
  return false;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(
    subscribeToSidebarCollapsed,
    getSidebarCollapsedSnapshot,
    getSidebarCollapsedServerSnapshot,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    const next = !getSidebarCollapsedSnapshot();
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
    window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_EVENT));
  }, []);

  // Close mobile drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <main className="min-h-dvh bg-zinc-50 text-zinc-950">
      <div
        className={cn(
          "grid min-h-dvh transition-[grid-template-columns]",
          "grid-cols-1",
          collapsed ? "lg:grid-cols-[84px_1fr]" : "lg:grid-cols-[260px_1fr]",
        )}
      >
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[1px] lg:hidden"
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform-gpu border-b border-white/10 bg-zinc-950 text-white shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            "lg:sticky lg:inset-auto lg:top-0 lg:z-auto lg:h-dvh lg:w-auto lg:max-w-none lg:translate-x-0 lg:border-b-0 lg:border-r lg:shadow-none",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(760px_420px_at_20%_20%,rgba(84,168,230,0.34),transparent_60%),radial-gradient(620px_360px_at_84%_76%,rgba(255,190,55,0.20),transparent_64%),linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.60))]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-28 [background-image:radial-gradient(rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:14px_14px]"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-30 hidden lg:block">
            <div className="pointer-events-auto absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={cn(
                  "group inline-flex h-12 w-7 items-center justify-center",
                  "rounded-full border border-white/35 bg-white/55 shadow-sm backdrop-blur",
                  "text-zinc-800 transition-colors hover:bg-white/80",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/15 focus-visible:ring-offset-2",
                )}
              >
                <span className="sr-only">
                  {collapsed ? "Expand sidebar" : "Collapse sidebar"}
                </span>
                {collapsed ? (
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                ) : (
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                )}
              </button>
            </div>
          </div>
          <div className="relative z-10 flex h-full flex-col overflow-hidden">
            <div
              className={cn(
                "flex min-h-24 items-center border-b border-white/10 px-5 py-5",
                collapsed ? "lg:justify-center" : "justify-between gap-3",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Dignity Trading logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                  priority
                />
                {!collapsed ? (
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      Dignity Trading
                    </div>
                    <div className="text-xs text-white/55">Admin Panel</div>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/15 lg:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors",
                      "hover:bg-white/10 hover:text-white",
                      isActive &&
                        "bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm",
                      collapsed && "lg:justify-center",
                    )}
                    title={item.label}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed ? <span>{item.label}</span> : (
                      <span className="lg:hidden">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              {!collapsed ? (
                <Badge className="hidden border-white/15 bg-white/10 text-white/80 lg:inline-flex">
                  Protected
                </Badge>
              ) : null}
              <a
                href="/admin/logout"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2",
                  "rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white",
                  "shadow-sm transition-colors hover:bg-white/15",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                  !collapsed && "lg:mt-3",
                  collapsed && "lg:px-0",
                )}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed ? "Logout" : <span className="lg:hidden">Logout</span>}
              </a>
            </div>
          </div>
        </aside>

        <section className="flex min-h-dvh min-w-0 flex-col lg:h-dvh">
          <header className="relative z-20 flex min-h-20 shrink-0 items-center justify-between overflow-hidden border-b border-white/10 bg-zinc-950 px-4 py-4 text-white sm:min-h-24 sm:py-5 sm:px-6 lg:px-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(760px_420px_at_20%_20%,rgba(84,168,230,0.34),transparent_60%),radial-gradient(620px_360px_at_84%_76%,rgba(255,190,55,0.20),transparent_64%),linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.60))]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:14px_14px]"
            />
            <div className="relative z-10 flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                title="Open menu"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                  Admin Workspace
                </h1>
                <p className="mt-0.5 hidden text-sm text-white/65 sm:mt-1 sm:block">
                  Manage content and trading education operations.
                </p>
              </div>
            </div>
            <a
              href="/admin/logout"
              className="relative z-10 inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-2.5 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-white/15 sm:px-3 sm:text-sm lg:hidden"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </a>
          </header>
          <div className="min-h-0 flex-1 lg:overflow-y-auto">{children}</div>
        </section>
      </div>
    </main>
  );
}
