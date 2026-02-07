import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number | null | undefined;
  lowerThreshold: number;
  upperThreshold: number;
}

function getStatus(price: number, lower: number, upper: number) {
  if (price < lower) return "BUY" as const;
  if (price > upper) return "SELL" as const;
  return "HOLD" as const;
}

const statusConfig = {
  BUY: {
    badge: "bg-green-900 text-green-300",
    icon: TrendingDown,
  },
  SELL: {
    badge: "bg-orange-900 text-orange-300",
    icon: TrendingUp,
  },
  HOLD: {
    badge: "bg-blue-900 text-blue-300",
    icon: Minus,
  },
};

export default function StockCard({ symbol, name, price, lowerThreshold, upperThreshold }: StockCardProps) {
  const status = price != null ? getStatus(price, lowerThreshold, upperThreshold) : null;
  const config = status ? statusConfig[status] : null;
  const Icon = config?.icon;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{name}</h2>
          <p className="text-sm text-gray-400">{symbol}</p>
        </div>
        {status && config && Icon && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.badge}`}>
            <Icon size={14} />
            {status}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-green-400">
        {price != null ? `$${price.toFixed(2)}` : "Loading..."}
      </p>
      {price != null && (
        <div className="mt-3 border-t border-gray-700 pt-3">
          <div className="relative h-2 rounded-full" style={{ background: "linear-gradient(to right, #22c55e, #3b82f6, #f97316)" }}>
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-900"
              style={{ left: `${Math.max(0, Math.min(100, ((price - lowerThreshold) / (upperThreshold - lowerThreshold)) * 100))}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="text-green-400">${lowerThreshold}</span>
            <span className="text-orange-400">${upperThreshold}</span>
          </div>
        </div>
      )}
      {price == null && (
        <div className="mt-3 flex gap-4 border-t border-gray-700 pt-3 text-xs">
          <span className="text-green-400">Buy Zone: &lt; ${lowerThreshold}</span>
          <span className="text-orange-400">Sell Zone: &gt; ${upperThreshold}</span>
        </div>
      )}
    </div>
  );
}
