import { getMockPrice } from "./mock-data";

export interface StockPriceResult {
  price: number | null;
  rateLimited: boolean;
}

export async function fetchStockPrice(symbol: string): Promise<StockPriceResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    const price = getMockPrice(symbol);
    console.log(`[MOCK] Price for ${symbol}: $${price}`);
    return { price, rateLimited: false };
  }

  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  if (!apiKey) {
    console.log('ALPHA_VANTAGE_KEY not configured');
    return { price: null, rateLimited: false };
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    console.log(`Fetching price for ${symbol}...`);
    const response = await fetch(url);
    const data = await response.json();

    console.log(`Response for ${symbol}:`, JSON.stringify(data, null, 2));

    if (data['Note'] || data['Information']) {
      console.log(`Rate limited for ${symbol}`);
      return { price: null, rateLimited: true };
    }

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      console.log(`No price data found for ${symbol}`);
      return { price: null, rateLimited: false };
    }

    const price = parseFloat(quote['05. price']);
    console.log(`Price for ${symbol}: $${price}`);

    return { price, rateLimited: false };
  } catch (error) {
    console.log(`Error fetching price for ${symbol}:`, error);
    return { price: null, rateLimited: false };
  }
}
