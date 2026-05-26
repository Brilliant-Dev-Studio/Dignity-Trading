"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const toggleSidebar = useCallback(() => {
    const next = !getSidebarCollapsedSnapshot();
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
    window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_EVENT));
  }, []);

  return (
    <main className="min-h-dvh bg-zinc-50 text-zinc-950">
      <div
        className={cn(
          "grid min-h-dvh transition-[grid-template-columns]",
          collapsed ? "lg:grid-cols-[84px_1fr]" : "lg:grid-cols-[260px_1fr]",
        )}
      >
        <aside className="relative h-dvh overflow-visible border-b border-white/10 bg-zinc-950 text-white lg:sticky lg:top-0 lg:border-b-0 lg:border-r">
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
                collapsed ? "justify-center" : "justify-between gap-3",
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
            </div>

            <nav className="flex flex-1 gap-2 overflow-y-auto px-3 py-4 lg:flex-col">
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
                      collapsed && "justify-center",
                    )}
                    title={item.label}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed ? <span>{item.label}</span> : null}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden border-t border-white/10 p-4 lg:block">
              {!collapsed ? (
                <Badge className="border-white/15 bg-white/10 text-white/80">
                  Protected
                </Badge>
              ) : null}
              <a
                href="/admin/logout"
                className={cn(
                  "mt-3 inline-flex w-full items-center justify-center gap-2",
                  "rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white",
                  "shadow-sm transition-colors hover:bg-white/15",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                  collapsed && "px-0",
                )}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed ? "Logout" : null}
              </a>
            </div>
          </div>
        </aside>

        <section className="flex h-dvh min-w-0 flex-col">
          <header className="relative z-20 flex min-h-24 shrink-0 items-center justify-between overflow-hidden border-b border-white/10 bg-zinc-950 px-4 py-5 text-white sm:px-6 lg:px-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(760px_420px_at_20%_20%,rgba(84,168,230,0.34),transparent_60%),radial-gradient(620px_360px_at_84%_76%,rgba(255,190,55,0.20),transparent_64%),linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.60))]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:14px_14px]"
            />
            <div className="relative z-10 flex min-w-0 items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight">
                  Admin Workspace
                </h1>
                <p className="mt-1 text-sm text-white/65">
                  Manage content and trading education operations.
                </p>
              </div>
            </div>
            <a
              href="/admin/logout"
              className="relative z-10 inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/15 lg:hidden"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </a>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </section>
      </div>
    </main>
  );
}
