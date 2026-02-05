import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API works',
    timestamp: Date.now(),
    hasApiKey: !!process.env.ALPHA_VANTAGE_KEY,
    hasGithubToken: !!process.env.GITHUB_TOKEN,
  });
}
