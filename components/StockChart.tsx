"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface PricePoint {
  timestamp: number;
  price: number;
}

interface StockChartProps {
  symbol: string;
  lowerThreshold: number;
  upperThreshold: number;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function StockChart({ symbol, lowerThreshold, upperThreshold }: StockChartProps) {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/history?symbol=${symbol}&hours=24`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
      })
      .then((data) => setHistory(data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) {
    return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading chart...</div>;
  }

  if (history.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-500 text-sm">No historical data yet</div>;
  }

  const prices = history.map((p) => p.price);
  const minPrice = Math.min(...prices, lowerThreshold);
  const maxPrice = Math.max(...prices, upperThreshold);
  const padding = (maxPrice - minPrice) * 0.1 || 1;

  return (
    <ResponsiveContainer width="100%" height={192}>
      <LineChart data={history}>
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTime}
          tick={{ fill: "#9ca3af", fontSize: 10 }}
          stroke="#374151"
        />
        <YAxis
          domain={[minPrice - padding, maxPrice + padding]}
          tick={{ fill: "#9ca3af", fontSize: 10 }}
          stroke="#374151"
          tickFormatter={(v: number) => `$${v.toFixed(0)}`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
          labelFormatter={(label) => formatTime(Number(label))}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
        />
        <ReferenceLine y={lowerThreshold} stroke="#22c55e" strokeDasharray="4 4" />
        <ReferenceLine y={upperThreshold} stroke="#f97316" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
