import { getMockPrice } from "./mock-data";

export interface StockPriceResult {
  price: number | null;
  rateLimited: boolean;
  error?: string;
}

async function fetchWithRetry(
  url: string,
  retries: number = 2
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;

      // Don't retry on 4xx client errors
      if (response.status >= 400 && response.status < 500) return response;

      console.log(
        `[stock-api] Attempt ${attempt + 1} failed with status ${response.status}`
      );
    } catch (err) {
      console.log(
        `[stock-api] Attempt ${attempt + 1} network error:`,
        err instanceof Error ? err.message : err
      );
      if (attempt === retries) throw err;
    }

    // Exponential backoff: 1s, 2s
    const backoff = Math.pow(2, attempt) * 1000;
    console.log(`[stock-api] Retrying in ${backoff}ms...`);
    await new Promise((resolve) => setTimeout(resolve, backoff));
  }

  throw new Error("All retry attempts exhausted");
}

export async function fetchStockPrice(symbol: string): Promise<StockPriceResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    const price = getMockPrice(symbol);
    console.log(`[MOCK] Price for ${symbol}: $${price}`);
    return { price, rateLimited: false };
  }

  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  if (!apiKey) {
    console.error("[stock-api] ALPHA_VANTAGE_KEY not configured");
    return { price: null, rateLimited: false, error: "API key not configured" };
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;

  try {
    console.log(`[stock-api] Fetching price for ${symbol}...`);
    const response = await fetchWithRetry(url);

    if (!response.ok) {
      console.error(`[stock-api] HTTP ${response.status} for ${symbol}`);
      return { price: null, rateLimited: false, error: `HTTP error ${response.status}` };
    }

    const data = await response.json();

    if (data["Note"] || data["Information"]) {
      const message = data["Note"] || data["Information"];
      console.log(`[stock-api] Rate limited for ${symbol}: ${message}`);
      return { price: null, rateLimited: true, error: "API rate limit reached" };
    }

    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) {
      console.log(`[stock-api] No price data for ${symbol}. Response:`, JSON.stringify(data));
      return { price: null, rateLimited: false, error: `No price data for ${symbol}` };
    }

    const price = parseFloat(quote["05. price"]);
    if (isNaN(price)) {
      console.error(`[stock-api] Invalid price value for ${symbol}: ${quote["05. price"]}`);
      return { price: null, rateLimited: false, error: "Invalid price data" };
    }

    console.log(`[stock-api] Price for ${symbol}: $${price}`);
    return { price, rateLimited: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[stock-api] Failed to fetch ${symbol}: ${message}`);

    if (message.includes("fetch") || message.includes("network") || message.includes("ENOTFOUND")) {
      return { price: null, rateLimited: false, error: "Network error — check your connection" };
    }

    return { price: null, rateLimited: false, error: `Failed to fetch price: ${message}` };
  }
}
