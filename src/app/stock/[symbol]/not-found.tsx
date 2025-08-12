import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Stock Not Found</CardTitle>
            <CardDescription>
              The stock symbol you're looking for doesn't exist or couldn't be found.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check the stock symbol and try again. Make sure it's a valid ticker symbol.
            </p>
            <Link href="/">
              <Button className="w-full">
                Back to Search
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
