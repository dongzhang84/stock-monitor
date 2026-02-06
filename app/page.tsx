'use client';

import { useState, useEffect, useRef } from "react";
import StockCard from "@/components/StockCard";

export default function Home() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchingRef = useRef(false);

  useEffect(() => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    fetch("/api/price?symbol=AMZN")
      .then((res) => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then((data) => {
        setPrice(data.price);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to fetch price. API rate limit reached.");
        setLoading(false);
      })
      .finally(() => {
        fetchingRef.current = false;
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-white">Stock Monitor</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : price !== null ? (
        <StockCard symbol="AMZN" name="Amazon" price={price} />
      ) : (
        <p className="text-red-400">Failed to load price</p>
      )}
    </div>
  );
}
