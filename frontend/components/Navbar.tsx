"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, BarChart2, GitCompare, Activity } from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/forecast", label: "Forecast", icon: Activity },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-surface-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            InflationNav
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === href || pathname.startsWith(href)
                  ? "bg-brand/15 text-brand-light"
                  : "text-gray-400 hover:bg-surface-hover hover:text-gray-200"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-accent-emerald/30 bg-accent-emerald/10 px-2.5 py-1 text-xs text-accent-emerald">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse-slow" />
            Live Data
          </div>
        </div>
      </div>
    </nav>
  );
}
