import { useState, useEffect, useCallback } from "react";
import apiClient, { ApiResponse } from "@/lib/api-client-optimized";
import { useUser } from "./useUser";

export interface OptimizedChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  suggestions?: string[];
  messageType?: "text" | "financial_analysis" | "advice" | "error";
  isLoading?: boolean;
}

interface RawChatMessage {
  _id?: string;
  id?: string;
  content: string;
  type: "user" | "ai";
  timestamp: string;
  aiMetadata?: {
    messageType?: "text" | "financial_analysis" | "advice" | "error";
    suggestions?: string[];
  };
}

interface ChatState {
  messages: OptimizedChatMessage[];
  isLoading: boolean;
  sessionId: string;
  error: string | null;
  isConnected: boolean;
  retryCount: number;
}

export const useOptimizedAIChat = (initialSessionId?: string) => {
  const { user } = useUser();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    sessionId: initialSessionId || "",
    error: null,
    isConnected: false,
    retryCount: 0,
  });

  // Health check to verify backend connection
  const checkConnection = useCallback(async () => {
    try {
      const response = await apiClient.healthCheck();
      setState((prev) => ({
        ...prev,
        isConnected: response.success || false,
        error: response.success ? null : "Backend connection failed",
      }));
      return response.success;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        error: "Cannot connect to backend server",
      }));
      return false;
    }
  }, []);

  // Initialize session with better error handling
  const initializeSession = useCallback(async () => {
    if (!user || state.sessionId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // First check connection
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error("Backend server is not responding");
      }

      console.log("🔄 Initializing chat session for user:", user.id);

      const response = await apiClient.createChatSession({
        type: "financial_consultation",
        title: "New Financial Chat",
        metadata: { userId: user.id },
      });

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          sessionId: response.data?.sessionId || response.data?._id || "",
          isLoading: false,
          error: null,
          retryCount: 0,
        }));
        console.log(
          "✅ Session initialized:",
          response.data?.sessionId || response.data?._id
        );
      } else {
        throw new Error(response.error || "Failed to create session");
      }
    } catch (error) {
      console.error("❌ Error creating session:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: `Failed to create chat session: ${errorMessage}`,
        retryCount: prev.retryCount + 1,
      }));
    }
  }, [user, state.sessionId, checkConnection]);

  // Load chat history with pagination
  const loadChatHistory = useCallback(async () => {
    if (!user || !state.sessionId || state.sessionId === "new") return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      console.log("🔄 Loading chat history for session:", state.sessionId);

      const response = await apiClient.getChatHistory(state.sessionId);

      if (response.success && response.data) {
        const formattedMessages: OptimizedChatMessage[] = response.data.map(
          (msg: RawChatMessage) => ({
            id: msg._id || msg.id || `msg-${Date.now()}-${Math.random()}`,
            content: msg.content,
            sender: msg.type === "user" ? "user" : "ai",
            timestamp: new Date(msg.timestamp),
            messageType: msg.aiMetadata?.messageType || "text",
            suggestions: msg.aiMetadata?.suggestions || [],
          })
        );

        setState((prev) => ({
          ...prev,
          messages: formattedMessages,
          isLoading: false,
          error: null,
        }));
        console.log(
          "✅ Chat history loaded:",
          formattedMessages.length,
          "messages"
        );
      }
    } catch (error) {
      console.error("❌ Error loading chat history:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load chat history",
      }));
    }
  }, [user, state.sessionId]);

  // Send message with optimistic updates
  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.sessionId || !user) {
        setState((prev) => ({ ...prev, error: "No active session" }));
        return false;
      }

      // Optimistic update - add user message immediately
      const userMessage: OptimizedChatMessage = {
        id: `temp-${Date.now()}`,
        content,
        sender: "user",
        timestamp: new Date(),
        messageType: "text",
      };

      // Add loading AI message
      const loadingAIMessage: OptimizedChatMessage = {
        id: `temp-ai-${Date.now()}`,
        content: "Thinking...",
        sender: "ai",
        timestamp: new Date(),
        messageType: "text",
        isLoading: true,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage, loadingAIMessage],
        error: null,
      }));

      try {
        console.log("🔄 Sending message:", content);

        const response = await apiClient.sendChatMessage(
          state.sessionId,
          content
        );

        if (response.success && response.data) {
          // Replace loading message with actual AI response
          const aiMessage: OptimizedChatMessage = {
            id: response.data.id || `ai-${Date.now()}`,
            content: response.data.response || response.data.content,
            sender: "ai",
            timestamp: new Date(response.data.timestamp || Date.now()),
            messageType: response.data.messageType || "text",
            suggestions: response.data.suggestions || [],
          };

          setState((prev) => ({
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === loadingAIMessage.id ? aiMessage : msg
            ),
          }));

          console.log("✅ Message sent and response received");
          return true;
        } else {
          throw new Error(response.error || "Failed to send message");
        }
      } catch (error) {
        console.error("❌ Error sending message:", error);

        // Remove loading message and show error
        setState((prev) => ({
          ...prev,
          messages: prev.messages.filter(
            (msg) => msg.id !== loadingAIMessage.id
          ),
          error:
            error instanceof Error ? error.message : "Failed to send message",
        }));
        return false;
      }
    },
    [state.sessionId, user]
  );

  // Retry connection
  const retryConnection = useCallback(async () => {
    setState((prev) => ({ ...prev, error: null, retryCount: 0 }));
    await checkConnection();
    if (user && !state.sessionId) {
      await initializeSession();
    }
  }, [checkConnection, initializeSession, user, state.sessionId]);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (user && !state.sessionId) {
      initializeSession();
    }
  }, [user, state.sessionId, initializeSession]);

  // Load history when session is ready
  useEffect(() => {
    if (
      state.sessionId &&
      state.sessionId !== "new" &&
      state.messages.length === 0
    ) {
      loadChatHistory();
    }
  }, [state.sessionId, state.messages.length, loadChatHistory]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    sessionId: state.sessionId,
    error: state.error,
    isConnected: state.isConnected,
    retryCount: state.retryCount,
    sendMessage,
    retryConnection,
    clearError,
    checkConnection,
  };
};
