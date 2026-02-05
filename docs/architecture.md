# Stock Monitor - Architecture & Implementation Plan

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

### Phase 1: Project Setup (1-2 hours)

#### 1.1 Initialize Next.js Project
```bash
npx create-next-app@latest stock-monitor --typescript --tailwind --app
cd stock-monitor
npm install recharts lucide-react @vercel/kv
```

#### 1.2 Configuration Setup

**lib/config.ts**
```typescript
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
    enabled: true
  },
  {
    symbol: 'AAPL',
    name: 'Apple',
    lowerThreshold: 180,
    upperThreshold: 200,
    enabled: false  // Disabled by default
  }
  // Easy to add more stocks
];
```

#### 1.3 Environment Variables

**.env.example**
```
ALPHA_VANTAGE_KEY=your_api_key_here
GITHUB_TOKEN=your_github_token
GITHUB_REPO=username/stock-monitor
KV_REST_API_URL=auto_generated_by_vercel
KV_REST_API_TOKEN=auto_generated_by_vercel
```

---

### Phase 2: Core Functionality (3-4 hours)

#### 2.1 Stock API Integration

**lib/stock-api.ts**
```typescript
export async function fetchStockPrice(symbol: string): Promise<number> {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return parseFloat(data['Global Quote']['05. price']);
}

export async function fetchMultipleStocks(symbols: string[]): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  
  for (const symbol of symbols) {
    const price = await fetchStockPrice(symbol);
    prices.set(symbol, price);
  }
  
  return prices;
}
```

#### 2.2 Dashboard Implementation

**Features:**
- Real-time price display for all enabled stocks
- Auto-refresh every 5 seconds (client-side polling)
- Price history chart (last 24 hours)
- Visual status indicators (buy/hold/sell zones)
- Recent alerts list

**app/page.tsx**
- Fetch current prices on load
- Set up polling interval
- Display stock cards in grid layout
- Show alert banner when thresholds are met

#### 2.3 Cron Job for Monitoring

**app/api/check-stocks/route.ts**
```typescript
export async function GET() {
  const enabledStocks = STOCKS.filter(s => s.enabled);
  
  for (const stock of enabledStocks) {
    const price = await fetchStockPrice(stock.symbol);
    
    // Check thresholds
    if (price < stock.lowerThreshold) {
      await createAlert(stock, price, 'BUY');
    } else if (price > stock.upperThreshold) {
      await createAlert(stock, price, 'SELL');
    }
    
    // Save to history
    await savePriceHistory(stock.symbol, price);
  }
  
  return Response.json({ success: true, timestamp: Date.now() });
}
```

#### 2.4 Notification System

**lib/notifications.ts**
```typescript
export async function createAlert(
  stock: StockConfig,
  price: number,
  type: 'BUY' | 'SELL'
) {
  const emoji = type === 'BUY' ? '📉' : '📈';
  const action = type === 'BUY' ? 'Buy Signal' : 'Sell Signal';
  
  await createGitHubIssue({
    title: `${emoji} ${stock.symbol} ${action}: $${price.toFixed(2)}`,
    body: `
**Stock**: ${stock.name} (${stock.symbol})
**Current Price**: $${price.toFixed(2)}
**Threshold**: $${type === 'BUY' ? stock.lowerThreshold : stock.upperThreshold}
**Action**: Consider ${type === 'BUY' ? 'buying' : 'selling'}
**Time**: ${new Date().toISOString()}
    `,
    labels: [type === 'BUY' ? 'buy-signal' : 'sell-signal', stock.symbol.toLowerCase()]
  });
}

async function createGitHubIssue(params: {
  title: string;
  body: string;
  labels: string[];
}) {
  const [owner, repo] = process.env.GITHUB_REPO!.split('/');
  
  await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
}
```

---

### Phase 3: Data Storage (1 hour)

#### Option A: Vercel KV (Recommended)

**lib/storage.ts**
```typescript
import { kv } from '@vercel/kv';

export async function savePriceHistory(symbol: string, price: number) {
  const key = `price:${symbol}`;
  const timestamp = Date.now();
  
  // Store with timestamp as score
  await kv.zadd(key, {
    score: timestamp,
    member: JSON.stringify({ price, timestamp })
  });
  
  // Keep only last 1000 data points
  await kv.zremrangebyrank(key, 0, -1001);
}

export async function getPriceHistory(
  symbol: string,
  hours: number = 24
): Promise<Array<{ price: number; timestamp: number }>> {
  const key = `price:${symbol}`;
  const since = Date.now() - hours * 60 * 60 * 1000;
  
  const data = await kv.zrangebyscore(key, since, '+inf');
  
  return data.map(item => JSON.parse(item as string));
}

export async function getLatestPrice(symbol: string): Promise<number | null> {
  const history = await getPriceHistory(symbol, 1);
  return history.length > 0 ? history[history.length - 1].price : null;
}
```

