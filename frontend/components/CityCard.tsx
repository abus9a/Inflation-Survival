"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";
import type { CityLivingCost } from "@/types";
import clsx from "clsx";

interface Props {
  city: CityLivingCost;
  onClick?: () => void;
  selected?: boolean;
}

const FLAG_EMOJIS: Record<string, string> = {
  Kazakhstan: "🇰🇿",
  Turkey: "🇹🇷",
  Germany: "🇩🇪",
  UAE: "🇦🇪",
  Thailand: "🇹🇭",
  Poland: "🇵🇱",
  Russia: "🇷🇺",
};

export default function CityCard({ city, onClick, selected }: Props) {
  const flag = FLAG_EMOJIS[city.city.country] ?? "🌍";
  const inflationHigh = city.annual_inflation > 10;

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full rounded-xl border p-4 text-left transition-all duration-200 hover:border-brand/40 hover:bg-surface-hover",
        selected
          ? "border-brand/60 bg-brand/10 glow-brand"
          : "border-surface-border bg-surface-card"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{flag}</span>
          <div>
            <p className="font-semibold text-white">{city.city.name}</p>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {city.city.country}
            </p>
          </div>
        </div>
        <div
          className={clsx(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            inflationHigh
              ? "bg-accent-red/10 text-accent-red"
              : "bg-accent-emerald/10 text-accent-emerald"
          )}
        >
          {inflationHigh ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {city.annual_inflation}%
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500">Monthly cost</p>
          <p className="text-xl font-bold text-white">
            ${city.monthly_total_usd.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Cost index</p>
          <p className="text-sm font-semibold text-brand-light">
            {city.cost_index.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-accent-purple transition-all"
          style={{ width: `${Math.min(city.cost_index, 100)}%` }}
        />
      </div>
    </button>
  );
}
