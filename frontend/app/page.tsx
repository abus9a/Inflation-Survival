import Link from "next/link";
import { BarChart2, GitCompare, Activity, TrendingUp, Globe, Zap } from "lucide-react";
import { api } from "@/lib/api";

export const revalidate = 60;

const FEATURES = [
  {
    icon: BarChart2,
    title: "Cost of Living Dashboard",
    description:
      "Compare housing, food, transport, and utilities across 8+ cities with real-time data.",
    href: "/dashboard",
    color: "text-brand-light",
    bg: "bg-brand/10",
  },
  {
    icon: GitCompare,
    title: "City Comparison",
    description:
      "Side-by-side analysis of any two cities. Find out exactly how much you'd save by relocating.",
    href: "/compare",
    color: "text-accent-purple",
    bg: "bg-accent-purple/10",
  },
  {
    icon: Activity,
    title: "Price Forecasting",
    description:
      "ML-powered 12-month inflation forecasts for groceries, rent, transport, and more.",
    href: "/forecast",
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
  },
];

export default async function HomePage() {
  let cities = null;
  try {
    cities = await api.cities.list();
  } catch {
    cities = null;
  }

  const avgInflation = cities
    ? (cities.reduce((s, c) => s + c.annual_inflation, 0) / cities.length).toFixed(1)
    : "—";

  const cheapestCity = cities?.reduce((a, b) =>
    a.monthly_total_usd < b.monthly_total_usd ? a : b
  );

  const mostExpensive = cities?.reduce((a, b) =>
    a.monthly_total_usd > b.monthly_total_usd ? a : b
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />

      <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm text-brand-light">
          <Zap className="h-3.5 w-3.5" />
          Powered by ML + Gemini AI
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Survive Inflation.
          <br />
          <span className="bg-gradient-to-r from-brand to-accent-purple bg-clip-text text-transparent">
            Live Smarter.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Track prices across cities, compare cost of living, and get AI-powered
          recommendations to cut your expenses by up to 20%.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20"
          >
            Open Dashboard
          </Link>
          <Link
            href="/compare"
            className="rounded-xl border border-surface-border px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-brand/40 hover:text-white"
          >
            Compare Cities
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-4 text-center sm:gap-8">
          {[
            { label: "Cities Tracked", value: cities ? cities.length.toString() : "8" },
            { label: "Avg. Inflation", value: `${avgInflation}%` },
            { label: "Cheapest City", value: cheapestCity?.city.name ?? "Bangkok" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl font-extrabold text-white sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, href, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-surface-border bg-surface-card p-6 transition-all hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5"
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
              <p className="mt-4 text-xs font-medium text-brand-light opacity-0 transition-opacity group-hover:opacity-100">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {cities && (
        <section className="border-t border-surface-border bg-surface-card">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <div className="mb-6 flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-light" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Cities Overview
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cities.map((city) => (
                <Link
                  key={city.city.id}
                  href={`/dashboard?city=${city.city.id}`}
                  className="flex items-center justify-between rounded-xl border border-surface-border p-3 transition-colors hover:border-brand/30 hover:bg-surface-hover"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{city.city.name}</p>
                    <p className="text-xs text-gray-500">{city.city.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      ${city.monthly_total_usd.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs ${city.annual_inflation > 10 ? "text-accent-red" : "text-accent-emerald"}`}
                    >
                      {city.annual_inflation}% inflation
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
