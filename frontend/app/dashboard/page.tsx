"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  DollarSign,
  Home,
  ShoppingCart,
  TrendingUp,
  Loader2,
  ChevronDown,
} from "lucide-react";
import type { CityLivingCost, ExchangeRate } from "@/types";
import { api } from "@/lib/api";
import CityCard from "@/components/CityCard";
import PriceBreakdownChart from "@/components/PriceBreakdownChart";
import AIRecommendations from "@/components/AIRecommendations";
import ExchangeRateWidget from "@/components/ExchangeRateWidget";

const CityMap = dynamic(() => import("@/components/CityMap"), { ssr: false });

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          <p className={`mt-0.5 text-xs ${color}`}>{sub}</p>
        </div>
        <div className={`rounded-lg p-2 ${color.replace("text-", "bg-").replace("accent-", "accent-").replace("brand-light", "brand")} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [cities, setCities] = useState<CityLivingCost[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [selected, setSelected] = useState<CityLivingCost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.cities.list(), api.exchange.rates()])
      .then(([c, r]) => {
        setCities(c);
        setRates(r);
        setSelected(c[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  const city = selected!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Cost of Living Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time prices and AI insights across global cities
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Select City
          </p>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {cities.map((c) => (
              <CityCard
                key={c.city.id}
                city={c}
                onClick={() => setSelected(c)}
                selected={selected?.city.id === c.city.id}
              />
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <StatCard
              icon={DollarSign}
              label="Monthly Total"
              value={`$${city.monthly_total_usd.toLocaleString()}`}
              sub="Per month (USD)"
              color="text-brand-light"
            />
            <StatCard
              icon={Home}
              label="Rent Index"
              value={city.rent_index.toFixed(1)}
              sub={`vs NY=100`}
              color="text-accent-purple"
            />
            <StatCard
              icon={ShoppingCart}
              label="Groceries"
              value={`$${city.categories.find((c) => c.name.includes("Grocer"))?.usd_equivalent.toFixed(0) ?? "—"}`}
              sub="Per month"
              color="text-accent-emerald"
            />
            <StatCard
              icon={TrendingUp}
              label="Inflation"
              value={`${city.annual_inflation}%`}
              sub="Annual rate"
              color={city.annual_inflation > 10 ? "text-accent-red" : "text-accent-emerald"}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-surface-border bg-surface-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-white">
                Expense Breakdown — {city.city.name}
              </h3>
              <PriceBreakdownChart city={city} />
            </div>

            <div className="rounded-xl border border-surface-border bg-surface-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-white">
                AI Savings Analysis
              </h3>
              <AIRecommendations key={city.city.id} cityId={city.city.id} />
            </div>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">City Map</h3>
            <CityMap cities={cities} selectedIds={[city.city.id]} />
          </div>

          <div className="rounded-xl border border-surface-border bg-surface-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">
              Exchange Rates (vs USD)
            </h3>
            <ExchangeRateWidget rates={rates} />
          </div>
        </div>
      </div>
    </div>
  );
}
