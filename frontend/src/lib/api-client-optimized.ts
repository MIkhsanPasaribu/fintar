/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
  fallback?: boolean;
}

export interface User {
  id: string;
  email: string;
  role: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  occupation?: string;
  incomeRange?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface FinancialData {
  id: string;
  userId: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  currentSavings?: number;
  currentDebt?: number;
  emergencyFundAmount?: number;
  riskTolerance?: "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";
  investmentExperience?: string;
  assets?: Record<string, any>;
  liabilities?: Record<string, any>;
  insurance?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  _id: string;
  sessionId: string;
  userId: string;
  title: string;
  type: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  sessionId: string;
  userId: string;
  type: "user" | "ai";
  content: string;
  aiMetadata?: Record<string, any>;
  timestamp: string;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: 15000, // Reduced from 30s to 15s
      headers: {
        "Content-Type": "application/json",
      },
      // Add performance optimizations
      maxRedirects: 3,
      validateStatus: (status) => status < 500, // Don't reject on 4xx errors
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timeout logging
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh and logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(
          `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
        );
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        console.log(
          `❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status || "Network Error"}`
        );

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  private getStoredRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
  }

  private storeTokens(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  private clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  }

  private handleAuthError() {
    this.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  private async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getStoredRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refreshToken },
          { timeout: 10000 } // Shorter timeout for refresh
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        this.storeTokens(accessToken, newRefreshToken);
        return accessToken;
      } catch (error) {
        this.clearTokens();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private handleError(error: any, defaultMessage: string): ApiResponse {
    console.error(`API Error: ${defaultMessage}`, error);

    let message = defaultMessage;
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status;
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        defaultMessage;
    } else if (error.request) {
      message = "Network error - please check your connection";
      statusCode = 0;
    } else if (error.code === "ECONNABORTED") {
      message = "Request timeout - server took too long to respond";
      statusCode = 408;
    }

    return {
      error: message,
      success: false,
      data: { statusCode },
    };
  }

  // Retry mechanism for critical operations
  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    maxRetries: number = 2,
    delay: number = 1000
  ): Promise<AxiosResponse<T>> {
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error: any) {
        lastError = error;

        // Don't retry on auth errors or client errors
        if (
          error.response?.status === 401 ||
          error.response?.status === 403 ||
          (error.response?.status >= 400 && error.response?.status < 500)
        ) {
          throw error;
        }

        if (i < maxRetries) {
          console.log(
            `🔄 Retrying request in ${delay}ms... (${i + 1}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  // Health check with fast timeout
  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get("/health", {
        timeout: 5000, // Fast timeout for health check
      });
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Health check failed");
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.retryRequest(() =>
        this.axiosInstance.post("/auth/register", data)
      );
      const authData = response.data;
      this.storeTokens(authData.accessToken, authData.refreshToken);
      return { data: authData, success: true };
    } catch (error) {
      return this.handleError(error, "Registration failed");
    }
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.retryRequest(() =>
        this.axiosInstance.post("/auth/login", data)
      );
      const authData = response.data;
      this.storeTokens(authData.accessToken, authData.refreshToken);
      return { data: authData, success: true };
    } catch (error) {
      return this.handleError(error, "Login failed");
    }
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  // User endpoints - Fixed double prefix
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await this.axiosInstance.get("/users/profile");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get user profile");
    }
  }

  async updateUserProfile(
    data: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await this.axiosInstance.patch("/users/profile", data);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to update user profile");
    }
  }

  // Financial endpoints
  async getFinancialData(): Promise<ApiResponse<FinancialData>> {
    try {
      const response = await this.axiosInstance.get("/financial/data");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get financial data");
    }
  }

  async updateFinancialData(
    data: Partial<FinancialData>
  ): Promise<ApiResponse<FinancialData>> {
    try {
      const response = await this.axiosInstance.patch("/financial/data", data);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to update financial data");
    }
  }

  // Chat endpoints with optimizations
  async createChatSession(data: {
    type: string;
    title?: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<ChatSession>> {
    try {
      const response = await this.retryRequest(() =>
        this.axiosInstance.post("/chat/sessions", data)
      );
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to create chat session");
    }
  }

  async getChatSessions(): Promise<ApiResponse<ChatSession[]>> {
    try {
      const response = await this.axiosInstance.get("/chat/sessions");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get chat sessions");
    }
  }

  async getChatHistory(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const response = await this.axiosInstance.get(
        `/chat/sessions/${sessionId}/messages`
      );
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get chat history");
    }
  }

  async sendChatMessage(
    sessionId: string,
    content: string
  ): Promise<ApiResponse> {
    try {
      // Longer timeout for AI chat responses
      const response = await this.axiosInstance.post(
        `/chat/sessions/${sessionId}/messages`,
        { content },
        { timeout: 30000 } // 30s for AI responses
      );
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to send message");
    }
  }

  // Consultants endpoints
  async getConsultants(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get("/consultants");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get consultants");
    }
  }

  // Bookings endpoints
  async createBooking(data: any): Promise<ApiResponse> {
    try {
      const response = await this.retryRequest(() =>
        this.axiosInstance.post("/bookings", data)
      );
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to create booking");
    }
  }

  async getUserBookings(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get("/bookings");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get bookings");
    }
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
