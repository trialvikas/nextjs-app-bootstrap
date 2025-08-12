import { NextRequest, NextResponse } from 'next/server';
import { getStockData } from '@/lib/stock';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol: rawSymbol } = await params;
    const symbol = rawSymbol?.toUpperCase();
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    // Validate symbol format (basic validation)
    if (!/^[A-Z]{1,5}$/.test(symbol)) {
      return NextResponse.json(
        { error: 'Invalid stock symbol format' },
        { status: 400 }
      );
    }

    const stockData = await getStockData(symbol);

    if (!stockData.success) {
      return NextResponse.json(
        { error: stockData.error || 'Failed to fetch stock data' },
        { status: 500 }
      );
    }

    if (!stockData.quote) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        quote: stockData.quote,
        news: stockData.news,
        technicalAnalysis: stockData.technicalAnalysis
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
