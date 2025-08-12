"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Activity,
  DollarSign,
} from "lucide-react";
import { StockData, MarketIndex } from "@/hooks/useMarketData";

interface StockCardProps {
  stock: StockData;
  index: number;
}

interface IndexCardProps {
  index: MarketIndex;
  cardIndex: number;
}

interface MarketHeaderProps {
  lastRefresh: Date;
  onRefresh: () => void;
  loading: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, index }) => {
  const isPositive = stock.change >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatMarketCap = (value: number | null | undefined) => {
    if (!value || value === 0) return "N/A";
    return formatNumber(value);
  };

  const formatPeRatio = (value: number | null | undefined) => {
    if (!value || value === 0) return "N/A";
    return value.toFixed(1);
  };

  const formatDividendYield = (value: number | null | undefined) => {
    if (!value || value === 0) return "N/A";
    return `${value.toFixed(2)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
            {stock.symbol.replace(".JK", "")}
          </h3>
          <p className="text-sm text-gray-600 truncate max-w-[200px]">
            {stock.name}
          </p>
        </div>

        <div
          className={`p-2 rounded-lg ${
            isPositive ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(stock.price)}
          </div>
          <div
            className={`flex items-center space-x-2 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span className="font-medium">
              {isPositive ? "+" : ""}
              {formatCurrency(stock.change)}
            </span>
            <span className="text-sm">
              ({isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Volume</p>
            <p className="font-medium text-sm text-gray-900">
              {formatNumber(stock.volume)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Market Cap</p>
            <p className="font-medium text-sm text-gray-900">
              {formatMarketCap(stock.marketCap)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">P/E Ratio</p>
            <p className="font-medium text-sm text-gray-900">
              {formatPeRatio(stock.peRatio)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Dividend Yield</p>
            <p className="font-medium text-sm text-gray-900">
              {formatDividendYield(stock.dividendYield)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const IndexCard: React.FC<IndexCardProps> = ({ index, cardIndex }) => {
  const isPositive = index.change >= 0;

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: cardIndex * 0.1 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{index.name}</h3>
            <p className="text-sm text-gray-600">{index.symbol}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">
          {formatNumber(index.value)}
        </div>
        <div
          className={`flex items-center space-x-2 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          <span className="font-medium">
            {isPositive ? "+" : ""}
            {formatNumber(index.change)}
          </span>
          <span className="text-sm">
            ({isPositive ? "+" : ""}
            {index.changePercent.toFixed(2)}%)
          </span>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const MarketHeader: React.FC<MarketHeaderProps> = ({
  lastRefresh,
  onRefresh,
  loading,
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl font-bold mb-2">📈 Pemantauan Harga Pasar</h1>
          <p className="text-blue-100 text-lg">
            Monitor harga saham dan indeks pasar secara real-time
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium">Live Data</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Last update: {formatTime(lastRefresh)}
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const SearchAndFilter: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari saham atau indeks..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>

          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Semua Kategori</option>
            <option value="banking">Perbankan</option>
            <option value="consumer">Consumer Goods</option>
            <option value="telecom">Telekomunikasi</option>
            <option value="mining">Pertambangan</option>
          </select>
        </div>
      </div>
    </div>
  );
};
