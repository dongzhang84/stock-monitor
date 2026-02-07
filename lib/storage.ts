import { kv } from "@vercel/kv";

interface PriceEntry {
  price: number;
  timestamp: number;
}

export async function savePriceHistory(
  symbol: string,
  price: number
): Promise<void> {
  const key = `price:${symbol}`;
  const timestamp = Date.now();
  const value = JSON.stringify({ price, timestamp });

  await kv.zadd(key, { score: timestamp, member: value });

  // Keep only the last 1000 entries (remove oldest)
  const count = await kv.zcard(key);
  if (count > 1000) {
    await kv.zremrangebyrank(key, 0, count - 1001);
  }
}

export async function getPriceHistory(
  symbol: string,
  hours: number = 24
): Promise<PriceEntry[]> {
  const key = `price:${symbol}`;
  const cutoff = Date.now() - hours * 60 * 60 * 1000;

  const results = await kv.zrange<string[]>(key, cutoff, "+inf", {
    byScore: true,
  });

  return results.map((entry) => {
    const parsed = typeof entry === "string" ? JSON.parse(entry) : entry;
    return { price: parsed.price, timestamp: parsed.timestamp };
  });
}

export async function getLatestPrice(
  symbol: string
): Promise<number | null> {
  const key = `price:${symbol}`;

  const results = await kv.zrange<string[]>(key, -1, -1);

  if (!results || results.length === 0) return null;

  const parsed =
    typeof results[0] === "string" ? JSON.parse(results[0]) : results[0];
  return parsed.price;
}
