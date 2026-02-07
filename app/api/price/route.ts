import { NextRequest, NextResponse } from 'next/server';
import { fetchStockPrice } from '@/lib/stock-api';
import { savePriceHistory } from '@/lib/storage';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Missing required query parameter: symbol', code: 'MISSING_SYMBOL' },
      { status: 400 }
    );
  }

  try {
    console.log(`[price-api] Fetching price for ${symbol.toUpperCase()}`);
    const result = await fetchStockPrice(symbol);

    if (result.rateLimited) {
      console.log(`[price-api] Rate limited for ${symbol.toUpperCase()}`);
      return NextResponse.json(
        { error: 'API rate limit reached. Try again later.', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    if (result.price === null) {
      const errorMsg = result.error || `Failed to fetch price for ${symbol}`;
      console.error(`[price-api] No price for ${symbol.toUpperCase()}: ${errorMsg}`);
      return NextResponse.json(
        { error: errorMsg, code: 'FETCH_FAILED' },
        { status: 502 }
      );
    }

    try {
      await savePriceHistory(symbol.toUpperCase(), result.price);
      console.log(`[price-api] Price saved: ${symbol.toUpperCase()} = $${result.price}`);
    } catch (storageError) {
      console.error('[price-api] Failed to save price to storage:', storageError);
    }

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      price: result.price,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[price-api] Unhandled error for ${symbol.toUpperCase()}: ${message}`);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
