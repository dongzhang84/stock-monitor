# Stock Monitor - Step-by-Step Implementation Guide

## Overview

A real-time stock monitoring system with automated alerts. Built with Next.js, deployed on Vercel, using incremental development approach.

**Philosophy**: Build in small steps, verify each step works before moving on.

---

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Vercel Serverless Functions + Cron
- **Data**: Vercel KV (Redis)
- **Notifications**: GitHub Issues
- **API**: Alpha Vantage (free tier)
- **Deployment**: Vercel

**Total Cost**: $0/month

---

## Phase 0: Preparation (30 minutes)

Before writing any code, set up all accounts and get credentials.

### Step 0.1: Vercel Account
**Goal**: Get a Vercel account ready for deployment

**Actions**:
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

**Verify**:
- You can see Vercel dashboard
- Your GitHub account is connected

---

### Step 0.2: Stock API Account
**Goal**: Get API key for fetching stock prices

**Actions**:
1. Go to https://www.alphavantage.co/support/#api-key
2. Enter your email
3. Click "GET FREE API KEY"
4. Copy and save the API key (you'll need it later)

**Verify**:
- You have an API key that looks like: `ABC123XYZ456`
- Test it: Visit `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AMZN&apikey=YOUR_KEY`
- You should see JSON data with Amazon stock price

**Note**: Free tier = 25 API calls per day, 5 per minute

---

### Step 0.3: GitHub Personal Access Token
**Goal**: Get token for creating GitHub Issues automatically

**Actions**:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "Stock Monitor Bot"
4. Select scope: ✅ `repo` (full control of private repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you can't see it again)

**Verify**:
- You have a token starting with `ghp_...`
- Save it securely

---

### Step 0.4: Local Environment
**Goal**: Ensure development tools are ready

**Actions**:
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

**Verify**:
- Node.js version is 18 or higher
- npm is installed

**If not installed**: Download from https://nodejs.org/

---

### Step 0.5: Git Configuration
**Goal**: Set up git with your identity

**Actions**:
```bash
git config --global user.name "your-username"
git config --global user.email "your-email@example.com"
```

**Verify**:
```bash
git config --global --list
```
- Shows your name and email

---

## Phase 1: Hello World (30 minutes)

Get a basic Next.js app running and deployed.

### Step 1.1: Create GitHub Repository
**Goal**: Create a home for your code

**Actions**:
1. Go to https://github.com/new
2. Repository name: `stock-monitor`
3. Description: `Real-time stock monitoring with alerts`
4. ✅ Public
5. ✅ Add a README file
6. Add .gitignore: Choose **Node**
7. License: MIT (optional)
8. Click "Create repository"

**Verify**:
- You can see your new repository
- It has a README.md and .gitignore

---

### Step 1.2: Clone Repository
**Goal**: Get the code on your local machine

**Actions**:
```bash
cd ~  # or wherever you keep projects
git clone https://github.com/YOUR_USERNAME/stock-monitor.git
cd stock-monitor
```

**Verify**:
```bash
ls -la
```
- You see `.git/`, `README.md`, `.gitignore`

---

### Step 1.3: Create Next.js Project
**Goal**: Initialize Next.js with TypeScript and Tailwind

**Action**: Tell Claude Code:
```
Create a Next.js 14 project in the current directory with these options:
- TypeScript: Yes
- ESLint: Yes  
- Tailwind CSS: Yes
- src/ directory: No
- App Router: Yes
- Import alias: No (use default @/*)

Don't create a new folder, use the current directory.
```

**Verify**:
```bash
npm run dev
```
- Open http://localhost:3000
- See Next.js welcome page
- No errors in terminal

**Stop the dev server**: Press `Ctrl+C`

---

### Step 1.4: Install Dependencies
**Goal**: Add packages we'll need

**Action**: Tell Claude Code:
```
Install these packages: recharts lucide-react
```

**Verify**:
```bash
cat package.json
```
- You see `recharts` and `lucide-react` in dependencies

---

### Step 1.5: Test Deployment to Vercel
**Goal**: Make sure deployment works before building features

**Actions**:
```bash
git add .
git commit -m "Initial Next.js setup"
git push
```

Then:
1. Go to https://vercel.com/new
2. Import your `stock-monitor` repository
3. Keep all defaults
4. Click "Deploy"

**Verify**:
- Wait for deployment (1-2 minutes)
- Click the generated URL (e.g., stock-monitor.vercel.app)
- See your Next.js welcome page
- It works!

---

## Phase 2: Configuration & Basic Structure (30 minutes)

Set up configuration and create basic file structure.

### Step 2.1: Create Stock Configuration
**Goal**: Define which stocks to monitor

**Action**: Tell Claude Code:
```
Create file lib/config.ts with:
- Interface StockConfig with: symbol, name, lowerThreshold, upperThreshold, enabled
- Export a STOCKS array with AMZN configured:
  - symbol: 'AMZN'
  - name: 'Amazon'  
  - lowerThreshold: 230
  - upperThreshold: 240
  - enabled: true
```

**Verify**:
```bash
cat lib/config.ts
```
- File exists
- Has STOCKS array exported
- No TypeScript errors when you run `npm run build`

---

### Step 2.2: Create Type Definitions
**Goal**: Define TypeScript types for our data

**Action**: Tell Claude Code:
```
Create file types/index.ts with these interfaces:
- StockConfig (symbol, name, lowerThreshold, upperThreshold, enabled)
- PriceData (symbol, price, timestamp)
- Alert (symbol, price, type: 'BUY' | 'SELL', timestamp)
```

**Verify**:
- File `types/index.ts` exists
- No TypeScript errors

---

### Step 2.3: Environment Variables Setup
**Goal**: Prepare for API keys

**Action**: Tell Claude Code:
```
Create .env.example file with these variables (placeholder values):
- ALPHA_VANTAGE_KEY=your_api_key_here
- GITHUB_TOKEN=your_token_here
- GITHUB_REPO=username/repo
- NEXT_PUBLIC_REFRESH_INTERVAL=5000
```

**Verify**:
- File `.env.example` exists

**Then manually**:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your real values:
- `ALPHA_VANTAGE_KEY`: paste your key from Step 0.2
- `GITHUB_TOKEN`: paste your token from Step 0.3
- `GITHUB_REPO`: `YOUR_USERNAME/stock-monitor`
- Keep `NEXT_PUBLIC_REFRESH_INTERVAL=5000`

**Verify**:
- `.env.local` has real values
- `.env.local` is in `.gitignore` (should not be committed)

---

### Step 2.4: Commit Progress
**Goal**: Save your work

**Actions**:
```bash
git add .
git commit -m "Add configuration and types"
git push
```

**Verify**:
- No errors
- Changes visible on GitHub

---

## Phase 3: Test API Route (15 minutes)

Create a simple test endpoint to verify API routes work.

### Step 3.1: Create Test API
**Goal**: Verify serverless functions work

**Action**: Tell Claude Code:
```
Create app/api/test/route.ts that:
- Exports a GET function
- Returns JSON: { message: "API works", timestamp: current timestamp }
```

**Verify**:
```bash
npm run dev
```
Visit http://localhost:3000/api/test
- See JSON response with message and timestamp

---

### Step 3.2: Test Reading Environment Variables
**Goal**: Verify env variables are accessible

**Action**: Tell Claude Code:
```
Modify app/api/test/route.ts to also return:
- hasApiKey: true if ALPHA_VANTAGE_KEY exists, false otherwise
- hasGithubToken: true if GITHUB_TOKEN exists, false otherwise
Don't return the actual values, just boolean indicators.
```

**Verify**:
Visit http://localhost:3000/api/test
- See `hasApiKey: true`
- See `hasGithubToken: true`

**If false**: Check your `.env.local` file

---

## Phase 4: Stock API Integration (45 minutes)

Connect to real stock price API and test it works.

### Step 4.1: Create Stock API Module
**Goal**: Fetch real stock prices

**Action**: Tell Claude Code:
```
Create lib/stock-api.ts with function fetchStockPrice(symbol: string):
- Use Alpha Vantage API endpoint: GLOBAL_QUOTE
- Read API key from process.env.ALPHA_VANTAGE_KEY
- Return the price as a number
- Handle errors with try/catch
- Add console.log for debugging
```

**Verify**:

First install dotenv:
```bash
npm install dotenv
```

Then tell Claude Code:
```
Create a test file test-stock-api.ts in the root that:
- import dotenv from 'dotenv';
- dotenv.config({ path: '.env.local' });
- Then import fetchStockPrice
- Call it with 'AMZN'
- Log the result
```

Run it:
```bash
npx tsx test-stock-api.ts
```

You should see Amazon's current stock price logged.

**Note**: You need dotenv to load .env.local when running test scripts directly with tsx.

**If error**: Check your API key in `.env.local`

**Clean up**:
```bash
rm test-stock-api.ts
```

#### Dotenv Configuration for Test Scripts

**Why is dotenv needed?** When you run scripts directly with `npx tsx`, Node.js does **not** automatically load `.env.local`. Next.js handles this for you during `npm run dev`, but standalone test scripts need explicit loading.

**Setup**:
```bash
npm install dotenv
```

**Usage in test scripts**:
```typescript
// IMPORTANT: dotenv must be imported and configured BEFORE any other imports
// that depend on environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Now import modules that use process.env
import { fetchStockPrice } from './lib/stock-api';
```

**When is this needed?**
- Test scripts run with `npx tsx test-file.ts` — **YES, needs dotenv**
- Next.js app via `npm run dev` — **NO, Next.js loads .env.local automatically**
- Vercel deployment — **NO, env vars are set in Vercel dashboard**

---

### Step 4.2: Create Price API Endpoint
**Goal**: Expose stock prices through API

**Action**: Tell Claude Code:
```
Create app/api/price/route.ts that:
- Accepts query parameter: symbol
- Uses fetchStockPrice to get the price
- Returns JSON: { symbol, price, timestamp }
- Handles errors and returns appropriate status codes
```

**Verify**:
```bash
npm run dev
```
Visit: http://localhost:3000/api/price?symbol=AMZN
- See current Amazon price
- See timestamp

Try different symbol: http://localhost:3000/api/price?symbol=AAPL
- Should work too

---

### Step 4.3: Commit Progress
**Goal**: Save working stock API integration

**Actions**:
```bash
git add .
git commit -m "Add stock price API integration"
git push
```

---

## Phase 5: Basic Dashboard (1 hour)

Create a simple dashboard that shows stock prices.

### Step 5.1: Clean Up Default Page
**Goal**: Remove Next.js boilerplate

**Action**: Tell Claude Code:
```
Replace app/page.tsx with a clean starting point:
- Remove all default Next.js content
- Create a simple page with title "Stock Monitor"
- Use Tailwind for basic styling
- Add a dark background and centered content
```

**Verify**:
```bash
npm run dev
```
Visit http://localhost:3000
- See "Stock Monitor" title
- Clean, empty page

---

### Step 5.2: Create Simple Stock Card
**Goal**: Display one stock's price

**Action**: Tell Claude Code:
```
Create components/StockCard.tsx that:
- Takes props: symbol, name, price
- Displays the stock name and symbol
- Displays the price with $ and 2 decimals
- Uses Tailwind for card styling (rounded border, padding, shadow)
```

**Verify**: Tell Claude Code:
```
Update app/page.tsx to:
- Import StockCard
- Display one StockCard with hardcoded data:
  - symbol: "AMZN"
  - name: "Amazon"
  - price: 235.50
```

Refresh browser:
- See a nice card showing Amazon stock info

---

### Step 5.3: Fetch Real Data
**Goal**: Show live stock price on dashboard

**Action**: Tell Claude Code:
```
Update app/page.tsx to:
- Be a client component ('use client')
- Use useState to store stock price
- Use useEffect to fetch price from /api/price?symbol=AMZN on mount
- Show "Loading..." while fetching
- Display StockCard with real data once loaded
```

**Verify**:
Refresh http://localhost:3000
- See "Loading..." briefly
- Then see StockCard with real current Amazon price

Refresh again:
- Price updates (might be same or slightly different)

**Common Issues:**

**Issue 1: API Rate Limit**
If you see "Loading..." forever and terminal shows:
`"Information": "Please consider spreading out your free API requests more sparingly (1 request per second)"`

**Solution**: Add useRef to prevent duplicate requests:
- Use useRef to track if fetch is in progress
- Check ref before fetching: `if (fetchingRef.current) return;`
- Set ref to true when starting, false when done
- This prevents React Strict Mode from causing duplicate API calls

**Issue 2: Undefined price error**
If you see: `"Cannot read properties of undefined (reading 'toFixed')"`

**Solution**: Add null check in StockCard component:
- Display price as: `{price ? \`$\{price.toFixed(2)}\` : 'Loading...'}`
- This handles the loading state properly

**Issue 3: 500 Internal Server Error**
Happens when Alpha Vantage rate limit is hit (max 1 request/second, 25/day).

**Solution**:
- Wait 1-2 minutes for API cooldown
- Restart dev server
- Refresh browser only once
- Later we'll add caching with Vercel KV to avoid this

---

### Step 5.4: Add Auto-Refresh (SKIP THIS STEP)

**Important: Skip this step for now!**

**Why skip:**
- Alpha Vantage free tier: only 25 API calls per day
- Auto-refresh every 5 seconds would use 17,280 calls per day
- This would quickly exhaust the API quota

**Better approach (coming in Phase 9):**
We'll implement smart monitoring that:
- Only runs during market hours (Mon-Fri, 9:30 AM - 4:00 PM ET)
- Checks every 30-60 minutes via Vercel Cron
- Stores prices in Vercel KV cache
- Frontend reads from cache (unlimited refreshes)
- Uses only 7-13 API calls per day

**For now:**
- Dashboard shows price on page load
- Manually refresh browser to update
- Or add a "Refresh" button (optional)

**Proceed directly to Step 5.5**

---

### Step 5.5: Display All Configured Stocks
**Goal**: Show all stocks from config

**Action**: Tell Claude Code:
```
Update app/page.tsx to:
- Import STOCKS from lib/config
- Filter to only enabled stocks
- Create a state object to hold prices for all stocks: Map<symbol, price>
- Fetch all enabled stocks' prices on mount and every 5 seconds
- Display a StockCard for each stock in a grid layout
```

**Verify**:
- See one card for AMZN (since it's the only enabled stock)
- All prices update every 5 seconds

#### Common Issue: API Rate Limit with Multiple Stocks

**Problem**: When you add multiple stocks (e.g., AMZN + AAPL), fetching them all at once sends concurrent requests. Alpha Vantage only allows 1 request per second on the free tier, so the second request often fails with a rate limit error.

**Symptoms**:
- First stock loads fine, second stock shows "Unable to fetch price"
- Terminal shows: `"Information": "Please consider spreading out your free API requests"`

**Solution**: Fetch stocks sequentially with a delay between requests:

```typescript
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPrices() {
  for (let i = 0; i < enabledStocks.length; i++) {
    const stock = enabledStocks[i];
    try {
      const res = await fetch(`/api/price?symbol=${stock.symbol}`);
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      setPrices((prev) => ({ ...prev, [stock.symbol]: data.price }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        [stock.symbol]: "Unable to fetch price",
      }));
    }
    // Wait 1.5s between requests (except after the last one)
    if (i < enabledStocks.length - 1) {
      await delay(1500);
    }
  }
}
```

**User experience**: Prices appear one by one as each stock loads. This is actually a nice progressive loading effect!

---

### Step 5.6: Commit Progress
**Goal**: Save working dashboard

**Actions**:
```bash
git add .
git commit -m "Add basic dashboard with real-time prices"
git push
```

**Verify**:
Visit your Vercel deployment URL:
- Should auto-deploy
- See your dashboard live on the internet
- Prices update every 5 seconds

---

## Stock Market Hours Optimization

**Key insight:** Stock prices only change during trading hours!

**US Stock Market Hours:**
- Regular: 9:30 AM - 4:00 PM ET (Monday - Friday)
- Pre-market: 4:00 AM - 9:30 AM ET
- After-hours: 4:00 PM - 8:00 PM ET

**Smart monitoring strategy (Phase 9):**

| Time Period | Action | API Calls |
|-------------|--------|-----------|
| Market hours (9:30 AM - 4:00 PM ET) | Check every 30 min | ~13/day |
| Pre-market & after-hours | Check every 60 min | ~8/day |
| Weekends & holidays | No checks | 0 |

**Benefits:**
- Stays well within Alpha Vantage free tier (25 calls/day)
- Only fetches when prices can actually change
- Vercel Cron handles scheduling automatically
- Frontend reads from KV cache (no API calls)

---

## Phase 6: Price Thresholds & Visual Indicators (45 minutes)

Add buy/sell zone indicators to the dashboard.

### Step 6.1: Add Threshold Display
**Goal**: Show thresholds on stock cards

**Action**: Tell Claude Code:
```
Update components/StockCard.tsx to:
- Accept additional props: lowerThreshold, upperThreshold
- Display thresholds below the price
- Show "Buy Zone: < $230" and "Sell Zone: > $240"
```

**Verify**:
- Each stock card shows thresholds

---

### Step 6.2: Add Status Indicator
**Goal**: Visual indicator for buy/hold/sell zones

**Action**: Tell Claude Code:
```
Update components/StockCard.tsx to:
- Calculate status based on price vs thresholds:
  - if price < lowerThreshold: 'BUY' (green background)
  - if price > upperThreshold: 'SELL' (orange/red background)
  - else: 'HOLD' (blue/gray background)
- Add colored badge/chip showing the status
- Add appropriate icon from lucide-react (TrendingDown for buy, TrendingUp for sell)
```

**Verify**:
- Stock card shows colored status badge
- Badge changes color based on price vs thresholds

**Test**: Temporarily change AMZN's thresholds in `lib/config.ts` to see different states:
- Set `lowerThreshold: 300` → should show BUY (green)
- Set `upperThreshold: 200` → should show SELL (orange)
- Reset to 230/240 for normal testing

---

### Step 6.3: Add Price Indicator Bar
**Goal**: Visual bar showing where price sits relative to thresholds

**Action**: Tell Claude Code:
```
Update components/StockCard.tsx to add a visual price range bar:
- Show a horizontal gradient bar (green → blue → orange)
- Add a marker showing current price position
- Range from lowerThreshold to upperThreshold
```

**Verify**:
- See a colored bar on each card
- Marker moves based on current price

---

### Step 6.4: Commit Progress
**Goal**: Save threshold visualization

**Actions**:
```bash
git add .
git commit -m "Add threshold indicators and visual status"
git push
```

---

## Handling API Rate Limits - Mock Data Mode

### Problem

Alpha Vantage free tier has strict limits:
- **25 requests per day** (resets at midnight Eastern Time)
- **1 request per second** maximum
- During active development, you'll burn through 25 calls very quickly
- Once exhausted, all API calls return rate limit errors until the next day

### Solution: Mock Data Mode

Create a mock data mode that returns realistic fake prices, allowing unlimited development and testing without touching the real API.

### Step-by-step Setup

**1. Create `lib/mock-data.ts`**:

```typescript
const basePrices: Record<string, number> = {
  AMZN: 210,
  AAPL: 275,
};

const ranges: Record<string, number> = {
  AMZN: 5,
  AAPL: 5,
};

export function getMockPrice(symbol: string): number {
  const base = basePrices[symbol] ?? 100;
  const range = ranges[symbol] ?? 5;
  const variation = (Math.random() - 0.5) * 2 * range;
  return parseFloat((base + variation).toFixed(2));
}
```

**2. Update `lib/stock-api.ts`** — add mock check at the top of `fetchStockPrice`:

```typescript
import { getMockPrice } from "./mock-data";

export async function fetchStockPrice(symbol: string): Promise<StockPriceResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    const price = getMockPrice(symbol);
    console.log(`[MOCK] Price for ${symbol}: $${price}`);
    return { price, rateLimited: false };
  }

  // ... rest of real API code unchanged
}
```

**3. Add to `.env.local`**:
```
USE_MOCK_DATA=true
```

### Switching Between Mock and Real API

| Mode | `.env.local` setting | When to use |
|------|---------------------|-------------|
| Mock | `USE_MOCK_DATA=true` | Development, testing UI, testing edge cases |
| Real | `USE_MOCK_DATA=false` (or remove the line) | Final testing, production |

### Tips

- **API quota resets daily at midnight ET** — if you've exhausted your quota, switch to mock mode and try real API again tomorrow
- **Test edge cases with mock data** — adjust `basePrices` in `mock-data.ts` to test BUY/SELL/HOLD states (e.g., set AMZN base to 220 to test below-threshold behavior)
- **Add new stocks to mock data** — when adding a stock to `lib/config.ts`, also add a realistic base price in `mock-data.ts`
- **Mock mode works everywhere** — locally with `npm run dev`, and even in Vercel if you set the env var there

### Benefits

- Unlimited testing during development
- Faster page loads (no network delay)
- Test all UI states (BUY/SELL/HOLD) by adjusting mock prices
- No risk of exhausting API quota before production
- Charts will show random price variations over time

---

## Phase 7: Data Storage with Vercel KV (1 hour)

Store price history for charts.

### Step 7.1: Enable Vercel KV
**Goal**: Create a KV database

**Note**: Vercel KV is now provided via the **Upstash Marketplace**. The setup flow has changed from the original Vercel-native KV.

**Actions**:
1. Go to your Vercel project dashboard
2. Go to **Storage** tab
3. Click **"Browse Storage"** or **"Marketplace"**
4. Find **"Upstash"** → select **"Upstash for Redis"**
5. Name it: `stock-monitor-kv`
6. **Region**: Select **Washington D.C. (East)** (recommended — closest to Vercel's default US East deployment)
7. **Plan**: Free tier (10,000 commands/day, 256MB storage — more than enough)
8. Click **"Create"**
9. Connect to your `stock-monitor` project when prompted

**Verify**:
- In Vercel dashboard, see KV database connected
- Environment variables automatically added: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`

**Redeploy**:
```bash
git commit --allow-empty -m "Trigger redeploy for KV env vars"
git push
```

---

### Step 7.2: Install KV Package
**Goal**: Add Vercel KV SDK

**Action**: Tell Claude Code:
```
Install @vercel/kv package
```

**Verify**:
```bash
cat package.json
```
- See `@vercel/kv` in dependencies

---

### Step 7.3: Create Storage Module
**Goal**: Functions to save/retrieve price history

**Action**: Tell Claude Code:
```
Create lib/storage.ts with functions:
- savePriceHistory(symbol, price): saves price with timestamp to Vercel KV
- getPriceHistory(symbol, hours=24): retrieves prices from last N hours
- getLatestPrice(symbol): gets most recent price

Use KV sorted sets with timestamp as score.
Keep last 1000 data points per stock.
```

**Verify**: Tell Claude Code:
```
Create test-storage.ts that:
- Saves a test price for AMZN
- Retrieves it
- Logs the result
```

**Important**: This test will only work in Vercel deployment, not locally (KV needs env vars from Vercel).

Just verify code compiles:
```bash
npm run build
```
- No TypeScript errors

**Clean up**:
```bash
rm test-storage.ts
```

---

### Step 7.4: Save Prices from API
**Goal**: Store every price we fetch

**Action**: Tell Claude Code:
```
Update app/api/price/route.ts to:
- After fetching price from stock API
- Call savePriceHistory(symbol, price)
- Then return the response as before
```

**Verify**: Deploy and test:
```bash
git add .
git commit -m "Add Vercel KV storage"
git push
```

Wait for deployment, then:
- Visit your Vercel app
- Let it run for a minute (prices will be saved every 5 seconds)
- In Vercel dashboard → Storage → your KV database → Data browser
- See keys like `price:AMZN` with data

---

## Phase 8: Price History Chart (1 hour)

Add charts showing 24-hour price history.

### Step 8.1: Create History API Endpoint
**Goal**: API to get price history

**Action**: Tell Claude Code:
```
Create app/api/history/route.ts that:
- Accepts query params: symbol, hours (default 24)
- Uses getPriceHistory from storage
- Returns array of {timestamp, price}
```

**Verify**:
After deployment, visit: `https://your-app.vercel.app/api/history?symbol=AMZN`
- See array of price data points
- If empty, wait a few minutes for data to accumulate

---

### Step 8.2: Create Chart Component
**Goal**: Visualize price history

**Action**: Tell Claude Code:
```
Create components/StockChart.tsx using Recharts:
- Props: symbol
- Fetch history from /api/history?symbol=XXX
- Show LineChart with:
  - X-axis: time
  - Y-axis: price
  - Line for price
  - Reference lines for upper/lower thresholds (dashed)
- Handle loading and empty states
```

**Verify**: Tell Claude Code:
```
Update components/StockCard.tsx to:
- Include StockChart below the price info
- Pass symbol prop to chart
```

Deploy and check:
```bash
git add .
git commit -m "Add price history chart"
git push
```

- See chart on each stock card
- If no data yet, chart shows "Loading..." or "No data"
- Wait 5-10 minutes for data to accumulate, then see actual chart

#### Ensure Chart is Added to StockCard

**Common issue**: Claude Code may create `components/StockChart.tsx` but forget to import and render it inside `StockCard.tsx`.

**Verify** the chart is wired up:
```bash
grep StockChart components/StockCard.tsx
```

**Expected output** (two lines):
```
import StockChart from "./StockChart";
        <StockChart
```

**If missing**, tell Claude Code:
```
Update components/StockCard.tsx to:
- Import StockChart from './StockChart'
- Add <StockChart symbol={symbol} lowerThreshold={lowerThreshold} upperThreshold={upperThreshold} /> at the bottom of the card
```

**Expected behavior**: Each stock card should now show a chart area at the bottom. Initially it will display "No historical data yet" — this is normal! Data accumulates as you visit the page.

---

## Data Accumulation Note

Charts need time to collect data points before they can display meaningful graphs.

**How data accumulates**:
- Each time the dashboard loads, it calls `/api/price` for each stock
- The price API saves each price to Vercel KV storage
- The chart fetches the last 24 hours of saved prices

**To build up chart data**:
1. Visit your dashboard 3-5 times over 5-10 minutes
2. Wait 1-2 minutes between visits to get distinct data points
3. Each visit adds one price point per stock

**In mock mode** (`USE_MOCK_DATA=true`):
- Each visit saves a slightly different random price
- Charts will show random variations — great for testing the chart UI
- You'll see the chart populate faster since there are no API rate limits

**With the real API**:
- Prices only change during US market hours (Mon-Fri, 9:30 AM - 4:00 PM ET)
- Outside market hours, you'll see a flat line (same price repeated)
- During market hours, you'll see actual price movements

**After Vercel Cron is set up (Phase 9)**:
- Prices are saved automatically every 5 minutes
- Charts will fill up without manual visits
- After 24 hours of cron running, you'll have ~288 data points per stock

---

## Phase 9: Automated Monitoring with Cron (1 hour)

Set up scheduled job to check prices and send alerts.

### Step 9.1: Create Check-Stocks Endpoint
**Goal**: Endpoint that checks all stocks and triggers alerts

**Action**: Tell Claude Code:
```
Create app/api/check-stocks/route.ts that:
- Gets all enabled stocks from config
- For each stock:
  - Fetch current price
  - Check if price < lowerThreshold or > upperThreshold
  - If threshold crossed, log it (we'll add notifications next)
  - Save price to history
- Return JSON summary: {checked: count, alerts: array}
```

**Verify**:
```bash
npm run dev
```
Visit http://localhost:3000/api/check-stocks
- See JSON response showing checked stocks
- Check console logs

---

### Step 9.2: Configure Vercel Cron
**Goal**: Run check-stocks automatically every 5 minutes

**Action**: Tell Claude Code:
```
Create vercel.json with cron configuration:
- Path: /api/check-stocks
- Schedule: */5 * * * * (every 5 minutes)
```

**Verify**:
```bash
cat vercel.json
```
- File exists with cron config

---

### Step 9.3: Deploy Cron
**Goal**: Activate scheduled job

**Actions**:
```bash
git add .
git commit -m "Add cron job for automated monitoring"
git push
```

Wait for deployment.

**Verify**:
1. Go to Vercel dashboard
2. Your project → Logs tab
3. Wait up to 5 minutes
4. See logs from `/api/check-stocks` appearing automatically
5. Logs show stocks being checked every 5 minutes

---

## Phase 10: GitHub Issue Notifications (1 hour)

Send alerts by creating GitHub Issues when thresholds are crossed.

### Step 10.1: Create Notification Module
**Goal**: Function to create GitHub Issues

**Action**: Tell Claude Code:
```
Create lib/notifications.ts with function createAlert:
- Parameters: stock (StockConfig), price (number), type ('BUY' | 'SELL')
- Create GitHub Issue via API:
  - Title: "🚨 [SYMBOL] Buy/Sell Signal: $XXX.XX"
  - Body: Stock name, current price, threshold, timestamp, recommendation
  - Labels: ['buy-signal' or 'sell-signal', symbol in lowercase]
- Use GITHUB_TOKEN and GITHUB_REPO from env
- Handle errors gracefully
```

**Verify**: Code compiles:
```bash
npm run build
```
- No errors

---

### Step 10.2: Integrate with Check-Stocks
**Goal**: Actually send alerts when thresholds are crossed

**Action**: Tell Claude Code:
```
Update app/api/check-stocks/route.ts to:
- When price < lowerThreshold: call createAlert(stock, price, 'BUY')
- When price > upperThreshold: call createAlert(stock, price, 'SELL')
- Add error handling so failed alerts don't crash the function
```

**Verify**:
Test locally first:
```bash
npm run dev
```
Visit http://localhost:3000/api/check-stocks
- Should work (might fail to create issue if env vars not set locally)

---

### Step 10.3: Test Alert Creation
**Goal**: Verify issues are actually created

**Action**: Temporarily modify thresholds to trigger an alert:

Edit `lib/config.ts`:
```typescript
lowerThreshold: 300,  // AMZN price is definitely below 300
```

```bash
git add .
git commit -m "Add GitHub issue notifications (test)"
git push
```

**Verify**:
1. Wait for deployment (1-2 minutes)
2. Wait up to 5 minutes for cron to run
3. Check your GitHub repository
4. Go to Issues tab
5. You should see a new issue created automatically!
6. Issue should have:
   - Title with stock symbol and price
   - Proper label (buy-signal)
   - Detailed body

**Reset thresholds** back to normal values:
```typescript
lowerThreshold: 230,
upperThreshold: 240,
```

```bash
git add .
git commit -m "Reset thresholds to normal values"
git push
```

---

### Step 10.4: Prevent Duplicate Alerts
**Goal**: Don't spam issues for same alert

**Action**: Tell Claude Code:
```
Update lib/storage.ts to add:
- saveAlertSent(symbol, type): marks that alert was sent
- wasAlertSent(symbol, type, withinHours=1): checks if alert already sent recently

Update app/api/check-stocks/route.ts to:
- Check wasAlertSent before creating alert
- Call saveAlertSent after creating alert
```

**Verify**: Deploy and monitor:
```bash
git add .
git commit -m "Add alert deduplication"
git push
```

- Trigger an alert (by adjusting thresholds temporarily)
- See one issue created
- Wait 5 minutes
- No duplicate issue created (if price still in alert zone)

---

## Phase 11: Polish & Testing (1 hour)

Add final touches and test everything.

### Step 11.1: Add Loading States
**Goal**: Better UX during data loading

**Action**: Tell Claude Code:
```
Update app/page.tsx to show:
- Skeleton loaders for cards while loading
- Error messages if fetch fails
- "Last updated" timestamp
```

**Verify**:
- Reload page, see smooth loading experience
- Turn off wifi, see error message

---

### Step 11.2: Add Error Handling
**Goal**: Graceful failure handling

**Action**: Tell Claude Code:
```
Add try-catch blocks and error handling to:
- lib/stock-api.ts: handle API failures
- app/api/price/route.ts: return proper error responses
- components/StockCard.tsx: show error state if price unavailable
```

**Verify**:
Test with invalid API key:
- Temporarily break ALPHA_VANTAGE_KEY in Vercel env vars
- Deploy, check app shows errors gracefully (not crashing)
- Fix API key

---

### Step 11.3: Add More Stocks
**Goal**: Monitor multiple stocks

**Action**: Edit `lib/config.ts` manually:
```typescript
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
    lowerThreshold: 220,
    upperThreshold: 230,
    enabled: true
  },
  {
    symbol: 'GOOGL',
    name: 'Google',
    lowerThreshold: 180,
    upperThreshold: 190,
    enabled: true
  }
];
```

```bash
git add .
git commit -m "Add AAPL and GOOGL monitoring"
git push
```

**Verify**:
- Dashboard shows 3 stock cards
- All update every 5 seconds
- Cron checks all 3 stocks

---

### Step 11.4: Update README
**Goal**: Document your project

**Action**: Tell Claude Code:
```
Update README.md with:
- Project description
- Features list
- Setup instructions (env vars needed)
- How to add more stocks
- How to deploy
- Screenshot (optional)
```

**Verify**:
```bash
cat README.md
```
- Comprehensive documentation

---

### Step 11.5: Final Commit
**Goal**: Finalize MVP

**Actions**:
```bash
git add .
git commit -m "Stock Monitor MVP complete"
git push
```

---

## Phase 12: Monitoring & Maintenance

### Daily Checklist
- [ ] Check Vercel logs for errors
- [ ] Verify cron is running (check logs every few hours)
- [ ] Check GitHub issues tab for alerts
- [ ] Verify prices are updating on dashboard

### Weekly Checklist
- [ ] Review alert accuracy
- [ ] Check API usage (Alpha Vantage limits)
- [ ] Check Vercel KV storage usage

### Monthly Checklist
- [ ] Update dependencies: `npm outdated`
- [ ] Review and close old GitHub issues
- [ ] Evaluate adding new features

---

## Success Metrics

**Technical**:
- ✅ Dashboard loads in < 3 seconds
- ✅ Prices update every 5 seconds
- ✅ Cron runs reliably (>95% on time)
- ✅ Alerts sent within 5 minutes of threshold cross

**Product**:
- ✅ Accurate price data
- ✅ No false alerts
- ✅ All enabled stocks monitored
- ✅ $0/month cost

---

## Troubleshooting

### Cron not running
- Check Vercel logs
- Verify vercel.json syntax
- Ensure route returns 200 status

### Prices not updating
- Check API key is valid
- Verify not hitting rate limits (5 calls/min)
- Check browser Network tab

### GitHub issues not created
- Verify GITHUB_TOKEN has `repo` scope
- Check GITHUB_REPO format: `username/repo`
- Check Vercel logs for errors

### Charts not showing
- Need to wait 5-10 minutes for data to accumulate
- Check KV database has data
- Verify history API returns data

---

## Total Time Estimate

| Phase | Time |
|-------|------|
| Phase 0: Preparation | 30 min |
| Phase 1: Hello World | 30 min |
| Phase 2: Configuration | 30 min |
| Phase 3: Test API | 15 min |
| Phase 4: Stock API | 45 min |
| Phase 5: Dashboard | 1 hour |
| Phase 6: Thresholds | 45 min |
| Phase 7: KV Storage | 1 hour |
| Phase 8: Charts | 1 hour |
| Phase 9: Cron | 1 hour |
| Phase 10: Notifications | 1 hour |
| Phase 11: Polish | 1 hour |
| **Total** | **~9 hours** |

With breaks and debugging, expect 2-3 days at 3-4 hours/day.

---

## Next Steps

After MVP is working, consider:
- [ ] Email notifications (SendGrid)
- [ ] Telegram bot integration
- [ ] Custom threshold editor UI
- [ ] More stocks
- [ ] Mobile app
- [ ] User authentication

---

**Last Updated**: 2026-02-06  
**Status**: Step-by-Step Implementation Guide  
**Philosophy**: Small steps, verify each step, ship working software

---

## Key Principles

1. **Work incrementally** - Each step takes 5-30 minutes
2. **Verify everything** - Don't move on until current step works
3. **Deploy often** - See your progress live
4. **Keep it simple** - Don't over-engineer
5. **Ship it** - Done is better than perfect
