# 📈 Stock Monitor

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

A real-time stock price monitoring system that automatically tracks configured stocks and sends buy/sell alerts via GitHub Issues. Perfect for individual investors who want automated price monitoring without paying for premium tools.

**Key Features:**
- 🎯 Set custom buy/sell thresholds for any stock
- 📬 Get automatic alerts as GitHub Issues when prices cross thresholds
- 📊 View 24-hour price history charts
- ⚡ Completely free using free tiers (Vercel + GitHub Actions + Alpha Vantage)
- 🔄 Runs automatically during market hours (Mon-Fri)

**Live Demo**: [stock-monitor.vercel.app](https://stock-monitor.vercel.app)

---

## Features

- **Live Dashboard** — Dark-themed UI showing stock prices with BUY/HOLD/SELL indicators
- **Price Threshold Alerts** — Configurable upper/lower thresholds per stock
- **GitHub Issue Notifications** — Automatic issue creation when thresholds are crossed
- **Automated Monitoring** — GitHub Actions checks prices during market hours (Mon-Fri)
- **Price History Charts** — 24-hour price charts with threshold reference lines
- **Progressive Loading** — Skeleton loaders and per-stock error states with retry
- **Mock Data Mode** — Development mode for unlimited testing without API calls

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes (Vercel Serverless Functions)
- **Storage**: Upstash Redis (via Vercel KV)
- **Scheduling**: GitHub Actions Cron
- **Notifications**: GitHub Issues API
- **Stock Data**: Alpha Vantage API (free tier)
- **Hosting**: Vercel

**Total cost: $0/month**

## Prerequisites

- Node.js 18+
- Vercel account (free)
- GitHub account
- Alpha Vantage API key ([get one free](https://www.alphavantage.co/support/#api-key))

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/stock-monitor.git
cd stock-monitor
npm install
```

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ALPHA_VANTAGE_KEY` | Stock price API key | `ABC123XYZ456` |
| `GITHUB_TOKEN` | Personal access token with `repo` scope | `ghp_xxxxxxxxxxxx` |
| `GITHUB_REPO` | Repository for issue alerts | `username/stock-monitor` |
| `USE_MOCK_DATA` | Use fake prices for development | `true` or `false` |

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `USE_MOCK_DATA=true` in `.env.local` to avoid burning API calls during development.

## Configuring Stocks

Edit `lib/config.ts` to add or modify monitored stocks:

```typescript
export const STOCKS: StockConfig[] = [
  {
    symbol: 'AMZN',
    name: 'Amazon',
    lowerThreshold: 230,  // BUY signal below this price
    upperThreshold: 240,  // SELL signal above this price
    enabled: true,
  },
  {
    symbol: 'AAPL',
    name: 'Apple',
    lowerThreshold: 250,
    upperThreshold: 280,
    enabled: true,
  },
];
```

When using mock data, also add base prices in `lib/mock-data.ts`.

## Deployment

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel project settings
4. Set up Upstash Redis via Vercel Storage > Marketplace > Upstash for Redis
5. Deploy

Subsequent pushes auto-deploy.

## Automated Monitoring

A GitHub Actions workflow (`.github/workflows/stock-monitor.yml`) calls the `/api/check-stocks` endpoint on a schedule during US market hours.

**Manual trigger**: GitHub repo > Actions tab > Stock Monitor Cron > Run workflow

**Schedule**: Every 30 minutes, Monday-Friday, during trading hours (configurable via cron expression in the workflow file).

Each run fetches prices for all enabled stocks, saves them to history, and creates GitHub Issues if any thresholds are crossed.

## Architecture

```
Browser → Next.js Dashboard (app/page.tsx)
              ↓
         /api/price → Alpha Vantage API → Upstash Redis (history)
              ↓
         StockCard + StockChart (Recharts)

GitHub Actions (cron) → /api/check-stocks → Alpha Vantage API
                              ↓                    ↓
                        Upstash Redis        GitHub Issues (alerts)
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/price?symbol=AMZN` | Fetch current price for a stock |
| `GET /api/history?symbol=AMZN&hours=24` | Get price history |
| `GET /api/check-stocks` | Check all stocks and trigger alerts |
| `GET /api/test` | Health check |

## Future Enhancements

- Email/Telegram notifications
- Custom threshold editor in the UI
- User authentication and personalized watchlists
- Mobile-responsive PWA
- More stock exchanges and crypto support
- Alert deduplication with cooldown periods

## License

MIT
