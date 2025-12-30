"use client";

import { useState } from "react";
import { Sparkles, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import type { AIRecommendation } from "@/types";
import { api } from "@/lib/api";

interface Props {
  cityId: string;
  initialData?: AIRecommendation;
}

export default function AIRecommendations({ cityId, initialData }: Props) {
  const [data, setData] = useState<AIRecommendation | null>(initialData ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.recommendations.get(cityId);
      setData(result);
    } catch {
      setError("Failed to load AI recommendations.");
    } finally {
      setLoading(false);
    }
  };

  if (!data && !loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
          <Sparkles className="h-6 w-6 text-brand-light" />
        </div>
        <div>
          <p className="font-medium text-white">AI-Powered Savings Analysis</p>
          <p className="mt-1 text-sm text-gray-500">
            Get personalized tips to cut your expenses by up to 20%
          </p>
        </div>
        <button
          onClick={fetchRecommendations}
          className="mt-1 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Analyze My Expenses
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <p className="text-sm text-gray-400">Generating recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-accent-red/20 bg-accent-red/10 p-3 text-sm text-accent-red">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-light" />
          <span className="text-sm font-semibold text-white">AI Recommendations</span>
        </div>
        <button
          onClick={fetchRecommendations}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-accent-emerald/20 bg-accent-emerald/5 p-4">
        <p className="text-xs text-gray-400">Potential Monthly Savings</p>
        <p className="mt-0.5 text-2xl font-bold text-accent-emerald">
          ${data!.potential_savings.toLocaleString()}
        </p>
        <p className="text-xs text-accent-emerald/70">
          {data!.savings_percentage}% of your budget
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Priority Actions
        </p>
        {data!.priority_actions.slice(0, 3).map((action, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/5 p-3"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="text-sm text-gray-300">{action}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          All Tips
        </p>
        {data!.tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 py-2">
            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
            <p className="text-sm text-gray-400">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
