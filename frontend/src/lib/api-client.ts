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
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
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
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

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
          {
            refreshToken,
          }
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

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get("/health");
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
      const response = await this.axiosInstance.post("/auth/register", data);
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
      const response = await this.axiosInstance.post("/auth/login", data);
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

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await this.axiosInstance.get("/api/v1/users/profile");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get user profile");
    }
  }

  async updateUserProfile(
    data: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await this.axiosInstance.put(
        "/api/v1/users/profile",
        data
      );
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to update profile");
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

  async saveFinancialData(
    data: Partial<FinancialData>
  ): Promise<ApiResponse<FinancialData>> {
    try {
      const response = await this.axiosInstance.post("/financial/data", data);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to save financial data");
    }
  }

  async getFinancialSummary(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get("/financial/summary");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get financial summary");
    }
  }

  async getInvestmentRecommendations(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(
        "/financial/investment/recommendations"
      );
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(
        error,
        "Failed to get investment recommendations"
      );
    }
  }

  // Chat endpoints
  async createChatSession(data: {
    title?: string;
    type?: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<ChatSession>> {
    try {
      const response = await this.axiosInstance.post("chat/sessions", data);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to create chat session");
    }
  }

  async getChatSessions(): Promise<ApiResponse<ChatSession[]>> {
    try {
      const response = await this.axiosInstance.get("chat/sessions");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get chat sessions");
    }
  }

  async getChatHistory(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const response = await this.axiosInstance.get(
        `chat/sessions/${sessionId}/messages`
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
      const response = await this.axiosInstance.post(
        `chat/sessions/${sessionId}/messages`,
        {
          content,
        }
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

  async getConsultant(id: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/consultants/${id}`);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get consultant");
    }
  }

  async createBooking(data: {
    consultantId: string;
    scheduledAt: string;
    service: string;
    duration?: number;
    notes?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(
        "/consultants/bookings",
        data
      );
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to create booking");
    }
  }

  async getUserBookings(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get("/consultants/bookings");
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error, "Failed to get bookings");
    }
  }

  private handleError(error: any, defaultMessage: string): ApiResponse {
    console.error("API Error:", error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      defaultMessage;

    return {
      error: message,
      success: false,
      fallback: false,
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export default instance for easy import
export default apiClient;
