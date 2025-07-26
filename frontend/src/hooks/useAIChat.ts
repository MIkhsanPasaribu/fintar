import { useState, useEffect, useCallback } from "react";
import AIService, { ChatMessage, ChatRequest } from "@/lib/ai-api";
import { useUser } from "./useUser";

export const useAIChat = (initialSessionId?: string) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(
    initialSessionId || AIService.generateSessionId()
  );
  const [error, setError] = useState<string | null>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    const initializeChat = async () => {
      if (messages.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: "welcome",
          content:
            "Halo! Saya Fintar AI, asisten keuangan pribadi Anda. Saya siap membantu Anda dengan perencanaan keuangan, investasi, dan tips menabung. Ada yang bisa saya bantu hari ini?",
          sender: "ai",
          timestamp: new Date(),
          suggestions: [
            "Bagaimana cara membuat budget bulanan?",
            "Investasi apa yang cocok untuk pemula?",
            "Tips menabung untuk dana darurat",
            "Analisis pengeluaran saya bulan ini",
          ],
        };
        setMessages([welcomeMessage]);
      }
    };

    initializeChat();
  }, [messages.length]);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user && sessionId && messages.length <= 1) {
        try {
          const history = await AIService.getChatHistory(user.id, sessionId);
          if (history.length > 0) {
            setMessages(history);
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    };

    loadChatHistory();
  }, [user, sessionId, messages.length]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !user) return;

      setError(null);
      setIsLoading(true);

      // Add user message
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content: content.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Prepare chat request
        const chatRequest: ChatRequest = {
          userId: user.id,
          sessionId,
          message: content.trim(),
          context: {
            conversationHistory: messages.slice(-5), // Last 5 messages for context
            userProfile: user.profile,
          },
        };

        // Send to AI backend
        const response = await AIService.sendChatMessage(chatRequest);

        // Add AI response
        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          content: response.response,
          sender: "ai",
          timestamp: new Date(response.timestamp),
          messageType: response.messageType,
          suggestions: response.suggestions,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Gagal mengirim pesan. Silakan coba lagi.");

        // Add error message
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          content:
            "Maaf, terjadi kesalahan dalam mengirim pesan. Silakan coba lagi.",
          sender: "ai",
          timestamp: new Date(),
          messageType: "error",
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [user, sessionId, messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(AIService.generateSessionId());
    setError(null);
  }, []);

  const deleteSession = useCallback(async () => {
    if (user && sessionId) {
      try {
        await AIService.deleteChatSession(user.id, sessionId);
        clearChat();
      } catch (error) {
        console.error("Error deleting session:", error);
        setError("Gagal menghapus sesi chat.");
      }
    }
  }, [user, sessionId, clearChat]);

  const sendQuickAction = useCallback(
    (actionMessage: string) => {
      sendMessage(actionMessage);
    },
    [sendMessage]
  );

  return {
    messages,
    isLoading,
    error,
    sessionId,
    sendMessage,
    clearChat,
    deleteSession,
    sendQuickAction,
    isConnected: !!user,
  };
};

export default useAIChat;
