const basePrices: Record<string, number> = {
  AMZN: 210,
  AAPL: 275,
};

const ranges: Record<string, number> = {
  AMZN: 5,
  AAPL: 5,
};

export function getMockPrice(symbol: string): number {
  const base = basePrices[symbol] ?? 100;
  const range = ranges[symbol] ?? 5;
  const variation = (Math.random() - 0.5) * 2 * range;
  return parseFloat((base + variation).toFixed(2));
}