**Advantages:**
- Fast read/write
- Built-in TTL support
- Free tier sufficient (256MB)
- No additional setup required

#### Option B: GitHub JSON Files

Store price history as JSON files in the repo. Suitable for smaller data volumes.

---

### Phase 4: Vercel Deployment (30 minutes)

#### 4.1 Cron Configuration

**vercel.json**
```json
{
  "crons": [
    {
      "path": "/api/check-stocks",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**Cron runs every 5 minutes** - adjust as needed.

#### 4.2 Environment Variables Setup

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from .env.example
3. Make sure to add for Production, Preview, and Development

#### 4.3 Deployment Process

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/username/stock-monitor.git
git branch -M main
git push -u origin main

# Vercel will auto-detect and deploy
# Or manually: vercel --prod
```

---

### Phase 5: Testing & Optimization (1 hour)

#### 5.1 Functional Testing Checklist

- [ ] Dashboard loads and displays all enabled stocks
- [ ] Prices update in real-time (every 5 seconds)
- [ ] Cron job runs on schedule (check Vercel logs)
- [ ] GitHub Issues created when thresholds are met
- [ ] Price history stored correctly
- [ ] Charts render properly
- [ ] Responsive design works on mobile

#### 5.2 Performance Optimization

**Loading States:**
- Add skeleton loaders for initial load
- Show loading spinner during refresh

**Error Handling:**
- Graceful API failure handling
- Retry logic with exponential backoff
- User-friendly error messages

**Caching Strategy:**
- Cache stock prices for 30 seconds client-side
- Use SWR or React Query for data fetching

**Rate Limiting:**
- Respect API rate limits (Alpha Vantage: 5 calls/min, 500 calls/day)
- Implement request queuing if needed

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

## Future Enhancements

### Phase 6: Additional Features

**Short-term (1-2 weeks):**
- [ ] Add more stocks (AAPL, GOOGL, MSFT, TSLA)
- [ ] Email notifications (SendGrid)
- [ ] Telegram bot integration
- [ ] Custom threshold editor (UI)
- [ ] Export price history as CSV

**Medium-term (1-2 months):**
- [ ] User authentication (Clerk or NextAuth)
- [ ] Personal watchlists
- [ ] Price prediction / trend analysis
- [ ] Mobile app (React Native)
- [ ] PWA support

**Long-term:**
- [ ] Multi-user support
- [ ] Trading recommendations
- [ ] Broker API integration (Robinhood, TD Ameritrade)
- [ ] Portfolio tracking
- [ ] Advanced charting (TradingView integration)

---

## Monitoring & Maintenance

### Logs & Debugging
- Monitor Vercel Function logs
- Track Cron job execution
- Set up error alerting (Sentry)

### Cost Monitoring
- Track Vercel usage (should stay in free tier)
- Monitor API quota usage
- Watch KV storage consumption

### Updates
- Weekly review of alert accuracy
- Monthly dependency updates
- Quarterly feature assessment

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

## Time Estimate

| Phase | Tasks | Duration |
|-------|-------|----------|
| Phase 1 | Project setup, configuration | 1-2 hours |
| Phase 2 | Core functionality development | 3-4 hours |
| Phase 3 | Data storage implementation | 1 hour |
| Phase 4 | Vercel deployment | 30 minutes |
| Phase 5 | Testing & optimization | 1 hour |
| **Total** | **Complete MVP** | **6-8 hours** |

---

## Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| Vercel Hosting | Hobby | $0/month |
| Vercel KV | Free | $0/month (256MB included) |
| Alpha Vantage API | Free | $0/month (500 calls/day) |
| GitHub Issues | Free | $0/month |
| **Total** | | **$0/month** 🎉 |

---

## Security Considerations

### Environment Variables
- Never commit .env.local to git
- Use Vercel environment variables for secrets
- Rotate GitHub token periodically

### API Keys
- Restrict API key permissions
- Monitor for unusual usage
- Set up usage alerts

### Rate Limiting
- Implement client-side rate limiting
- Add server-side request throttling
- Handle API quota exhaustion gracefully

---

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev

# Test cron endpoint manually
curl http://localhost:3000/api/check-stocks
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/stock-chart-improvements

# Make changes and commit
git add .
git commit -m "Improve chart responsiveness"

# Push and create PR
git push origin feature/stock-chart-improvements
```

### Deployment
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Auto-deploy to preview

---

## Troubleshooting

### Common Issues

**Issue**: Cron not running
- Check Vercel cron logs
- Verify vercel.json syntax
- Ensure API route returns 200 status

**Issue**: Stock prices not updating
- Verify API key is valid
- Check API rate limit
- Inspect network requests in browser

**Issue**: GitHub Issues not created
- Verify GitHub token permissions
- Check GITHUB_REPO environment variable
- Test notification endpoint manually

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

## License

MIT License - Feel free to use and modify for your own projects.

---

**Last Updated**: 2026-02-04  
**Status**: 🟡 Planning Phase  
**Target Launch**: 3 days from start
