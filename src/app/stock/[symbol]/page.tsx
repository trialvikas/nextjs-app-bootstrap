import { notFound } from 'next/navigation';
import { getStockData } from '@/lib/stock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockNews from '@/components/StockNews';
import TechnicalAnalysis from '@/components/TechnicalAnalysis';
import Link from 'next/link';

interface StockPageProps {
  params: Promise<{
    symbol: string;
  }>;
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  
  const stockData = await getStockData(symbol);

  if (!stockData.success || !stockData.quote) {
    notFound();
  }

  const { quote, news, technicalAnalysis } = stockData;

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return formatCurrency(value);
  };

  const isPositive = quote.regularMarketChange >= 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">{quote.longName}</h1>
          <p className="text-muted-foreground text-lg">
            {quote.symbol} • {quote.exchangeName}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline">Back to Search</Button>
        </Link>
      </div>

      {/* Price Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Current Price</CardTitle>
          <CardDescription>Real-time market data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-3xl font-bold">
                {formatCurrency(quote.regularMarketPrice, quote.currency)}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Change</p>
              <div className="flex items-center gap-2">
                <Badge variant={isPositive ? "default" : "destructive"}>
                  {isPositive ? '+' : ''}{formatCurrency(quote.regularMarketChange, quote.currency)}
                </Badge>
                <Badge variant={isPositive ? "default" : "destructive"}>
                  {isPositive ? '+' : ''}{quote.regularMarketChangePercent.toFixed(2)}%
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Day Range</p>
              <p className="text-lg font-semibold">
                {formatCurrency(quote.regularMarketDayLow, quote.currency)} - {formatCurrency(quote.regularMarketDayHigh, quote.currency)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Volume</p>
              <p className="text-lg font-semibold">
                {formatNumber(quote.regularMarketVolume)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Details</CardTitle>
            <CardDescription>Key market metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(quote.regularMarketOpen, quote.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previous Close</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(quote.regularMarketPreviousClose, quote.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Day High</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(quote.regularMarketDayHigh, quote.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Day Low</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(quote.regularMarketDayLow, quote.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Info</CardTitle>
            <CardDescription>Company overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="text-lg font-semibold">
                {quote.marketCap ? formatMarketCap(quote.marketCap) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="text-lg font-semibold">{quote.currency}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exchange</p>
              <p className="text-lg font-semibold">{quote.exchangeName}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Analysis and News Tabs */}
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="news">Latest News</TabsTrigger>
        </TabsList>
        <TabsContent value="technical" className="mt-6">
          {technicalAnalysis ? (
            <TechnicalAnalysis 
              technicalAnalysis={technicalAnalysis}
              currentPrice={quote.regularMarketPrice}
              currency={quote.currency}
            />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Technical analysis data is not available. This may be due to insufficient historical data.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="news" className="mt-6">
          <StockNews news={news} symbol={symbol} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export async function generateMetadata({ params }: StockPageProps) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  
  return {
    title: `${symbol} Stock Analysis | Stock Analytics`,
    description: `Real-time stock data, analysis, and news for ${symbol}`,
  };
}
