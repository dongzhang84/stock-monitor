export interface StockConfig {
  symbol: string;
  name: string;
  lowerThreshold: number;
  upperThreshold: number;
  enabled: boolean;
}

export const STOCKS: StockConfig[] = [
  {
    symbol: 'AMZN',
    name: 'Amazon',
    lowerThreshold: 300,
    upperThreshold: 400,
    enabled: true,
  },

  {
  symbol: 'AAPL',
  name: 'Apple',
  lowerThreshold: 250,
  upperThreshold: 280,
  enabled: true  // 改成 true
}
];
