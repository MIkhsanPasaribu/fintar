import { create } from "zustand";
import {
  apiClient,
  type ChatSession,
  type ChatMessage,
} from "@/lib/api-client";

interface ChatState {
  // State
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  // Actions
  fetchSessions: () => Promise<void>;
  createSession: (data: {
    title?: string;
    type?: string;
    metadata?: Record<string, unknown>;
  }) => Promise<ChatSession | null>;
  setCurrentSession: (session: ChatSession) => void;
  fetchMessages: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;

  // Getters
  hasActiveSessions: () => boolean;
  getCurrentSessionId: () => string | null;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  sessions: [],
  currentSession: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,

  // Actions
  fetchSessions: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getChatSessions();

      if (response.success && response.data) {
        set({
          sessions: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.error || "Failed to fetch chat sessions",
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch chat sessions",
        isLoading: false,
      });
    }
  },

  createSession: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.createChatSession(data);

      if (response.success && response.data) {
        const newSession = response.data;

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSession: newSession,
          messages: [],
          isLoading: false,
          error: null,
        }));

        return newSession;
      } else {
        set({
          error: response.error || "Failed to create chat session",
          isLoading: false,
        });
        return null;
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create chat session",
        isLoading: false,
      });
      return null;
    }
  },

  setCurrentSession: (session) => {
    set({ currentSession: session, messages: [] });
    // Automatically fetch messages for the selected session
    get().fetchMessages(session.sessionId);
  },

  fetchMessages: async (sessionId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getChatHistory(sessionId);

      if (response.success && response.data) {
        set({
          messages: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.error || "Failed to fetch messages",
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch messages",
        isLoading: false,
      });
    }
  },

  sendMessage: async (content) => {
    const currentSession = get().currentSession;
    if (!currentSession) {
      set({ error: "No active chat session" });
      return false;
    }

    set({ isSending: true, error: null });

    // Optimistically add user message
    const tempUserMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      sessionId: currentSession.sessionId,
      userId: "", // Will be filled by backend
      type: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, tempUserMessage],
    }));

    try {
      const response = await apiClient.sendChatMessage(
        currentSession.sessionId,
        content
      );

      if (response.success && response.data) {
        const { userMessage, aiMessage } = response.data;

        set((state) => ({
          messages: [
            ...state.messages.filter((m) => m._id !== tempUserMessage._id),
            userMessage,
            aiMessage,
          ],
          isSending: false,
          error: null,
        }));

        return true;
      } else {
        // Remove optimistic message on failure
        set((state) => ({
          messages: state.messages.filter((m) => m._id !== tempUserMessage._id),
          error: response.error || "Failed to send message",
          isSending: false,
        }));
        return false;
      }
    } catch (error) {
      // Remove optimistic message on failure
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== tempUserMessage._id),
        error:
          error instanceof Error ? error.message : "Failed to send message",
        isSending: false,
      }));
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      sessions: [],
      currentSession: null,
      messages: [],
      error: null,
    });
  },

  // Getters
  hasActiveSessions: () => {
    const sessions = get().sessions;
    return sessions.some((session) => session.isActive);
  },

  getCurrentSessionId: () => {
    const currentSession = get().currentSession;
    return currentSession?.sessionId || null;
  },
}));

// Helper hooks
export const useChatSessions = () => {
  const store = useChatStore();
  return {
    sessions: store.sessions,
    isLoading: store.isLoading,
    error: store.error,
    fetchSessions: store.fetchSessions,
    createSession: store.createSession,
    hasActiveSessions: store.hasActiveSessions(),
    clearError: store.clearError,
  };
};

export const useCurrentChat = () => {
  const store = useChatStore();
  return {
    currentSession: store.currentSession,
    messages: store.messages,
    isSending: store.isSending,
    error: store.error,
    setCurrentSession: store.setCurrentSession,
    sendMessage: store.sendMessage,
    clearError: store.clearError,
  };
};

export const useChatHistory = () => {
  const store = useChatStore();
  return {
    messages: store.messages,
    fetchMessages: store.fetchMessages,
    isLoading: store.isLoading,
  };
};
