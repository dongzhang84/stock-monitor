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
];
