import yahooFinance from 'yahoo-finance2';
import { RSI, BollingerBands, EMA, SMA } from 'technicalindicators';

export interface StockQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketOpen: number;
  regularMarketPreviousClose: number;
  regularMarketVolume: number;
  marketCap: number;
  shortName: string;
  longName: string;
  currency: string;
  exchangeName: string;
}

export interface TechnicalAnalysis {
  rsi: number;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  ema20: number;
  ema90: number;
  sma20: number;
  sma90: number;
  trendAnalysis: {
    signal: 'BULL_RUN' | 'BEAR_MARKET' | 'SIDEWAYS' | 'NEUTRAL';
    description: string;
    strength: 'STRONG' | 'MODERATE' | 'WEAK';
  };
}

export interface HistoricalPrice {
  date: Date;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
}

export interface NewsItem {
  title: string;
  summary: string;
  publishedAt: string;
  url: string;
  source: string;
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const quote = await yahooFinance.quote(symbol);
    
    if (!quote) {
      return null;
    }

    return {
      symbol: quote.symbol || symbol,
      regularMarketPrice: quote.regularMarketPrice || 0,
      regularMarketChange: quote.regularMarketChange || 0,
      regularMarketChangePercent: quote.regularMarketChangePercent || 0,
      regularMarketDayHigh: quote.regularMarketDayHigh || 0,
      regularMarketDayLow: quote.regularMarketDayLow || 0,
      regularMarketOpen: quote.regularMarketOpen || 0,
      regularMarketPreviousClose: quote.regularMarketPreviousClose || 0,
      regularMarketVolume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      shortName: quote.shortName || symbol,
      longName: quote.longName || quote.shortName || symbol,
      currency: quote.currency || 'USD',
      exchangeName: quote.fullExchangeName || quote.exchange || 'Unknown'
    };
  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error);
    return null;
  }
}

export async function getStockNews(symbol: string): Promise<NewsItem[]> {
  try {
    const newsData = await yahooFinance.search(symbol, {
      newsCount: 10
    });

    if (!newsData.news || newsData.news.length === 0) {
      return [];
    }

    return newsData.news.map((item: any) => ({
      title: item.title || 'No title available',
      summary: item.summary || item.title || 'No summary available',
      publishedAt: item.providerPublishTime 
        ? new Date(item.providerPublishTime * 1000).toISOString()
        : new Date().toISOString(),
      url: item.link || '#',
      source: item.publisher || 'Unknown'
    }));
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    return [];
  }
}

