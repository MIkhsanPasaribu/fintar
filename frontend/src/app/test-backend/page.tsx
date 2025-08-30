"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client-optimized";

export default function TestBackendPage() {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    message: string;
    timestamp: string;
    error?: string;
  }>({
    isConnected: false,
    message: "Testing...",
    timestamp: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Testing backend connection...");

      const response = await apiClient.healthCheck();

      if (response.success && response.data) {
        setStatus({
          isConnected: true,
          message: response.data.message || "Backend connected successfully",
          timestamp: response.data.timestamp || new Date().toISOString(),
        });
        console.log("✅ Backend connection successful:", response.data);
      } else {
        setStatus({
          isConnected: false,
          message: "Backend connection failed",
          timestamp: new Date().toISOString(),
          error: response.error,
        });
        console.log("❌ Backend connection failed:", response.error);
      }
    } catch (error) {
      console.error("❌ Backend test error:", error);
      setStatus({
        isConnected: false,
        message: "Connection test failed",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Backend Connection Test
        </h1>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isLoading
                    ? "bg-yellow-500"
                    : status.isConnected
                      ? "bg-green-500"
                      : "bg-red-500"
                }`}
              />
              <span
                className={`font-medium ${
                  status.isConnected ? "text-green-600" : "text-red-600"
                }`}
              >
                {isLoading
                  ? "Testing..."
                  : status.isConnected
                    ? "Connected"
                    : "Disconnected"}
              </span>
            </div>
          </div>

          <div>
            <span className="font-medium">Message:</span>
            <p className="text-sm text-gray-600 mt-1">{status.message}</p>
          </div>

          <div>
            <span className="font-medium">Timestamp:</span>
            <p className="text-sm text-gray-600 mt-1">{status.timestamp}</p>
          </div>

          {status.error && (
            <div>
              <span className="font-medium text-red-600">Error:</span>
              <p className="text-sm text-red-600 mt-1">{status.error}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Testing...
                </div>
              ) : (
                "Test Connection"
              )}
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>
              Backend URL:{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}
            </p>
            <p>Endpoint: /api/v1/health</p>
          </div>
        </div>
      </div>
    </div>
  );
}
