# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-06

### Added
- Real-time stock price monitoring dashboard with dark theme UI
- Configurable price thresholds (buy/sell zones) for each stock
- Automatic GitHub Issue notifications when price thresholds are crossed
- 24-hour price history charts with Recharts
- Vercel KV (Upstash Redis) for price history storage
- GitHub Actions automated monitoring (every 30 minutes during market hours)
- Mock data mode for development and testing
- Progressive loading states with skeleton loaders
- Individual stock card error handling with retry functionality
- Support for multiple stocks (AMZN, AAPL initially)
- Responsive design for mobile and desktop
- API rate limiting protection (1.5s delay between requests)

### Technical Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Charts: Recharts with threshold reference lines
- Backend: Next.js API Routes (Vercel Serverless)
- Storage: Upstash Redis via Vercel KV integration
- Automation: GitHub Actions cron jobs
- Notifications: GitHub Issues API
- Stock Data: Alpha Vantage API (free tier)
- Deployment: Vercel (hobby plan)

### Features
- Zero cost operation using all free tiers
- Runs during US market hours only (Mon-Fri 10 AM-4 PM ET)
- Color-coded status indicators (BUY/HOLD/SELL)
- Visual price position markers on gradient bars
- Automatic price history accumulation
- Manual refresh capability

### Documentation
- Comprehensive README with setup instructions
- Step-by-step implementation guide
- Environment variable documentation
- Troubleshooting guide

## [Unreleased]

### Planned
- Email notifications (SendGrid integration)
- Telegram bot alerts
- Custom threshold editor UI
- More stock exchanges support
- Alert cooldown/deduplication
- User authentication
- Portfolio tracking
