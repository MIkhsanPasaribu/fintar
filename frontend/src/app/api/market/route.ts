import { NextRequest, NextResponse } from "next/server";

// Define interfaces
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number | null;
  peRatio?: number | null;
  dividendYield?: number | null;
  high52Week?: number | null;
  low52Week?: number | null;
  lastUpdate: string;
}

interface IndexData {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

// List of Indonesian stocks to monitor
const INDONESIAN_STOCKS = [
  "BBCA.JK", // Bank Central Asia
  "BBRI.JK", // Bank Rakyat Indonesia
  "BMRI.JK", // Bank Mandiri
  "BBNI.JK", // Bank Negara Indonesia
  "ASII.JK", // Astra International
  "UNVR.JK", // Unilever Indonesia
  "TLKM.JK", // Telkom Indonesia
  "GGRM.JK", // Gudang Garam
  "ICBP.JK", // Indofood CBP
  "KLBF.JK", // Kalbe Farma
];

// Market indices
const MARKET_INDICES = [
  "^JKSE", // Jakarta Composite Index
  "^GSPC", // S&P 500
  "^DJI", // Dow Jones
  "^IXIC", // NASDAQ
];

// Yahoo Finance API URLs
const YAHOO_FINANCE_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

// Helper function to get stock names
const getStockName = (symbol: string): string => {
  const stockNames: Record<string, string> = {
    "BBCA.JK": "Bank Central Asia",
    "BBRI.JK": "Bank Rakyat Indonesia",
    "BMRI.JK": "Bank Mandiri",
    "BBNI.JK": "Bank Negara Indonesia",
    "ASII.JK": "Astra International",
    "UNVR.JK": "Unilever Indonesia",
    "TLKM.JK": "Telkom Indonesia",
    "GGRM.JK": "Gudang Garam",
    "ICBP.JK": "Indofood CBP",
    "KLBF.JK": "Kalbe Farma",
  };
  return stockNames[symbol] || symbol;
};

// Helper function to get index names
const getIndexName = (symbol: string): string => {
  const indexNames: Record<string, string> = {
    "^JKSE": "Jakarta Composite Index",
    "^GSPC": "S&P 500",
    "^DJI": "Dow Jones Industrial",
    "^IXIC": "NASDAQ Composite",
  };
  return indexNames[symbol] || symbol;
};

// Fallback mock data for when Yahoo Finance is unavailable
const generateMockStockData = (symbol: string): StockData => {
  // Base prices for different stocks (in IDR)
  const basePrices: Record<string, number> = {
    "BBCA.JK": 8750,
    "BBRI.JK": 4520,
    "BMRI.JK": 5800,
    "BBNI.JK": 5200,
    "ASII.JK": 6800,
    "UNVR.JK": 3650,
    "TLKM.JK": 3100,
    "GGRM.JK": 52000,
    "ICBP.JK": 8900,
    "KLBF.JK": 1540,
  };

  const basePrice = basePrices[symbol] || Math.random() * 10000 + 1000;

  // Add some randomness (-3% to +3%)
  const variance = (Math.random() - 0.5) * 0.06;
  const currentPrice = basePrice * (1 + variance);

  const changePercent = variance * 100;
  const change = currentPrice - basePrice;

  // Generate realistic market cap (in billions IDR)
  const marketCapMultiplier: Record<string, number> = {
    "BBCA.JK": 1200000000000, // ~1.2T IDR
    "BBRI.JK": 800000000000, // ~800B IDR
    "BMRI.JK": 700000000000, // ~700B IDR
    "BBNI.JK": 400000000000, // ~400B IDR
    "ASII.JK": 300000000000, // ~300B IDR
    "UNVR.JK": 250000000000, // ~250B IDR
    "TLKM.JK": 200000000000, // ~200B IDR
    "GGRM.JK": 150000000000, // ~150B IDR
    "ICBP.JK": 120000000000, // ~120B IDR
    "KLBF.JK": 80000000000, // ~80B IDR
  };

  const baseMarketCap =
    marketCapMultiplier[symbol] || Math.random() * 100000000000 + 10000000000;

  return {
    symbol,
    name: getStockName(symbol),
    price: Number(currentPrice.toFixed(0)), // Remove decimals for IDR
    change: Number(change.toFixed(0)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 50000000) + 5000000, // 5M - 55M shares
    marketCap: Math.floor(baseMarketCap * (1 + variance)), // Market cap in IDR
    peRatio: Number((Math.random() * 20 + 8).toFixed(1)), // 8-28 P/E ratio
    dividendYield: Number((Math.random() * 6 + 1).toFixed(2)), // 1-7% dividend yield
    high52Week: Number((currentPrice * (1 + Math.random() * 0.5)).toFixed(0)), // Up to 50% higher
    low52Week: Number((currentPrice * (1 - Math.random() * 0.4)).toFixed(0)), // Up to 40% lower
    lastUpdate: new Date().toISOString(),
  };
};

// Mock data generator for indices
const generateMockIndexData = (symbol: string): IndexData => {
  const baseValues: Record<string, number> = {
    "^JKSE": 7200,
    "^GSPC": 4450,
    "^DJI": 35500,
    "^IXIC": 14800,
  };

  const baseValue = baseValues[symbol] || 5000;

  // Add some randomness (-2% to +2%)
  const variance = (Math.random() - 0.5) * 0.04;
  const currentValue = baseValue * (1 + variance);

  const changePercent = variance * 100;
  const change = currentValue - baseValue;

  return {
    symbol,
    name: getIndexName(symbol),
    value: Number(currentValue.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    lastUpdate: new Date().toISOString(),
  };
};

// Fetch real data from Yahoo Finance
async function fetchYahooFinanceData(
  symbol: string
): Promise<StockData | null> {
  try {
    const url = `${YAHOO_FINANCE_BASE}/${symbol}?range=1d&interval=1m&includePrePost=true&events=div%7Csplit`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.warn(`Yahoo Finance API error for ${symbol}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) {
      console.warn(`No data found for symbol ${symbol}`);
      return null;
    }

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];

    if (!meta || !quote) {
      console.warn(`Invalid data structure for symbol ${symbol}`);
      return null;
    }

    // Get the latest price data
    const closes = quote.close || [];
    const volumes = quote.volume || [];

    // Find the latest valid data point
    let latestIndex = closes.length - 1;
    while (
      latestIndex >= 0 &&
      (closes[latestIndex] === null || closes[latestIndex] === undefined)
    ) {
      latestIndex--;
    }

    if (latestIndex < 0) {
      console.warn(`No valid price data for symbol ${symbol}`);
      return null;
    }

    const currentPrice = closes[latestIndex];
    const previousClose =
      meta.previousClose || meta.chartPreviousClose || currentPrice;
    const change = currentPrice - previousClose;
    const changePercent =
      previousClose !== 0 ? (change / previousClose) * 100 : 0;

    // Calculate volume (get latest non-null volume)
    let volumeIndex = latestIndex;
    while (
      volumeIndex >= 0 &&
      (volumes[volumeIndex] === null || volumes[volumeIndex] === undefined)
    ) {
      volumeIndex--;
    }
    const volume = volumeIndex >= 0 ? volumes[volumeIndex] : 0;

    // Debug log for data inspection
    console.log(`📊 ${symbol} data:`, {
      price: currentPrice,
      marketCap: meta.marketCap,
      peRatio: meta.trailingPE,
      dividendYield: meta.dividendYield,
      volume: volume,
    });

    return {
      symbol,
      name: getStockName(symbol),
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: volume || 0,
      marketCap: meta.marketCap && meta.marketCap > 0 ? meta.marketCap : null,
      peRatio:
        meta.trailingPE && meta.trailingPE > 0
          ? Number(meta.trailingPE.toFixed(2))
          : null,
      dividendYield:
        meta.dividendYield && meta.dividendYield > 0
          ? Number((meta.dividendYield * 100).toFixed(2))
          : null,
      high52Week: meta.fiftyTwoWeekHigh || null,
      low52Week: meta.fiftyTwoWeekLow || null,
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

// Fetch index data
async function fetchIndexData(symbol: string): Promise<IndexData | null> {
  try {
    const url = `${YAHOO_FINANCE_BASE}/${symbol}?range=1d&interval=1m`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.warn(`Yahoo Finance API error for ${symbol}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) {
      console.warn(`No data found for index ${symbol}`);
      return null;
    }

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];

    if (!meta || !quote) {
      console.warn(`Invalid data structure for index ${symbol}`);
      return null;
    }

    const closes = quote.close || [];
    let latestIndex = closes.length - 1;
    while (
      latestIndex >= 0 &&
      (closes[latestIndex] === null || closes[latestIndex] === undefined)
    ) {
      latestIndex--;
    }

    if (latestIndex < 0) {
      console.warn(`No valid data for index ${symbol}`);
      return null;
    }

    const currentValue = closes[latestIndex];
    const previousClose =
      meta.previousClose || meta.chartPreviousClose || currentValue;
    const change = currentValue - previousClose;
    const changePercent =
      previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol,
      name: getIndexName(symbol),
      value: Number(currentValue.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching index data for ${symbol}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Market API called - fetching data...");

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const useMock = searchParams.get("mock") === "true";

    interface ApiResponse {
      lastUpdate: string;
      source: string;
      errors: string[];
      stocks?: unknown[];
      indices?: unknown[];
    }

    const response: ApiResponse = {
      lastUpdate: new Date().toISOString(),
      source: useMock ? "mock_data" : "yahoo_finance",
      errors: [],
    };

    if (type === "stocks" || type === "all") {
      console.log(`📊 Fetching stock data (${useMock ? "mock" : "real"})...`);

      if (useMock) {
        // Use mock data
        const stocks = INDONESIAN_STOCKS.map((symbol) =>
          generateMockStockData(symbol)
        );
        response.stocks = stocks;
        console.log(`✅ Generated ${stocks.length} mock stocks`);
      } else {
        // Try real data first, fallback to mock if failed
        const stockPromises = INDONESIAN_STOCKS.map((symbol) =>
          fetchYahooFinanceData(symbol)
        );
        const stockResults = await Promise.allSettled(stockPromises);

        const stocks: StockData[] = [];
        const errors: string[] = [];

        stockResults.forEach((result, index) => {
          const symbol = INDONESIAN_STOCKS[index];
          if (result.status === "fulfilled" && result.value) {
            stocks.push(result.value);
          } else {
            // Fallback to mock data for this stock
            stocks.push(generateMockStockData(symbol));
            errors.push(
              `${symbol}: Using mock data (Yahoo Finance unavailable)`
            );
          }
        });

        response.stocks = stocks;
        response.errors.push(...errors);

        console.log(
          `✅ Fetched ${stocks.length}/${INDONESIAN_STOCKS.length} stocks (${
            stocks.length - errors.length
          } real, ${errors.length} mock)`
        );
      }
    }

    if (type === "indices" || type === "all") {
      console.log(`📈 Fetching index data (${useMock ? "mock" : "real"})...`);

      if (useMock) {
        // Use mock data
        const indices = MARKET_INDICES.map((symbol) =>
          generateMockIndexData(symbol)
        );
        response.indices = indices;
        console.log(`✅ Generated ${indices.length} mock indices`);
      } else {
        // Try real data first, fallback to mock if failed
        const indexPromises = MARKET_INDICES.map((symbol) =>
          fetchIndexData(symbol)
        );
        const indexResults = await Promise.allSettled(indexPromises);

        const indices: IndexData[] = [];
        const errors: string[] = [];

        indexResults.forEach((result, index) => {
          const symbol = MARKET_INDICES[index];
          if (result.status === "fulfilled" && result.value) {
            indices.push(result.value);
          } else {
            // Fallback to mock data for this index
            indices.push(generateMockIndexData(symbol));
            errors.push(
              `${symbol}: Using mock data (Yahoo Finance unavailable)`
            );
          }
        });

        response.indices = indices;
        response.errors.push(...errors);

        console.log(
          `✅ Fetched ${indices.length}/${MARKET_INDICES.length} indices (${
            indices.length - errors.length
          } real, ${errors.length} mock)`
        );
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Market data API error:", error);

    // Return fallback mock data on complete failure
    const fallbackResponse = {
      lastUpdate: new Date().toISOString(),
      source: "fallback_mock",
      errors: ["API error, using fallback data"],
      stocks: INDONESIAN_STOCKS.map((symbol) => generateMockStockData(symbol)),
      indices: MARKET_INDICES.map((symbol) => generateMockIndexData(symbol)),
    };

    return NextResponse.json(fallbackResponse);
  }
}
