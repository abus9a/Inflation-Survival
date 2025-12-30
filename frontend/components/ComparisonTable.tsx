"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { CityLivingCost } from "@/types";
import clsx from "clsx";

interface Props {
  cityA: CityLivingCost;
  cityB: CityLivingCost;
}

const METRICS = [
  { label: "Monthly Total", key: "monthly_total_usd", format: (v: number) => `$${v.toLocaleString()}` },
  { label: "Cost Index", key: "cost_index", format: (v: number) => v.toFixed(1) },
  { label: "Rent Index", key: "rent_index", format: (v: number) => v.toFixed(1) },
  { label: "Groceries Index", key: "groceries_index", format: (v: number) => v.toFixed(1) },
  { label: "Restaurant Index", key: "restaurant_index", format: (v: number) => v.toFixed(1) },
  { label: "Purchasing Power", key: "purchasing_power_index", format: (v: number) => v.toFixed(1) },
  { label: "Annual Inflation", key: "annual_inflation", format: (v: number) => `${v}%` },
];

export default function ComparisonTable({ cityA, cityB }: Props) {
  const savings = Math.abs(cityA.monthly_total_usd - cityB.monthly_total_usd);
  const cheaperIsA = cityA.monthly_total_usd < cityB.monthly_total_usd;
  const savingsPct = (savings / Math.max(cityA.monthly_total_usd, cityB.monthly_total_usd)) * 100;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-accent-emerald/20 bg-gradient-to-r from-accent-emerald/5 to-transparent p-4">
        <p className="text-sm text-gray-400">
          Living in{" "}
          <span className="font-semibold text-white">
            {cheaperIsA ? cityA.city.name : cityB.city.name}
          </span>{" "}
          saves you
        </p>
        <p className="mt-1 text-3xl font-bold text-accent-emerald">
          ${savings.toLocaleString()}
          <span className="ml-2 text-lg font-normal text-accent-emerald/70">/month</span>
        </p>
        <p className="text-sm text-gray-500">{savingsPct.toFixed(1)}% cheaper</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-surface-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-hover">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Metric
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-brand-light">
                {cityA.city.name}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-accent-purple">
                {cityB.city.name}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Diff
              </th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map(({ label, key, format }, i) => {
              const valA = (cityA as any)[key] as number;
              const valB = (cityB as any)[key] as number;
              const diff = valA - valB;
              const pct = Math.abs((diff / valB) * 100);
              const aCheaper = valA < valB;

              return (
                <tr
                  key={key}
                  className={clsx(
                    "border-b border-surface-border last:border-0",
                    i % 2 === 0 ? "bg-surface-card" : "bg-surface"
                  )}
                >
                  <td className="px-4 py-3 font-medium text-gray-300">{label}</td>
                  <td
                    className={clsx(
                      "px-4 py-3 text-center font-mono",
                      aCheaper ? "text-accent-emerald" : "text-gray-300"
                    )}
                  >
                    {format(valA)}
                    {aCheaper && <span className="ml-1 text-xs">✓</span>}
                  </td>
                  <td
                    className={clsx(
                      "px-4 py-3 text-center font-mono",
                      !aCheaper ? "text-accent-emerald" : "text-gray-300"
                    )}
                  >
                    {format(valB)}
                    {!aCheaper && <span className="ml-1 text-xs">✓</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                        diff > 0
                          ? "bg-accent-red/10 text-accent-red"
                          : diff < 0
                          ? "bg-accent-emerald/10 text-accent-emerald"
                          : "bg-gray-500/10 text-gray-500"
                      )}
                    >
                      {diff > 0 ? (
                        <TrendingUp className="h-2.5 w-2.5" />
                      ) : diff < 0 ? (
                        <TrendingDown className="h-2.5 w-2.5" />
                      ) : null}
                      {pct.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
