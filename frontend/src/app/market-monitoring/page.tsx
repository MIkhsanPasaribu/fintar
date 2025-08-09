"use client";

import { useState } from "react";
import { useMarketData } from "@/hooks/useMarketData";
import { StockCard, IndexCard } from "@/components/market/MarketComponents";
import { IHSGHeroChart } from "@/components/market/IHSGChart";
import { Card, Button } from "@/components/ui";
import {
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function MarketMonitoringPage() {
  const { stocks, indices, loading, error, lastRefresh, refreshData } =
    useMarketData();
  const [refreshing, setRefreshing] = useState(false);

  // Find IHSG data from indices
  const ihsgData = indices.find((index) => index.symbol === "^JKSE") || {
    symbol: "^JKSE",
    name: "Jakarta Composite Index",
    value: 7234.56,
    change: 45.23,
    changePercent: 0.63,
    lastUpdate: new Date().toISOString(),
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const formatLastUpdate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-body flex items-center gap-3">
              <TrendingUp className="text-primary" />
              Pemantauan Harga Pasar
            </h1>
            <p className="text-text-subtitle mt-2">
              Data real-time dari Yahoo Finance untuk saham Indonesia dan indeks
              global
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Real Data Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-success-50 border border-success-200 rounded-lg">
              <Wifi className="w-4 h-4 text-success-600" />
              <span className="text-sm font-medium text-success-700">
                Data Real Yahoo Finance
              </span>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Memperbarui..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Last Update Info */}
        <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-primary-700">
              Terakhir diperbarui: {formatLastUpdate(lastRefresh)}
            </span>
          </div>
          <div className="text-sm text-primary-600">
            Auto-refresh setiap 30 detik
          </div>
        </div>

        {/* IHSG Hero Chart */}
        <IHSGHeroChart
          currentValue={ihsgData.value}
          change={ihsgData.change}
          changePercent={ihsgData.changePercent}
          lastUpdate={formatLastUpdate(lastRefresh)}
        />

        {/* Error State */}
        {error && (
          <Card className="border-danger-200 bg-danger-50">
            <div className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-danger-600" />
              <div>
                <h3 className="font-medium text-danger-800">
                  Gagal memuat data pasar
                </h3>
                <p className="text-sm text-danger-700 mt-1">{error}</p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && !stocks.length && !indices.length && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-text-subtitle">
                Memuat data pasar dari Yahoo Finance...
              </p>
            </div>
          </div>
        )}

        {/* Market Summary */}
        {(stocks.length > 0 || indices.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-subtitle">Total Saham</p>
                  <p className="text-2xl font-bold text-text-body">
                    {stocks.length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-subtitle">Saham Naik</p>
                  <p className="text-2xl font-bold text-success">
                    {stocks.filter((s) => s.change > 0).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-subtitle">Saham Turun</p>
                  <p className="text-2xl font-bold text-danger">
                    {stocks.filter((s) => s.change < 0).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-danger rotate-180" />
              </div>
            </Card>
          </div>
        )}

        {/* Market Indices */}
        {indices.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-body">
              Indeks Pasar Global
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {indices.map((index, idx) => (
                <IndexCard key={index.symbol} index={index} cardIndex={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Indonesian Stocks */}
        {stocks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-body">
              Saham Unggulan Indonesia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stocks.map((stock, idx) => (
                <StockCard key={stock.symbol} stock={stock} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && stocks.length === 0 && indices.length === 0 && (
          <Card className="text-center py-12">
            <WifiOff className="w-12 h-12 text-text-metadata mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-body mb-2">
              Tidak ada data tersedia
            </h3>
            <p className="text-text-subtitle mb-4">
              Tidak dapat mengambil data dari Yahoo Finance saat ini.
            </p>
            <Button onClick={handleRefresh} variant="default">
              Coba Muat Ulang
            </Button>
          </Card>
        )}

        {/* Data Source Info */}
        <Card className="bg-accent-50 border-accent-200">
          <div className="p-4">
            <h3 className="font-medium text-accent-800 mb-2">
              📊 Informasi Sumber Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-accent-700">
              <div>
                <strong>Saham Indonesia:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>BBCA.JK (Bank Central Asia)</li>
                  <li>BBRI.JK (Bank Rakyat Indonesia)</li>
                  <li>BMRI.JK (Bank Mandiri)</li>
                  <li>TLKM.JK (Telkom Indonesia)</li>
                  <li>Dan 6 saham lainnya</li>
                </ul>
              </div>
              <div>
                <strong>Indeks Global:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>^JKSE (Jakarta Composite)</li>
                  <li>^GSPC (S&P 500)</li>
                  <li>^DJI (Dow Jones)</li>
                  <li>^IXIC (NASDAQ)</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-accent-600 mt-3">
              Data disediakan oleh Yahoo Finance. Harga mungkin tertunda 15-20
              menit.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
