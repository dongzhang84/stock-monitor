import { NextResponse } from "next/server";
import { STOCKS } from "@/lib/config";
import { fetchStockPrice } from "@/lib/stock-api";
import { savePriceHistory } from "@/lib/storage";
import { createAlert } from "@/lib/notifications";

interface Alert {
  symbol: string;
  price: number;
  type: "BUY" | "SELL";
  timestamp: string;
  notified: boolean;
  issueUrl?: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  const enabledStocks = STOCKS.filter((s) => s.enabled);
  const alerts: Alert[] = [];

  for (let i = 0; i < enabledStocks.length; i++) {
    const stock = enabledStocks[i];

    try {
      const result = await fetchStockPrice(stock.symbol);

      if (result.price === null) {
        console.log(`[check-stocks] Skipping ${stock.symbol}: no price data`);
        continue;
      }

      const price = result.price;
      console.log(`[check-stocks] ${stock.symbol}: $${price}`);

      // Save price to history
      try {
        await savePriceHistory(stock.symbol, price);
      } catch (storageError) {
        console.error(`[check-stocks] Failed to save ${stock.symbol} to storage:`, storageError);
      }

      // Check thresholds
      let alertType: "BUY" | "SELL" | null = null;
      if (price < stock.lowerThreshold) {
        alertType = "BUY";
        console.log(`[check-stocks] BUY alert: ${stock.symbol} at $${price} (below $${stock.lowerThreshold})`);
      } else if (price > stock.upperThreshold) {
        alertType = "SELL";
        console.log(`[check-stocks] SELL alert: ${stock.symbol} at $${price} (above $${stock.upperThreshold})`);
      }

      if (alertType) {
        const alert: Alert = {
          symbol: stock.symbol,
          price,
          type: alertType,
          timestamp: new Date().toISOString(),
          notified: false,
        };

        try {
          const result = await createAlert(stock, price, alertType);
          alert.notified = result.success;
          alert.issueUrl = result.issueUrl;
          if (result.success) {
            console.log(`[check-stocks] Notification sent for ${stock.symbol}: ${result.issueUrl}`);
          }
        } catch (notifyError) {
          console.error(`[check-stocks] Failed to send notification for ${stock.symbol}:`, notifyError);
        }

        alerts.push(alert);
      }
    } catch (error) {
      console.error(`[check-stocks] Error processing ${stock.symbol}:`, error);
    }

    // Delay between requests (except after the last one)
    if (i < enabledStocks.length - 1) {
      await delay(1500);
    }
  }

  return NextResponse.json({
    checked: enabledStocks.length,
    alerts,
  });
}
