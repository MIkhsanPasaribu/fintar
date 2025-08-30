"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/tombol";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

interface BackendStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  retryCount?: number;
}

export function BackendStatus({
  isConnected,
  isLoading,
  error,
  onRetry,
  retryCount = 0,
}: BackendStatusProps) {
  const getStatusColor = () => {
    if (isLoading) return "bg-yellow-500";
    if (isConnected) return "bg-green-500";
    return "bg-red-500";
  };

  const getStatusText = () => {
    if (isLoading) return "Connecting...";
    if (isConnected) return "Connected";
    return "Disconnected";
  };

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-3 w-3 animate-spin" />;
    if (isConnected) return <Wifi className="h-3 w-3" />;
    return <WifiOff className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-background border rounded-lg">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      <Badge
        variant={isConnected ? "default" : "destructive"}
        className="text-xs"
      >
        Backend API
      </Badge>

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}

      {!isConnected && onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isLoading}
          className="text-xs px-2 py-1 h-6"
        >
          {isLoading ? (
            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <RefreshCw className="h-3 w-3 mr-1" />
          )}
          Retry {retryCount > 0 && `(${retryCount})`}
        </Button>
      )}

      {isConnected && (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span>Ready</span>
        </div>
      )}
    </div>
  );
}

export default BackendStatus;
