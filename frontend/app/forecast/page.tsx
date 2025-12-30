"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PriceForecast, CityLivingCost } from "@/types";
import { api } from "@/lib/api";
import ForecastChart from "@/components/ForecastChart";
import clsx from "clsx";

const CATEGORIES = [
  "groceries",
  "rent",
  "restaurants",
  "transport",
  "utilities",
  "healthcare",
];

const TREND_CONFIG = {
  rising: { icon: TrendingUp, color: "text-accent-red", bg: "bg-accent-red/10", label: "Rising" },
  falling: { icon: TrendingDown, color: "text-accent-emerald", bg: "bg-accent-emerald/10", label: "Falling" },
  stable: { icon: Minus, color: "text-accent-amber", bg: "bg-accent-amber/10", label: "Stable" },
};

export default function ForecastPage() {
  const [cities, setCities] = useState<CityLivingCost[]>([]);
  const [selectedCity, setSelectedCity] = useState("astana");
  const [selectedCat, setSelectedCat] = useState("groceries");
  const [forecast, setForecast] = useState<PriceForecast | null>(null);
  const [allForecasts, setAllForecasts] = useState<PriceForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    api.cities.list().then(setCities);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.forecast.byCategory(selectedCity, selectedCat),
      api.forecast.allForCity(selectedCity),
    ])
      .then(([f, all]) => {
        setForecast(f);
        setAllForecasts(all.forecasts);
      })
      .finally(() => setLoading(false));
  }, [selectedCity]);

  useEffect(() => {
    if (!allForecasts.length) return;
    const found = allForecasts.find((f) => f.category === selectedCat);
    if (found) setForecast(found);
  }, [selectedCat, allForecasts]);

  const cityData = cities.find((c) => c.city.id === selectedCity);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Price Forecasting</h1>
        <p className="mt-1 text-sm text-gray-500">
          ML-powered 12-month price predictions with inflation trend analysis
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c.city.id} value={c.city.id}>
                {c.city.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-500">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors",
                  selectedCat === cat
                    ? "bg-brand text-white"
                    : "border border-surface-border bg-surface-card text-gray-400 hover:text-gray-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : forecast ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-surface-border bg-surface-card p-4">
              <p className="text-xs text-gray-500">Current Price</p>
              <p className="mt-1 text-2xl font-bold text-white">
                ${forecast.current_price.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">/month</p>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface-card p-4">
              <p className="text-xs text-gray-500">Inflation Rate</p>
              <p
                className={clsx(
                  "mt-1 text-2xl font-bold",
                  forecast.inflation_rate > 10 ? "text-accent-red" : "text-accent-emerald"
                )}
              >
                {forecast.inflation_rate}%
              </p>
              <p className="text-xs text-gray-500">annual</p>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface-card p-4">
              <p className="text-xs text-gray-500">12M Forecast</p>
              <p className="mt-1 text-2xl font-bold text-white">
                ${forecast.forecast_12m.toFixed(0)}
              </p>
              <p
                className={clsx(
                  "text-xs font-medium",
                  forecast.trend === "rising" ? "text-accent-red" : "text-accent-emerald"
                )}
              >
                {(
                  ((forecast.forecast_12m - forecast.current_price) /
                    forecast.current_price) *
                  100
                ).toFixed(1)}
                % change
              </p>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface-card p-4">
              <p className="text-xs text-gray-500">Trend</p>
              {(() => {
                const cfg = TREND_CONFIG[forecast.trend];
                const Icon = cfg.icon;
                return (
                  <div className="mt-1 flex items-center gap-2">
                    <div className={clsx("rounded-lg p-1.5", cfg.bg)}>
                      <Icon className={clsx("h-4 w-4", cfg.color)} />
                    </div>
                    <p className={clsx("text-lg font-bold", cfg.color)}>{cfg.label}</p>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface-card p-5">
            <h3 className="mb-4 text-sm font-semibold capitalize text-white">
              {forecast.category} Price Forecast — {cityData?.city.name ?? selectedCity}
            </h3>
            <ForecastChart forecast={forecast} />
          </div>

          {allForecasts.length > 0 && (
            <div className="rounded-xl border border-surface-border bg-surface-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-white">
                All Category Forecasts
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allForecasts.map((f) => {
                  const cfg = TREND_CONFIG[f.trend];
                  const Icon = cfg.icon;
                  const growth = (
                    ((f.forecast_12m - f.current_price) / f.current_price) *
                    100
                  ).toFixed(1);
                  return (
                    <button
                      key={f.category}
                      onClick={() => setSelectedCat(f.category)}
                      className={clsx(
                        "rounded-xl border p-3 text-left transition-all hover:border-brand/40",
                        selectedCat === f.category
                          ? "border-brand/40 bg-brand/5"
                          : "border-surface-border bg-surface-hover"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium capitalize text-white">
                          {f.category}
                        </p>
                        <div className={clsx("rounded-full p-1", cfg.bg)}>
                          <Icon className={clsx("h-3 w-3", cfg.color)} />
                        </div>
                      </div>
                      <p className="mt-2 text-lg font-bold text-white">
                        ${f.current_price.toFixed(0)}
                      </p>
                      <p className={clsx("text-xs", cfg.color)}>
                        {growth}% in 12mo
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-surface-border p-10 text-center text-gray-500">
          No forecast data available
        </div>
      )}
    </div>
  );
}
