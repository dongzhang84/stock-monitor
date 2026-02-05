export interface StockConfig {
  symbol: string;
  name: string;
  lowerThreshold: number;
  upperThreshold: number;
  enabled: boolean;
}

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface Alert {
  symbol: string;
  price: number;
  type: 'BUY' | 'SELL';
  timestamp: number;
}
