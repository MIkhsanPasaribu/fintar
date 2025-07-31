/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  fallback?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem("auth_token");

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      console.log(`🌐 API Request: ${endpoint}`, {
        method: options.method || "GET",
        headers: defaultHeaders,
        body: options.body ? JSON.parse(options.body as string) : undefined,
      });

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      console.log(`📡 API Response: ${endpoint}`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ API Error [${endpoint}]:`, {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`✅ API Success [${endpoint}]:`, data);
      return data;
    } catch (error) {
      console.error(`💥 API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post("/api/v1/auth/login", { email, password }),

  register: (userData: { email: string; password: string; name: string }) =>
    apiClient.post("/api/v1/auth/register", userData),

  logout: () => apiClient.post("/api/v1/auth/logout"),

  refreshToken: () => apiClient.post("/api/v1/auth/refresh"),

  forgotPassword: (email: string) =>
    apiClient.post("/api/v1/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/api/v1/auth/reset-password", { token, password }),
};

// Users API
export const usersApi = {
  getProfile: (userId: string) => apiClient.get(`/api/v1/users/${userId}`),

  updateProfile: (userId: string, profileData: any) =>
    apiClient.put(`/api/v1/users/${userId}`, profileData),

  getUserPreferences: (userId: string) =>
    apiClient.get(`/api/v1/users/${userId}/preferences`),

  updateUserPreferences: (userId: string, preferences: any) =>
    apiClient.put(`/api/v1/users/${userId}/preferences`, preferences),

  // User Profile API (new endpoints)
  createProfile: (profileData: any) =>
    apiClient.post("/api/v1/users/profile", profileData),

  getUserProfile: () => apiClient.get("/api/v1/users/profile"),

  updateUserProfile: (profileData: any) =>
    apiClient.patch("/api/v1/users/profile", profileData),

  deleteUserProfile: () => apiClient.delete("/api/v1/users/profile"),

  // Get current user info
  getCurrentUser: () => apiClient.get("/api/v1/users/me"),
};

// Consultants API
export const consultantApi = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    return apiClient.get(`/api/v1/consultants?${params.toString()}`);
  },

  getById: (id: string) => apiClient.get(`/api/v1/consultants/${id}`),

  getAvailability: (id: string, date: string) =>
    apiClient.get(`/api/v1/consultants/${id}/availability?date=${date}`),

  getReviews: (id: string) =>
    apiClient.get(`/api/v1/consultants/${id}/reviews`),
};

// Bookings API
export const bookingApi = {
  getAll: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : "";
    return apiClient.get(`/api/v1/bookings${params}`);
  },

  getById: (id: string) => apiClient.get(`/api/v1/bookings/${id}`),

  create: (bookingData: any) => apiClient.post("/api/v1/bookings", bookingData),

  update: (id: string, updateData: any) =>
    apiClient.put(`/api/v1/bookings/${id}`, updateData),

  cancel: (id: string) => apiClient.put(`/api/v1/bookings/${id}/cancel`),

  reschedule: (id: string, newDateTime: string) =>
    apiClient.put(`/api/v1/bookings/${id}/reschedule`, {
      scheduledAt: newDateTime,
    }),
};

// Financial API
export const financialApi = {
  getFinancialData: (userId: string) =>
    apiClient.get(`/api/v1/financial/users/${userId}/data`),

  addFinancialData: (userId: string, data: any) =>
    apiClient.post(`/api/v1/financial/users/${userId}/data`, data),

  updateFinancialData: (userId: string, dataId: string, data: any) =>
    apiClient.put(`/api/v1/financial/users/${userId}/data/${dataId}`, data),

  deleteFinancialData: (userId: string, dataId: string) =>
    apiClient.delete(`/api/v1/financial/users/${userId}/data/${dataId}`),

  getFinancialSummary: (userId: string) =>
    apiClient.get(`/api/v1/financial/users/${userId}/summary`),

  generateBudgetPlan: (userId: string, budgetData: any) =>
    apiClient.post(`/api/v1/financial/users/${userId}/budget-plan`, budgetData),
};

// AI Chat API
export const chatApi = {
  sendMessage: (data: {
    sessionId: string;
    message: string;
    userId: string;
    context?: any;
  }) => apiClient.post("/api/v1/ai/chat", data),

  getChatHistory: (sessionId: string, limit?: number) => {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/api/v1/ai/chat/history/${sessionId}${params}`);
  },

  getUserSessions: (userId: string) =>
    apiClient.get(`/api/v1/ai/chat/sessions/user/${userId}`),

  generateSession: () => apiClient.post("/api/v1/ai/session/generate"),

  clearSession: (sessionId: string) =>
    apiClient.delete(`/api/v1/ai/chat/session/${sessionId}`),

  getChatSummary: (sessionId: string) =>
    apiClient.get(`/api/v1/ai/chat/summary/${sessionId}`),
};

// AI Financial Analysis API
export const aiFinancialApi = {
  analyzeFinancialData: (analysisRequest: any) =>
    apiClient.post("/api/v1/ai/financial/analyze", analysisRequest),

  getFinancialAdvice: (adviceRequest: any) =>
    apiClient.post("/api/v1/ai/financial/advice", adviceRequest),

  analyzePortfolio: (portfolioData: any) =>
    apiClient.post("/api/v1/ai/financial/portfolio", portfolioData),

  assessRisk: (riskData: any) =>
    apiClient.post("/api/v1/ai/financial/risk", riskData),

  generateBudgetRecommendations: (budgetData: any) =>
    apiClient.post("/api/v1/ai/financial/budget", budgetData),
};

// AI Business Consultation API
export const aiConsultationApi = {
  getBusinessConsultation: (consultationRequest: any) =>
    apiClient.post("/api/v1/ai/consultation", consultationRequest),

  getIndustryInsights: (
    industryType: string,
    userId: string,
    sessionId: string
  ) =>
    apiClient.get(
      `/api/v1/ai/consultation/industry-insights/${industryType}?userId=${userId}&sessionId=${sessionId}`
    ),

  getStrategicAdvice: (adviceRequest: any) =>
    apiClient.post("/api/v1/ai/consultation/strategic-advice", adviceRequest),

  analyzeOperationalEfficiency: (analysisRequest: any) =>
    apiClient.post(
      "/api/v1/ai/consultation/operational-analysis",
      analysisRequest
    ),

  generateMarketAnalysis: (analysisRequest: any) =>
    apiClient.post("/api/v1/ai/consultation/market-analysis", analysisRequest),
};

// System API
export const systemApi = {
  getHealthStatus: () => apiClient.get("/api/v1/ai/health"),

  getCapabilities: () => apiClient.get("/api/v1/ai/capabilities"),

  getConfiguration: () => apiClient.get("/api/v1/ai/configuration"),

  getMetrics: (timeRange?: string) => {
    const params = timeRange ? `?timeRange=${timeRange}` : "";
    return apiClient.get(`/api/v1/ai/metrics${params}`);
  },
};

export default apiClient;
