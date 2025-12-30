"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ExchangeRate } from "@/types";
import clsx from "clsx";

interface Props {
  rates: ExchangeRate[];
}

export default function ExchangeRateWidget({ rates }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
      {rates.slice(0, 9).map((rate) => {
        const isUp = rate.change_24h > 0;
        const isDown = rate.change_24h < 0;
        return (
          <div
            key={rate.currency}
            className="rounded-lg border border-surface-border bg-surface-card p-3 transition-colors hover:border-brand/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">
                  {rate.symbol} {rate.currency}
                </p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-white">
                  {rate.rate.toFixed(rate.rate > 10 ? 1 : 4)}
                </p>
              </div>
              <div
                className={clsx(
                  "flex items-center gap-0.5 text-xs font-medium",
                  isUp && "text-accent-red",
                  isDown && "text-accent-emerald",
                  !isUp && !isDown && "text-gray-500"
                )}
              >
                {isUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : isDown ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {Math.abs(rate.change_24h).toFixed(1)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
