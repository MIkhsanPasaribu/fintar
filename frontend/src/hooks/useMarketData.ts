import { useState, useEffect } from "react";

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  high52Week?: number;
  low52Week?: number;
  lastUpdate: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

// Popular Indonesian stocks
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

// Major global indices
const MARKET_INDICES = [
  "^JKSE", // Jakarta Composite Index
  "^GSPC", // S&P 500
  "^DJI", // Dow Jones
  "^IXIC", // NASDAQ
];

export const useMarketData = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use our API route instead of direct Yahoo Finance calls
      // Temporarily use mock=true to test formatting, change to mock=false for real data
      const response = await fetch("/api/market?type=all&mock=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || "Failed to fetch market data");
      }

      setStocks(data.stocks || []);
      setIndices(data.indices || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Market data fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch market data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Auto refresh every 30 seconds for real data
    // Real market data doesn't need to be updated too frequently
    const interval = setInterval(refreshData, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    stocks,
    indices,
    loading,
    error,
    lastRefresh,
    refreshData,
  };
};
