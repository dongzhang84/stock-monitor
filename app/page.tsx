'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import StockCard from "@/components/StockCard";
import { STOCKS } from "@/lib/config";

const enabledStocks = STOCKS.filter((s) => s.enabled);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-5 w-24 rounded bg-gray-700" />
          <div className="mt-1.5 h-4 w-14 rounded bg-gray-700" />
        </div>
        <div className="h-6 w-16 rounded-full bg-gray-700" />
      </div>
      <div className="mt-3 h-7 w-28 rounded bg-gray-700" />
      <div className="mt-3 border-t border-gray-700 pt-3">
        <div className="h-2 w-full rounded-full bg-gray-700" />
        <div className="mt-2 flex justify-between">
          <div className="h-3 w-12 rounded bg-gray-700" />
          <div className="h-3 w-12 rounded bg-gray-700" />
        </div>
      </div>
      <div className="mt-4 h-48 rounded bg-gray-700" />
    </div>
  );
}

export default function Home() {
  const [prices, setPrices] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(enabledStocks.map((s) => [s.symbol, null]))
  );
  const [errors, setErrors] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(enabledStocks.map((s) => [s.symbol, null]))
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchingRef = useRef(false);

  const retrySingle = useCallback(async (symbol: string) => {
    setErrors((prev) => ({ ...prev, [symbol]: null }));
    try {
      const res = await fetch(`/api/price?symbol=${symbol}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMsg =
          res.status === 429
            ? "API rate limit reached (25/day). Try again tomorrow."
            : data.error || `Server error (${res.status})`;
        setErrors((prev) => ({ ...prev, [symbol]: errorMsg }));
        return;
      }
      const data = await res.json();
      setPrices((prev) => ({ ...prev, [symbol]: data.price }));
      setErrors((prev) => ({ ...prev, [symbol]: null }));
      setLastUpdated(new Date());
    } catch {
      setErrors((prev) => ({ ...prev, [symbol]: "Network error — check your connection" }));
    }
  }, []);

  const fetchPrices = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setRefreshing(true);

    for (let i = 0; i < enabledStocks.length; i++) {
      const stock = enabledStocks[i];
      try {
        const res = await fetch(`/api/price?symbol=${stock.symbol}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const errorMsg =
            res.status === 429
              ? "API rate limit reached (25/day). Try again tomorrow."
              : data.error || `Server error (${res.status})`;
          setErrors((prev) => ({ ...prev, [stock.symbol]: errorMsg }));
          continue;
        }
        const data = await res.json();
        setPrices((prev) => ({ ...prev, [stock.symbol]: data.price }));
        setErrors((prev) => ({ ...prev, [stock.symbol]: null }));
        setLastUpdated(new Date());
      } catch {
        setErrors((prev) => ({
          ...prev,
          [stock.symbol]: "Network error — check your connection",
        }));
      }
      if (i < enabledStocks.length - 1) {
        await delay(1500);
      }
    }

    setRefreshing(false);
    fetchingRef.current = false;
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const allFailed = enabledStocks.every((s) => errors[s.symbol] !== null) && !refreshing;
  const loadedCount = enabledStocks.filter((s) => prices[s.symbol] !== null).length;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Stock Monitor</h1>
        <p className="mt-2 text-gray-400">
          Monitoring {enabledStocks.length} stock{enabledStocks.length !== 1 && "s"}
          {refreshing && loadedCount < enabledStocks.length && (
            <span> — loading {loadedCount}/{enabledStocks.length}</span>
          )}
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchPrices}
            disabled={refreshing}
            className="rounded-md bg-gray-700 px-3 py-1 text-sm text-gray-300 transition hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {allFailed && (
        <div className="w-full max-w-5xl rounded-lg border border-red-700 bg-red-900/20 p-4 text-center">
          <p className="text-red-400">Failed to fetch all stock prices. API may be rate limited or unavailable.</p>
          <button
            onClick={fetchPrices}
            className="mt-2 rounded-md bg-red-700 px-4 py-1.5 text-sm text-white transition hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enabledStocks.map((stock) => (
          <div key={stock.symbol}>
            {errors[stock.symbol] && prices[stock.symbol] === null ? (
              <StockCard
                symbol={stock.symbol}
                name={stock.name}
                price={null}
                lowerThreshold={stock.lowerThreshold}
                upperThreshold={stock.upperThreshold}
                error={errors[stock.symbol]}
                onRetry={() => retrySingle(stock.symbol)}
              />
            ) : prices[stock.symbol] === null ? (
              <SkeletonCard />
            ) : (
              <StockCard
                symbol={stock.symbol}
                name={stock.name}
                price={prices[stock.symbol]}
                lowerThreshold={stock.lowerThreshold}
                upperThreshold={stock.upperThreshold}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
