"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { PriceForecast } from "@/types";

interface Props {
  forecast: PriceForecast;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name === "actual" ? "Actual" : p.name === "predicted" ? "Forecast" : p.name}:{" "}
          <span className="font-bold">${p.value?.toFixed(2)}</span>
        </p>
      ))}
    </div>
  );
};

const TREND_COLORS: Record<string, string> = {
  rising: "#ef4444",
  falling: "#10b981",
  stable: "#f59e0b",
};

export default function ForecastChart({ forecast }: Props) {
  const trendColor = TREND_COLORS[forecast.trend] ?? "#6366f1";
  const cutoffDate = forecast.data_points.find((p) => p.actual === null)?.date;

  const chartData = forecast.data_points.slice(-30);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={trendColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8b949e", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: "#8b949e", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          {cutoffDate && (
            <ReferenceLine
              x={cutoffDate}
              stroke="#30363d"
              strokeDasharray="4 4"
              label={{ value: "Forecast →", fill: "#8b949e", fontSize: 10 }}
            />
          )}
          <Area
            type="monotone"
            dataKey="upper_bound"
            fill="url(#forecastGradient)"
            stroke="none"
          />
          <Area
            type="monotone"
            dataKey="lower_bound"
            fill="var(--bg)"
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke={trendColor}
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "3 Months", value: forecast.forecast_3m },
          { label: "6 Months", value: forecast.forecast_6m },
          { label: "12 Months", value: forecast.forecast_12m },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-surface-border bg-surface-card p-3 text-center"
          >
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-lg font-bold text-white">${value.toFixed(0)}</p>
            <p
              className="text-xs font-medium"
              style={{ color: trendColor }}
            >
              {(((value - forecast.current_price) / forecast.current_price) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
