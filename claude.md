# Building with Claude

This project was built using human-AI collaboration with Claude (Anthropic) and Claude Code.

## Development Approach

### Tools Used
- **Claude (claude.ai)**: Project planning, architecture decisions, troubleshooting
- **Claude Code**: Code implementation, file creation, debugging
- **Human**: Product vision, requirements, testing, deployment

### Methodology

This project followed an **incremental, step-by-step approach**:

1. **Small iterations**: Each step took 5-30 minutes
2. **Immediate verification**: Test after every step before moving forward
3. **Learn from errors**: Document issues and solutions for future reference
4. **Practical over perfect**: Ship working software, iterate later

### Development Timeline

**Total Time**: ~12 hours over 1 day (2026-02-06)

- Phase 0-2: Setup and configuration (1.5 hours)
- Phase 3-5: Core functionality and dashboard (3 hours)
- Phase 6: Visual indicators and UX (1 hour)
- Phase 7-8: Data storage and charts (2 hours)
- Phase 9-10: Automation and notifications (2 hours)
- Phase 11: Polish and documentation (1.5 hours)

### Key Lessons Learned

**What Worked Well:**
- Breaking down complex tasks into small, verifiable steps
- Using mock data to bypass API rate limits during development
- Testing locally first, then deploying to Vercel
- Reading error messages carefully and addressing root causes
- Switching from Vercel Cron to GitHub Actions when hitting free tier limits

**Common Issues Encountered:**
- Alpha Vantage API rate limits (25 calls/day)
- Vercel Hobby plan cron limitations (1x/day only)
- Concurrent API requests triggering rate limits
- Local environment not having Vercel KV access
- TypeScript type mismatches between components

**Solutions Applied:**
- Mock data mode for development
- Sequential API calls with 1.5s delays
- GitHub Actions for flexible scheduling
- Proper error handling and user feedback
- Incremental type definitions and interfaces

### Collaboration Pattern
Human: "I want to monitor stock prices and get alerts"
↓
Claude: [Suggests architecture, tech stack, phases]
↓
Human: "Sounds good, let's start"
↓
Claude: [Provides step-by-step instructions]
↓
Claude Code: [Implements each step]
↓
Human: [Tests, reports issues]
↓
Claude: [Analyzes errors, provides fixes]
↓
Claude Code: [Applies fixes]
↓
Repeat until feature complete

### Best Practices for AI-Assisted Development

1. **Be specific with requirements**: "Monitor AMZN stock" vs "Monitor stocks"
2. **Verify each step**: Don't skip testing intermediate results
3. **Save working states**: Git commit after each successful phase
4. **Document issues**: Note errors and solutions for future reference
5. **Stay flexible**: Be ready to change approach when hitting limitations
6. **Use the right tool**: Claude for planning, Claude Code for implementation
7. **Test incrementally**: Local → Vercel → Production

### Project Structure Decisions

**Why Next.js?**
- Full-stack framework (frontend + API routes)
- Easy deployment on Vercel
- TypeScript support out of the box
- API routes = serverless functions (free tier friendly)

**Why GitHub Actions?**
- Vercel Hobby plan cron too limited
- GitHub Actions is free and flexible
- Can run during specific hours (market hours only)
- Easy to trigger manually for testing

**Why Upstash Redis?**
- Vercel's recommended KV solution
- Free tier sufficient (256MB, 10K commands/day)
- Sorted sets perfect for time-series price data
- Easy integration with Vercel

**Why GitHub Issues for alerts?**
- Free, unlimited
- Already using GitHub
- Good for personal projects
- Email notifications built-in (if enabled)
- Can add labels, close when acted upon

### Estimated Costs

**Current (all free tiers):**
- Vercel Hobby: $0/month
- GitHub Actions: $0/month (< 2000 min)
- Upstash Redis: $0/month (< 256MB)
- Alpha Vantage: $0/month (< 25 calls/day)
- **Total: $0/month**

**If scaling up:**
- Vercel Pro: $20/month (unlimited cron)
- Alpha Vantage Premium: $49/month (unlimited calls)
- Upstash paid tier: $10/month (if needed)
- **Total: ~$79/month** (only if heavily used)

### Future AI Collaboration Ideas

- Use Claude to suggest trading strategies based on historical data
- Generate natural language summaries of market conditions
- Automate technical analysis with AI assistance
- Create personalized alert thresholds based on portfolio

---

**Note**: This is a practice project built to learn full-stack development, serverless architecture, and human-AI collaboration workflows. The implementation prioritizes learning and rapid prototyping over production-grade features.
