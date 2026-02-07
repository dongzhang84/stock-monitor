import { NextRequest, NextResponse } from "next/server";
import { getPriceHistory } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");
  const hoursParam = request.nextUrl.searchParams.get("hours");

  if (!symbol) {
    return NextResponse.json(
      { error: "Missing required query parameter: symbol" },
      { status: 400 }
    );
  }

  const hours = hoursParam ? parseInt(hoursParam, 10) : 24;

  try {
    const history = await getPriceHistory(symbol.toUpperCase(), hours);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching price history:", error);
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}
