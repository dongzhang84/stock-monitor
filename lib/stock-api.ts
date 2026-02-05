export async function fetchStockPrice(symbol: string): Promise<number | null> {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  if (!apiKey) {
    console.log('ALPHA_VANTAGE_KEY not configured');
    return null;
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    console.log(`Fetching price for ${symbol}...`);
    const response = await fetch(url);
    const data = await response.json();

    console.log(`Response for ${symbol}:`, JSON.stringify(data, null, 2));

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      console.log(`No price data found for ${symbol}`);
      return null;
    }

    const price = parseFloat(quote['05. price']);
    console.log(`Price for ${symbol}: $${price}`);

    return price;
  } catch (error) {
    console.log(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}
