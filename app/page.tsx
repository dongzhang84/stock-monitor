'use client';

import { useState, useEffect, useRef } from "react";
import StockCard from "@/components/StockCard";
import { STOCKS } from "@/lib/config";

const enabledStocks = STOCKS.filter((s) => s.enabled);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function Home() {
  const [prices, setPrices] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(enabledStocks.map((s) => [s.symbol, null]))
  );
  const [errors, setErrors] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(enabledStocks.map((s) => [s.symbol, null]))
  );

  const fetchingRef = useRef(false);

  useEffect(() => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    async function fetchPrices() {
      for (let i = 0; i < enabledStocks.length; i++) {
        const stock = enabledStocks[i];
        try {
          const res = await fetch(`/api/price?symbol=${stock.symbol}`);
          if (!res.ok) throw new Error("API request failed");
          const data = await res.json();
          setPrices((prev) => ({ ...prev, [stock.symbol]: data.price }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            [stock.symbol]: "Unable to fetch price",
          }));
        }
        if (i < enabledStocks.length - 1) {
          await delay(1500);
        }
      }
    }

    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Stock Monitor</h1>
        <p className="mt-2 text-gray-400">
          Monitoring {enabledStocks.length} stock{enabledStocks.length !== 1 && "s"}
        </p>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enabledStocks.map((stock) => (
          <div key={stock.symbol}>
            {errors[stock.symbol] ? (
              <div className="rounded-lg border border-red-700 bg-gray-800 p-4 shadow-lg">
                <h2 className="text-lg font-semibold text-white">{stock.name}</h2>
                <p className="text-sm text-gray-400">{stock.symbol}</p>
                <p className="mt-2 text-sm text-red-400">{errors[stock.symbol]}</p>
              </div>
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
