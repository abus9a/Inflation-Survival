"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CityLivingCost } from "@/types";

interface Props {
  city: CityLivingCost;
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#84cc16",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-white">{payload[0].payload.name}</p>
      <p className="text-sm font-bold text-brand-light">
        ${payload[0].value.toLocaleString()}
        <span className="ml-1 text-xs font-normal text-gray-400">USD</span>
      </p>
    </div>
  );
};

export default function PriceBreakdownChart({ city }: Props) {
  const data = city.categories.map((cat) => ({
    name: cat.name.replace(" (1BR Center)", "").replace("Center", "").trim(),
    value: cat.usd_equivalent,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#8b949e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fill: "#8b949e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
