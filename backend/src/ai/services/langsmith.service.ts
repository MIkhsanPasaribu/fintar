import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "langsmith";
import { createAiConfig, AiConfig } from "../config/ai.config";

export interface TraceData {
  sessionId: string;
  userId: string;
  operation: string;
  input: any;
  output: any;
  metadata?: Record<string, any>;
  startTime: Date;
  endTime: Date;
  duration: number;
  success: boolean;
  error?: string;
}

export interface MetricsData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  errorRate: number;
  mostUsedOperations: { operation: string; count: number }[];
}

@Injectable()
export class LangSmithService {
  private readonly logger = new Logger(LangSmithService.name);
  private readonly config: AiConfig;
  private readonly client: Client | null = null;
  private readonly traces: TraceData[] = [];

  constructor(private configService: ConfigService) {
    this.config = createAiConfig(configService);

    if (this.config.langsmith.tracingEnabled && this.config.langsmith.apiKey) {
      try {
        this.client = new Client({
          apiKey: this.config.langsmith.apiKey,
        });

        // Set environment variables for LangSmith
        process.env.LANGCHAIN_TRACING_V2 = "true";
        process.env.LANGCHAIN_API_KEY = this.config.langsmith.apiKey;
        process.env.LANGCHAIN_PROJECT = this.config.langsmith.projectName;

        this.logger.log("LangSmith tracing initialized successfully");
      } catch (error) {
        this.logger.error("Failed to initialize LangSmith:", error);
        this.logger.warn("Continuing without LangSmith tracing");
      }
    } else {
      this.logger.log("LangSmith tracing disabled or API key not provided");
    }
  }

  /**
   * Start a new trace session
   */
  async startTrace(
    sessionId: string,
    userId: string,
    operation: string,
    input: any,
    metadata?: Record<string, any>
  ): Promise<string> {
    const traceId = `${sessionId}-${Date.now()}`;

    try {
      if (this.client) {
        // Create run in LangSmith
        await this.client.createRun({
          name: operation,
          run_type: "chain",
          inputs: { input, metadata },
          project_name: this.config.langsmith.projectName,
          extra: {
            sessionId,
            userId,
            timestamp: new Date().toISOString(),
            tags: ["fintar-ai", operation, `user:${userId}`],
          },
        });
      }

      // Store trace locally for backup
      const trace: TraceData = {
        sessionId,
        userId,
        operation,
        input,
        output: null,
        metadata,
        startTime: new Date(),
        endTime: new Date(),
        duration: 0,
        success: false,
      };

      this.traces.push(trace);
      this.logger.debug(`Started trace for operation: ${operation}`);

      return traceId;
    } catch (error) {
      this.logger.error(
        `Failed to start trace: ${error instanceof Error ? error.message : String(error)}`
      );
      return traceId; // Return ID anyway for fallback
    }
  }

  /**
   * End a trace session
   */
  async endTrace(
    traceId: string,
    output: any,
    success: boolean = true,
    error?: string
  ): Promise<void> {
    try {
      const trace = this.traces.find(
        (t) =>
          `${t.sessionId}-${t.startTime.getTime()}` ===
          traceId.split("-").slice(0, -1).join("-")
      );

      if (trace) {
        trace.output = output;
        trace.endTime = new Date();
        trace.duration = trace.endTime.getTime() - trace.startTime.getTime();
        trace.success = success;
        if (error) trace.error = error;

        if (this.client) {
          // Update run in LangSmith
          await this.client.updateRun(traceId, {
            outputs: { output, success, error },
            end_time: trace.endTime.toISOString(),
            error: error || undefined,
          });
        }

        this.logger.debug(
          `Ended trace ${traceId} - Success: ${success}, Duration: ${trace.duration}ms`
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to end trace: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Log an event during a trace
   */
  async logEvent(
    traceId: string,
    event: string,
    data: any,
    level: "info" | "warn" | "error" = "info"
  ): Promise<void> {
    try {
      if (this.client) {
        await this.client.createRun({
          name: event,
          run_type: "tool",
          inputs: { data },
          project_name: this.config.langsmith.projectName,
          extra: {
            traceId,
            timestamp: new Date().toISOString(),
            level,
            tags: ["fintar-ai", "event", level],
          },
        });
      }

      this.logger.log(
        `[${level.toUpperCase()}] ${event}: ${JSON.stringify(data)}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to log event: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get metrics for a specific time period
   */
  async getMetrics(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<MetricsData> {
    try {
      let filteredTraces = this.traces.filter(
        (trace) => trace.startTime >= startDate && trace.startTime <= endDate
      );

      if (userId) {
        filteredTraces = filteredTraces.filter(
          (trace) => trace.userId === userId
        );
      }

      const totalRequests = filteredTraces.length;
      const successfulRequests = filteredTraces.filter((t) => t.success).length;
      const failedRequests = totalRequests - successfulRequests;
      const averageResponseTime =
        filteredTraces.reduce((sum, t) => sum + t.duration, 0) /
          totalRequests || 0;
      const errorRate =
        totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;

      // Count operations
      const operationCounts = filteredTraces.reduce(
        (acc, trace) => {
          acc[trace.operation] = (acc[trace.operation] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const mostUsedOperations = Object.entries(operationCounts)
        .map(([operation, count]) => ({ operation, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalRequests,
        successfulRequests,
        failedRequests,
        averageResponseTime: Math.round(averageResponseTime),
        errorRate: Math.round(errorRate * 100) / 100,
        mostUsedOperations,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get metrics: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Get traces for a specific session
   */
  async getSessionTraces(sessionId: string): Promise<TraceData[]> {
    return this.traces.filter((trace) => trace.sessionId === sessionId);
  }

  /**
   * Clear old traces (older than specified days)
   */
  async clearOldTraces(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const initialCount = this.traces.length;
    const indicesToRemove: number[] = [];

    this.traces.forEach((trace, index) => {
      if (trace.startTime < cutoffDate) {
        indicesToRemove.push(index);
      }
    });

    // Remove from end to beginning to maintain indices
    for (let i = indicesToRemove.length - 1; i >= 0; i--) {
      this.traces.splice(indicesToRemove[i], 1);
    }

    const removedCount = initialCount - this.traces.length;
    this.logger.log(`Cleared ${removedCount} old traces`);

    return removedCount;
  }

  /**
   * Check if tracing is enabled
   */
  isTracingEnabled(): boolean {
    return this.config.langsmith.tracingEnabled && !!this.client;
  }

  /**
   * Get LangSmith client for advanced usage
   */
  getClient(): Client | null {
    return this.client;
  }
}
