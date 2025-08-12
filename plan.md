```markdown
# Stock Analytics App Implementation Plan

## 1. Dependency Installation
- **Task:** Install the unofficial Yahoo Finance library.
- **Change:** Run `npm install yahoo-finance2`.
- **File:** package.json (update dependencies)

## 2. Create Utility Library for Data Fetching
- **File:** src/lib/stock.ts
- **Changes/Steps:**
  - Import and initialize the `yahoo-finance2` library.
  - Create an asynchronous function `getStockQuote(symbol: string)` that:
    - Calls the library to retrieve the stock quote.
    - Uses try/catch blocks to handle errors and returns a standardized JSON object.
  - Create an asynchronous function `getStockNews(symbol: string)` that:
    - Uses the library’s news endpoint (e.g. `yahooFinance.news(symbol)`) to fetch recent news articles.
    - Handles errors and returns an array of news items with title, summary, date, and URL.

## 3. Create API Endpoint for Stock Data
- **File:** src/app/api/stock/[symbol]/route.ts
- **Changes/Steps:**
  - Define a GET route that extracts the stock symbol from route parameters.
  - Call both `getStockQuote` and `getStockNews` from the utility library.
  - Return a combined JSON response with stock quote data and news.
  - Implement robust error handling with a proper HTTP status (e.g. 500 for server errors).

## 4. Build the Stock Detail Page
- **File:** src/app/stock/[symbol]/page.tsx
- **Changes/Steps:**
  - Create a Next.js server component that retrieves the stock symbol from URL parameters.
  - Fetch stock data by either calling the API endpoint (via fetch) or directly using the utility functions.
  - Render a modern analytics dashboard using shadcn/ui components (e.g., Card, Typography):
    - Display key metrics such as current price, daily change, high/low.
    - Show a section for detailed news articles.
    - Include clear error and loading states.

## 5. Develop the Stock Search Component
- **File:** src/components/StockSearch.tsx
- **Changes/Steps:**
  - Create a client component with an input field and submit button (using shadcn/ui Input and Button).
  - Validate user input and, on submit, navigate to `/stock/[symbol]` using Next.js router.
  - Ensure proper accessibility and responsive layouts.

## 6. Create a Stock News List Component
- **File:** src/components/StockNews.tsx
- **Changes/Steps:**
  - Accept news items as props.
  - Render each news article in a styled card or list item, using plain typography and spacing.
  - Include title, brief summary, publication date, and a clickable link (open in a new tab) for each news item.

## 7. Update the Home Page
- **File:** src/app/page.tsx
- **Changes/Steps:**
  - Import and render the StockSearch component.
  - Provide brief instructions for users to search for stock symbols.
  - Ensure the page layout is clean, modern, and consistent with overall site styling.

## 8. UI/UX Considerations
- Use modern typography, ample spacing, and a clear visual hierarchy.
- Style all components with existing globals.css and shadcn/ui best practices.
- Provide graceful error messages and loading indicators.
- Do not include external icons or images; use text and layout styling only.

## 9. API Testing & Error Handling
- Create curl command examples for testing the API endpoint:
  - e.g., `curl http://localhost:3000/api/stock/AAPL`
- Verify HTTP status codes and response content.
- Ensure errors are logged and user-friendly error states are rendered on the UI.

---

**Summary:**
- Installed the unofficial `yahoo-finance2` library via npm.
- Created `src/lib/stock.ts` with functions to fetch stock quotes and news.
- Developed an API endpoint in `src/app/api/stock/[symbol]/route.ts` to combine and return data.
- Implemented a stock detail page in `src/app/stock/[symbol]/page.tsx` with modern UI using shadcn/ui.
- Built client components for stock search and listing news in `src/components/StockSearch.tsx` and `src/components/StockNews.tsx`.
- Updated the home page to integrate search functionality.
- Employed robust error handling, clear loading states, and responsive design practices.
