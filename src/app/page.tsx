import StockSearch from '@/components/StockSearch';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Stock Analytics
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get real-time stock data, comprehensive analysis, and the latest news for any publicly traded company.
            </p>
          </div>

          {/* Search Component */}
          <StockSearch />

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">$</span>
              </div>
              <h3 className="text-xl font-semibold">Real-Time Data</h3>
              <p className="text-muted-foreground">
                Access up-to-date stock prices, market changes, and trading volumes from Yahoo Finance.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">📊</span>
              </div>
              <h3 className="text-xl font-semibold">Comprehensive Analysis</h3>
              <p className="text-muted-foreground">
                View detailed market metrics including day ranges, volume, market cap, and more.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">📰</span>
              </div>
              <h3 className="text-xl font-semibold">Latest News</h3>
              <p className="text-muted-foreground">
                Stay informed with the most recent news and updates related to your stocks.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  1
                </div>
                <p className="font-medium">Enter Stock Symbol</p>
                <p className="text-muted-foreground">
                  Type any valid stock ticker symbol (e.g., AAPL, GOOGL, TSLA)
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  2
                </div>
                <p className="font-medium">View Analytics</p>
                <p className="text-muted-foreground">
                  Get comprehensive stock data including price, changes, and market metrics
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  3
                </div>
                <p className="font-medium">Read Latest News</p>
                <p className="text-muted-foreground">
                  Stay updated with recent news and developments about the company
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
