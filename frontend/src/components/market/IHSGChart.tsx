"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card } from "@/components/ui";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface IHSGData {
  time: string;
  value: number;
  change: number;
  changePercent: number;
}

interface IHSGChartProps {
  currentValue: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

// Generate mock intraday data for IHSG
const generateIHSGData = (currentValue: number, change: number): IHSGData[] => {
  const data: IHSGData[] = [];
  const baseValue = currentValue - change;
  const totalPoints = 78; // Trading hours: 9:00-15:30 (6.5 hours * 12 points per hour)

  // Start time: 9:00 AM
  const startTime = new Date();
  startTime.setHours(9, 0, 0, 0);

  for (let i = 0; i < totalPoints; i++) {
    const time = new Date(startTime.getTime() + i * 5 * 60 * 1000); // Every 5 minutes
    const progress = i / (totalPoints - 1);

    // Create more realistic intraday movement patterns
    // Morning volatility (9:00-11:00)
    const morningVolatility =
      i < 24 ? Math.sin(progress * Math.PI * 8) * 0.003 : 0;
    // Pre-lunch consolidation (11:00-13:00)
    const lunchConsolidation = i >= 24 && i < 48 ? -0.001 : 0;
    // Afternoon trend (13:00-15:30)
    const afternoonTrend =
      i >= 48 ? Math.sin((progress - 0.6) * Math.PI * 3) * 0.002 : 0;

    // Overall daily trend
    const dailyTrend = progress * (change / baseValue);

    // Random market noise
    const marketNoise = (Math.random() - 0.5) * 0.0008;

    // Support and resistance levels
    const supportResistance = Math.sin(progress * Math.PI * 6) * 0.001;

    const totalMovement =
      dailyTrend +
      morningVolatility +
      lunchConsolidation +
      afternoonTrend +
      marketNoise +
      supportResistance;

    const value = baseValue * (1 + totalMovement);
    const pointChange = value - baseValue;
    const pointChangePercent = (pointChange / baseValue) * 100;

    data.push({
      time: time.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: Number(value.toFixed(2)),
      change: Number(pointChange.toFixed(2)),
      changePercent: Number(pointChangePercent.toFixed(2)),
    });
  }

  return data;
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: IHSGData;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-medium text-gray-900">{`Waktu: ${label}`}</p>
        <p className="text-lg font-bold text-primary">
          {`IHSG: ${data.value.toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        </p>
        <p
          className={`text-sm ${
            data.change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {`${data.change >= 0 ? "+" : ""}${data.change.toFixed(2)} (${
            data.changePercent >= 0 ? "+" : ""
          }${data.changePercent.toFixed(2)}%)`}
        </p>
      </div>
    );
  }
  return null;
};

export const IHSGHeroChart: React.FC<IHSGChartProps> = ({
  currentValue,
  change,
  changePercent,
  lastUpdate,
}) => {
  const chartData = useMemo(
    () => generateIHSGData(currentValue, change),
    [currentValue, change]
  );

  const isPositive = change >= 0;
  const gradientId = isPositive ? "colorPositive" : "colorNegative";
  const lineColor = isPositive ? "#00C853" : "#D32F2F";
  const areaColor = isPositive ? "#00C853" : "#D32F2F";

  // Show loading state if no valid data
  if (!currentValue || currentValue <= 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-2 border-primary/10">
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data IHSG...</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-2 border-primary/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  Indeks Harga Saham Gabungan (IHSG)
                </h2>
                {/* Market Status Indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">
                    Pasar Buka
                  </span>
                </div>
              </div>
              <p className="text-gray-600">
                Jakarta Composite Index • Bursa Efek Indonesia
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900">
              {currentValue.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div
              className={`flex items-center gap-2 text-lg font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change.toFixed(2)} ({isPositive ? "+" : ""}
                {changePercent.toFixed(2)}%)
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Update: {lastUpdate}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={areaColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={areaColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                tickFormatter={(time) => {
                  // Show only every 2 hours
                  const hour = parseInt(time.split(":")[0]);
                  const minute = parseInt(time.split(":")[1]);
                  if (minute === 0 && hour % 2 === 1) {
                    return time;
                  }
                  return "";
                }}
              />
              <YAxis
                domain={["dataMin - 20", "dataMax + 20"]}
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toFixed(0)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trading Session Info & Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">Sesi Trading</p>
            <p className="font-semibold text-gray-900">09:00 - 15:30</p>
            <p className="text-xs text-green-600">WIB • Aktif</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Pembukaan</p>
            <p className="font-semibold text-gray-900">
              {(currentValue - change + (Math.random() - 0.5) * 20).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Tertinggi</p>
            <p className="font-semibold text-gray-900">
              {(currentValue + Math.random() * 30 + 10).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Terendah</p>
            <p className="font-semibold text-gray-900">
              {(currentValue - Math.random() * 25 - 5).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Volume</p>
            <p className="font-semibold text-gray-900">
              {(Math.random() * 5 + 8).toFixed(1)}B
            </p>
            <p className="text-xs text-gray-500">shares</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Nilai Transaksi</p>
            <p className="font-semibold text-gray-900">
              Rp {(Math.random() * 4 + 9).toFixed(1)}T
            </p>
          </div>
        </div>

        {/* Additional Market Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Saham Naik</p>
                <p className="text-2xl font-bold text-green-800">
                  {Math.floor(Math.random() * 200 + 180)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Saham Turun</p>
                <p className="text-2xl font-bold text-red-800">
                  {Math.floor(Math.random() * 150 + 120)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Tidak Berubah</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.floor(Math.random() * 50 + 25)}
                </p>
              </div>
              <Activity className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
