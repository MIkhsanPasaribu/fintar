"use client";

import { motion } from "framer-motion";
import { AlertCircle, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { useMarketData } from "@/hooks/useMarketData";
import {
  MarketHeader,
  IndexCard,
  StockCard,
  SearchAndFilter,
} from "@/components/market/MarketComponents";

export default function MarketMonitoringPage() {
  const { stocks, indices, loading, error, lastRefresh, refreshData } =
    useMarketData();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Market Data
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const calculateMarketSummary = () => {
    const gainers = stocks.filter((stock) => stock.change > 0);
    const losers = stocks.filter((stock) => stock.change < 0);
    const avgChange =
      stocks.reduce((sum, stock) => sum + stock.changePercent, 0) /
      stocks.length;

    return {
      totalStocks: stocks.length,
      gainers: gainers.length,
      losers: losers.length,
      avgChange,
    };
  };

  const marketSummary = stocks.length > 0 ? calculateMarketSummary() : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <MarketHeader
          lastRefresh={lastRefresh}
          onRefresh={refreshData}
          loading={loading}
        />

        {/* Market Summary */}
        {marketSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Saham</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {marketSummary.totalStocks}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Naik</p>
                  <p className="text-2xl font-bold text-green-600">
                    {marketSummary.gainers}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turun</p>
                  <p className="text-2xl font-bold text-red-600">
                    {marketSummary.losers}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Change</p>
                  <p
                    className={`text-2xl font-bold ${
                      marketSummary.avgChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {marketSummary.avgChange.toFixed(2)}%
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    marketSummary.avgChange >= 0 ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  {marketSummary.avgChange >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Market Indices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📊 Indeks Pasar
          </h2>

          {loading && indices.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {indices.map((index, i) => (
                <IndexCard key={index.symbol} index={index} cardIndex={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Search and Filter */}
        <SearchAndFilter />

        {/* Indonesian Stocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🇮🇩 Saham Indonesia Populer
          </h2>

          {loading && stocks.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stocks.map((stock, i) => (
                <StockCard key={stock.symbol} stock={stock} index={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading Overlay */}
        {loading && (stocks.length > 0 || indices.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl p-4 border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-gray-700">
                Updating data...
              </span>
            </div>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="text-center">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Informasi Data Pasar
            </h3>
            <p className="text-blue-700 text-sm">
              Data harga saham diperbarui setiap 10 detik untuk demo. Dalam
              implementasi production, gunakan Yahoo Finance API atau data
              provider profesional. Data yang ditampilkan adalah simulasi untuk
              tujuan demonstrasi.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
