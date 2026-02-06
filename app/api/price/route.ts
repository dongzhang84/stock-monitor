import { NextRequest, NextResponse } from 'next/server';
import { fetchStockPrice } from '@/lib/stock-api';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Missing required query parameter: symbol' },
      { status: 400 }
    );
  }

  try {
    const price = await fetchStockPrice(symbol);

    if (price === null) {
      return NextResponse.json(
        { error: `Failed to fetch price for symbol: ${symbol}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      price,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
