# Stock Monitor - Implementation Guide

## Overview

A scalable real-time stock monitoring platform supporting multiple stocks with customizable price threshold alerts. Features a live dashboard and automated notification system.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Vercel Serverless Functions
- **Scheduled Tasks**: Vercel Cron
- **API Integration**: Alpha Vantage or Finnhub (free tier)

### Data Storage
- **Primary**: Vercel KV (Redis)
- **Alternative**: GitHub JSON files (if needed)

### Notifications
- **Primary**: GitHub Issues (automated)
- **Optional**: Email (SendGrid), Telegram Bot

### Deployment
- **Platform**: Vercel
- **CI/CD**: Automatic deployment on git push

---

## Phase 0: Prerequisites & Account Setup

Before starting development, complete all preparation steps:

### Accounts & Services

- [ ] **Register Vercel account**
  - Go to [vercel.com](https://vercel.com) and sign up
  - Use "Continue with GitHub" for authorization

- [ ] **Register Stock API account**
  - Option A: [Alpha Vantage](https://www.alphavantage.co/support/#api-key) - Get free API key
  - Option B: [Finnhub](https://finnhub.io/) - Register for free tier
  - Save your API key securely

- [ ] **Generate GitHub Personal Access Token**
  - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` scope (for creating issues)
  - Save the token securely

### Local Environment

- [ ] **Verify Node.js installation**
  - Run `node --version` (should be v18+)
  - Run `npm --version`

- [ ] **Install Node.js if needed**
  - Download from [nodejs.org](https://nodejs.org/) or use nvm

---

## Project Structure

```
stock-monitor/
├── app/
│   ├── page.tsx                    # Main dashboard
│   ├── layout.tsx                  # Root layout
│   └── api/
│       ├── check-stocks/
│       │   └── route.ts            # Cron endpoint
│       ├── price/
│       │   └── route.ts            # Get real-time price
│       └── history/
│           └── route.ts            # Get price history
├── lib/
│   ├── stock-api.ts                # Stock API wrapper
│   ├── notifications.ts            # Notification handlers
│   ├── storage.ts                  # Data storage layer
│   └── config.ts                   # Configuration
├── types/
│   └── index.ts                    # TypeScript type definitions
├── components/
│   ├── StockCard.tsx               # Individual stock card
│   ├── StockChart.tsx              # Price chart component
│   └── AlertBanner.tsx             # Alert notification banner
├── docs/
│   └── architecture.md             # This file
├── vercel.json                     # Vercel config (Cron)
├── .env.local                      # Environment variables
├── .env.example                    # Example env file
└── README.md                       # Project documentation
```

---

## Implementation Phases

### Phase 1: Project Setup

#### 1.1 Initialize Project

- [ ] Create Next.js project with TypeScript and Tailwind CSS
  - *Tell Claude Code to: "Initialize a new Next.js 14 project with TypeScript, Tailwind CSS, and App Router"*

- [ ] Install required dependencies (recharts, lucide-react, @vercel/kv)
  - *Tell Claude Code to: "Install the dependencies: recharts, lucide-react, and @vercel/kv"*

#### 1.2 Configuration Setup

- [ ] Create stock configuration file with stock symbols, names, and price thresholds
  - *Tell Claude Code to: "Create lib/config.ts with stock configuration for AMZN and AAPL including upper/lower thresholds"*

- [ ] Create TypeScript type definitions for stocks, alerts, and price data
  - *Tell Claude Code to: "Create types/index.ts with TypeScript interfaces for StockConfig, PriceData, and Alert"*

#### 1.3 Environment Variables

- [ ] Create .env.example file listing all required environment variables
  - *Tell Claude Code to: "Create .env.example with placeholders for ALPHA_VANTAGE_KEY, GITHUB_TOKEN, GITHUB_REPO, and Vercel KV variables"*

- [ ] Create local .env.local file with actual API keys
  - *Manually create .env.local and add your API keys (do not commit this file)*

---

### Phase 2: Core Functionality

#### 2.1 Stock API Integration

- [ ] Create stock API wrapper to fetch real-time prices
  - *Tell Claude Code to: "Create lib/stock-api.ts with functions to fetch stock prices from Alpha Vantage API"*

- [ ] Add support for fetching multiple stock prices
  - *Tell Claude Code to: "Add a function to fetch prices for multiple stocks with rate limiting"*

#### 2.2 Dashboard Implementation

- [ ] Create main dashboard page with stock cards grid
  - *Tell Claude Code to: "Create app/page.tsx as the main dashboard showing stock prices in a responsive grid"*

- [ ] Create StockCard component displaying price, thresholds, and status
  - *Tell Claude Code to: "Create components/StockCard.tsx showing stock name, current price, and buy/sell zone indicator"*

- [ ] Create StockChart component for price history visualization
  - *Tell Claude Code to: "Create components/StockChart.tsx using Recharts to display 24-hour price history"*

- [ ] Create AlertBanner component for threshold notifications
  - *Tell Claude Code to: "Create components/AlertBanner.tsx to show alerts when prices cross thresholds"*

- [ ] Implement client-side polling for real-time updates (5-second interval)
  - *Tell Claude Code to: "Add auto-refresh polling to the dashboard that updates prices every 5 seconds"*

#### 2.3 API Routes

- [ ] Create price API route to get current stock prices
  - *Tell Claude Code to: "Create app/api/price/route.ts to return current prices for requested stocks"*

- [ ] Create history API route to get price history data
  - *Tell Claude Code to: "Create app/api/history/route.ts to return price history for charts"*

#### 2.4 Cron Job for Monitoring

- [ ] Create check-stocks API route for scheduled price monitoring
  - *Tell Claude Code to: "Create app/api/check-stocks/route.ts that checks all enabled stocks and triggers alerts when thresholds are crossed"*

#### 2.5 Notification System

- [ ] Create notification handler for GitHub Issues
  - *Tell Claude Code to: "Create lib/notifications.ts with a function to create GitHub Issues when price alerts are triggered"*

- [ ] Format alert messages with stock info, price, and recommended action
  - *Tell Claude Code to: "Add formatted issue body with stock name, current price, threshold, and timestamp"*

---

### Phase 3: Data Storage

#### 3.1 Vercel KV Integration

- [ ] Create storage layer for price history using Vercel KV
  - *Tell Claude Code to: "Create lib/storage.ts with functions to save and retrieve price history using Vercel KV"*

- [ ] Implement data retention (keep last 1000 data points per stock)
  - *Tell Claude Code to: "Add automatic cleanup to remove old data points beyond 1000 entries"*

- [ ] Create function to get latest cached price
  - *Tell Claude Code to: "Add getLatestPrice function to retrieve the most recent price from storage"*

---

### Phase 4: Vercel Deployment

#### 4.1 Cron Configuration

- [ ] Create vercel.json with cron schedule (every 5 minutes)
  - *Tell Claude Code to: "Create vercel.json with cron configuration to run /api/check-stocks every 5 minutes"*

#### 4.2 Initial Deployment

- [ ] Initialize git repository and create initial commit
  - *Tell Claude Code to: "Initialize git repo and create initial commit"*

- [ ] Push to GitHub repository
  - *Manually: Create GitHub repo and push code*

- [ ] Connect repository to Vercel
  - *Manually: In Vercel dashboard, import the GitHub repository*

- [ ] Configure environment variables in Vercel
  - *Manually: Add all environment variables in Vercel Project Settings → Environment Variables*

- [ ] Create Vercel KV database and link to project
  - *Manually: In Vercel dashboard, go to Storage → Create KV Database → Link to project*

---

### Phase 5: Testing & Optimization

#### 5.1 Functional Testing

- [ ] Test dashboard loads and displays all enabled stocks
- [ ] Test prices update in real-time (every 5 seconds)
- [ ] Test cron job runs on schedule (check Vercel logs)
- [ ] Test GitHub Issues created when thresholds are met
- [ ] Test price history stored correctly
- [ ] Test charts render properly
- [ ] Test responsive design works on mobile

#### 5.2 Error Handling

- [ ] Add loading states and skeleton loaders
  - *Tell Claude Code to: "Add loading states and skeleton loaders to the dashboard"*

- [ ] Add error handling for API failures
  - *Tell Claude Code to: "Add error handling with user-friendly messages for API failures"*

- [ ] Add retry logic with exponential backoff
  - *Tell Claude Code to: "Add retry logic with exponential backoff for failed API requests"*

#### 5.3 Performance Optimization

- [ ] Implement client-side caching for stock prices
  - *Tell Claude Code to: "Add 30-second client-side cache for stock prices to reduce API calls"*

- [ ] Add request rate limiting to respect API limits
  - *Tell Claude Code to: "Add rate limiting to stay within Alpha Vantage limits (5 calls/min)"*

---

### Phase 6: Future Enhancements

#### Short-term
- [ ] Add more stocks (GOOGL, MSFT, TSLA)
- [ ] Add email notifications (SendGrid)
- [ ] Add Telegram bot integration
- [ ] Add custom threshold editor UI
- [ ] Add CSV export for price history

#### Medium-term
- [ ] Add user authentication (Clerk or NextAuth)
- [ ] Add personal watchlists
- [ ] Add price prediction / trend analysis
- [ ] Add PWA support

#### Long-term
- [ ] Multi-user support
- [ ] Trading recommendations
- [ ] Broker API integration
- [ ] Portfolio tracking
- [ ] Advanced charting (TradingView integration)

---

## API Rate Limits

### Alpha Vantage (Free Tier)
- **Rate**: 5 API requests per minute, 500 per day
- **Strategy**: With 5-minute cron, ~288 checks per day for 1 stock

### Finnhub (Free Tier)
- **Rate**: 60 API calls per minute
- **Strategy**: Better for real-time updates, multiple stocks

**Recommendation**: Start with Alpha Vantage, switch to Finnhub if needed.

---

## Time Estimate

| Phase | Tasks | Duration |
|-------|-------|----------|
| Phase 0 | Prerequisites & account setup | 30 minutes |
| Phase 1 | Project setup, configuration | 1-2 hours |
| Phase 2 | Core functionality development | 3-4 hours |
| Phase 3 | Data storage implementation | 1 hour |
| Phase 4 | Vercel deployment | 30 minutes |
| Phase 5 | Testing & optimization | 1 hour |
| **Total** | **Complete MVP** | **7-9 hours** |

---

## Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| Vercel Hosting | Hobby | $0/month |
| Vercel KV | Free | $0/month (256MB included) |
| Alpha Vantage API | Free | $0/month (500 calls/day) |
| GitHub Issues | Free | $0/month |
| **Total** | | **$0/month** |

---

## Success Metrics

### Technical Metrics
- **Uptime**: > 99.5%
- **Cron reliability**: > 95% on-time execution
- **API response time**: < 2 seconds
- **Dashboard load time**: < 3 seconds

### Product Metrics
- **Alert accuracy**: Correct threshold detection
- **Notification delivery**: < 1 minute delay
- **User engagement**: Dashboard visits, alert interactions

---

## Resources

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Alpha Vantage API](https://www.alphavantage.co/documentation/)

### Tools
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Last Updated**: 2026-02-04
**Status**: Implementation Guide
**Target Launch**: 3 days from start
