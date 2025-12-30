"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, ArrowLeftRight } from "lucide-react";
import type { CityLivingCost } from "@/types";
import { api } from "@/lib/api";
import ComparisonTable from "@/components/ComparisonTable";

const CityMap = dynamic(() => import("@/components/CityMap"), { ssr: false });

export default function ComparePage() {
  const [cities, setCities] = useState<CityLivingCost[]>([]);
  const [cityA, setCityA] = useState<string>("astana");
  const [cityB, setCityB] = useState<string>("berlin");
  const [dataA, setDataA] = useState<CityLivingCost | null>(null);
  const [dataB, setDataB] = useState<CityLivingCost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.cities.list().then((data) => {
      setCities(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!cities.length) return;
    const a = cities.find((c) => c.city.id === cityA);
    const b = cities.find((c) => c.city.id === cityB);
    setDataA(a ?? null);
    setDataB(b ?? null);
  }, [cityA, cityB, cities]);

  const swap = () => {
    setCityA(cityB);
    setCityB(cityA);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">City Comparison</h1>
        <p className="mt-1 text-sm text-gray-500">
          Compare cost of living between two cities and find your savings
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-gray-500">City A</label>
          <select
            value={cityA}
            onChange={(e) => setCityA(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c.city.id} value={c.city.id}>
                {c.city.name}, {c.city.country}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="mt-5 rounded-lg border border-surface-border bg-surface-card p-2 text-gray-400 transition-colors hover:border-brand/40 hover:text-brand-light"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <label className="mb-1 block text-xs text-gray-500">City B</label>
          <select
            value={cityB}
            onChange={(e) => setCityB(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c.city.id} value={c.city.id}>
                {c.city.name}, {c.city.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-surface-card p-5 mb-4">
        <h3 className="mb-4 text-sm font-semibold text-white">Map View</h3>
        <CityMap
          cities={cities}
          selectedIds={[cityA, cityB]}
        />
      </div>

      {dataA && dataB && cityA !== cityB ? (
        <div className="rounded-xl border border-surface-border bg-surface-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-white">Detailed Comparison</h3>
          <ComparisonTable cityA={dataA} cityB={dataB} />
        </div>
      ) : (
        <div className="rounded-xl border border-surface-border bg-surface-card p-10 text-center text-gray-500">
          Select two different cities to compare
        </div>
      )}
    </div>
  );
}
