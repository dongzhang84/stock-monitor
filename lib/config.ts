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
    lowerThreshold: 230,
    upperThreshold: 240,
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