export async function getHistoricalData(symbol: string, period: string = '6mo'): Promise<HistoricalPrice[]> {
  try {
    const queryOptions = {
      period1: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6 months ago
      period2: new Date(),
      interval: '1d' as const
    };

    const result = await yahooFinance.historical(symbol, queryOptions);
    
    return result.map(item => ({
      date: item.date,
      close: item.close || 0,
      high: item.high || 0,
      low: item.low || 0,
      open: item.open || 0,
      volume: item.volume || 0
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
}

export function calculateTechnicalAnalysis(historicalData: HistoricalPrice[], currentPrice: number): TechnicalAnalysis | null {
  if (historicalData.length < 90) {
    return null; // Need at least 90 days for 90-period moving averages
  }

  const closePrices = historicalData.map(d => d.close);
  const highPrices = historicalData.map(d => d.high);
  const lowPrices = historicalData.map(d => d.low);

  try {
    // Calculate RSI (14-period)
    const rsiValues = RSI.calculate({ values: closePrices, period: 14 });
    const currentRSI = rsiValues[rsiValues.length - 1] || 50;

    // Calculate Bollinger Bands (20-period, 2 standard deviations)
    const bbValues = BollingerBands.calculate({
      values: closePrices,
      period: 20,
      stdDev: 2
    });
    const currentBB = bbValues[bbValues.length - 1] || { upper: 0, middle: 0, lower: 0 };

    // Calculate EMAs
    const ema20Values = EMA.calculate({ values: closePrices, period: 20 });
    const ema90Values = EMA.calculate({ values: closePrices, period: 90 });
    const currentEMA20 = ema20Values[ema20Values.length - 1] || 0;
    const currentEMA90 = ema90Values[ema90Values.length - 1] || 0;

    // Calculate SMAs for additional reference
    const sma20Values = SMA.calculate({ values: closePrices, period: 20 });
    const sma90Values = SMA.calculate({ values: closePrices, period: 90 });
    const currentSMA20 = sma20Values[sma20Values.length - 1] || 0;
    const currentSMA90 = sma90Values[sma90Values.length - 1] || 0;

    // Trend Analysis Logic
    const trendAnalysis = analyzeTrend(currentRSI, currentPrice, currentBB, currentEMA20, currentEMA90);

    return {
      rsi: currentRSI,
      bollingerBands: {
        upper: currentBB.upper,
        middle: currentBB.middle,
        lower: currentBB.lower
      },
      ema20: currentEMA20,
      ema90: currentEMA90,
      sma20: currentSMA20,
      sma90: currentSMA90,
      trendAnalysis
    };
  } catch (error) {
    console.error('Error calculating technical analysis:', error);
    return null;
  }
}

function analyzeTrend(
  rsi: number,
  currentPrice: number,
  bollingerBands: { upper: number; middle: number; lower: number },
  ema20: number,
  ema90: number
) {
  // Bull Run Conditions: RSI > 60, Price > BB Middle, EMA20 > EMA90
  const isBullish = rsi > 60 && currentPrice > bollingerBands.middle && ema20 > ema90;
  
  // Bear Market Conditions: RSI < 40, Price < BB Middle, EMA20 < EMA90
  const isBearish = rsi < 40 && currentPrice < bollingerBands.middle && ema20 < ema90;
  
  // Strong signals
  const isStrongBull = rsi > 70 && currentPrice > bollingerBands.upper && ema20 > ema90 * 1.02;
  const isStrongBear = rsi < 30 && currentPrice < bollingerBands.lower && ema20 < ema90 * 0.98;

  if (isStrongBull) {
    return {
      signal: 'BULL_RUN' as const,
      description: 'Strong bullish momentum detected. RSI is overbought, price is above upper Bollinger Band, and short-term EMA is significantly above long-term EMA.',
      strength: 'STRONG' as const
    };
  } else if (isBullish) {
    return {
      signal: 'BULL_RUN' as const,
      description: 'Bullish trend confirmed. RSI above 60, price above Bollinger Band middle line, and 20 EMA above 90 EMA.',
      strength: 'MODERATE' as const
    };
  } else if (isStrongBear) {
    return {
      signal: 'BEAR_MARKET' as const,
      description: 'Strong bearish momentum detected. RSI is oversold, price is below lower Bollinger Band, and short-term EMA is significantly below long-term EMA.',
      strength: 'STRONG' as const
    };
  } else if (isBearish) {
    return {
      signal: 'BEAR_MARKET' as const,
      description: 'Bearish trend confirmed. RSI below 40, price below Bollinger Band middle line, and 20 EMA below 90 EMA.',
      strength: 'MODERATE' as const
    };
  } else if (rsi >= 45 && rsi <= 55 && Math.abs(ema20 - ema90) / ema90 < 0.02) {
    return {
      signal: 'SIDEWAYS' as const,
      description: 'Market is moving sideways. RSI is neutral, and moving averages are converging.',
      strength: 'WEAK' as const
    };
  } else {
    return {
      signal: 'NEUTRAL' as const,
      description: 'Mixed signals detected. Market direction is unclear based on current technical indicators.',
      strength: 'WEAK' as const
    };
  }
}

export async function getStockData(symbol: string) {
  try {
    const [quote, news, historicalData] = await Promise.all([
      getStockQuote(symbol),
      getStockNews(symbol),
      getHistoricalData(symbol)
    ]);

    let technicalAnalysis: TechnicalAnalysis | null = null;
    if (quote && historicalData.length > 0) {
      technicalAnalysis = calculateTechnicalAnalysis(historicalData, quote.regularMarketPrice);
    }

    return {
      quote,
      news,
      technicalAnalysis,
      success: true
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return {
      quote: null,
      news: [],
      technicalAnalysis: null,
      success: false,
      error: 'Failed to fetch stock data'
    };
  }
}
