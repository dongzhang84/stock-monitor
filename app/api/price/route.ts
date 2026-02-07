import { NextRequest, NextResponse } from 'next/server';
import { fetchStockPrice } from '@/lib/stock-api';
import { savePriceHistory } from '@/lib/storage';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Missing required query parameter: symbol' },
      { status: 400 }
    );
  }

  try {
    const result = await fetchStockPrice(symbol);

    if (result.rateLimited) {
      return NextResponse.json(
        { error: 'API rate limit reached. Please try again later.' },
        { status: 429 }
      );
    }

    if (result.price === null) {
      return NextResponse.json(
        { error: `Failed to fetch price for symbol: ${symbol}` },
        { status: 500 }
      );
    }

    try {
      await savePriceHistory(symbol.toUpperCase(), result.price);
      console.log(`Price saved: ${symbol.toUpperCase()} = $${result.price}`);
    } catch (storageError) {
      console.error('Failed to save price to storage:', storageError);
    }

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      price: result.price,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching price:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
