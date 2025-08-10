import { useState, useEffect, useCallback } from "react";
import AIService, { ChatMessage, ChatRequest } from "@/lib/ai-api";
import { useUser } from "./useUser";

export const useAIChat = (initialSessionId?: string) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      if (user && !sessionId) {
        try {
          setIsLoading(true);
          setError(null);
          console.log("🔄 Initializing session for user:", user.id);
          const newSessionId = await AIService.createChatSession(user.id);
          setSessionId(newSessionId);
          console.log("✅ Session initialized:", newSessionId);
        } catch (error) {
          console.error("❌ Error creating session:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create chat session";
          setError(
            `Failed to create chat session: ${errorMessage}. Please refresh the page.`
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeSession();
  }, [user, sessionId]);

  // Load chat history after session is established
  useEffect(() => {
    const loadChatHistory = async () => {
      if (
        user &&
        sessionId &&
        sessionId !== "" &&
        sessionId !== "new" &&
        messages.length === 0
      ) {
        try {
          setIsLoading(true);
          setError(null);
          console.log("Loading chat history for session:", sessionId);
          const history = await AIService.getChatHistory(user.id, sessionId);
          if (history.length > 0) {
            setMessages(history);
            console.log("Chat history loaded:", history.length, "messages");
          } else {
            // Add welcome message if no history
            const welcomeMessage: ChatMessage = {
              id: "welcome",
              content:
                "Halo! Saya Fintar AI Navigator, asisten keuangan galaksi Anda. Saya siap membantu Anda mengeksplorasi universe finansial dengan analisis cerdas, perencanaan budget, dan strategi investasi. Ada yang bisa saya bantu hari ini?",
              sender: "ai",
              timestamp: new Date(),
              suggestions: [
                "Analisis keuangan saya dengan AI",
                "Rekomendasi budget bulanan",
                "Strategi investasi untuk pemula",
                "Rencana finansial jangka panjang",
              ],
            };
            setMessages([welcomeMessage]);
            console.log("Welcome message added");
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
          // Add welcome message on error
          const welcomeMessage: ChatMessage = {
            id: "welcome",
            content:
              "Halo! Saya Fintar AI Navigator. Maaf, ada sedikit kendala teknis. Tapi saya tetap siap membantu Anda dengan analisis keuangan dan perencanaan finansial!",
            sender: "ai",
            timestamp: new Date(),
            suggestions: [
              "Coba analisis AI lagi",
              "Budget recommendations",
              "Investment planning",
              "Financial goals",
            ],
          };
          setMessages([welcomeMessage]);
          console.log("Error welcome message added");
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Only load history if we have a valid session and no messages yet
    if (sessionId && messages.length === 0) {
      loadChatHistory();
    }
  }, [user, sessionId, messages.length]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !user) {
        console.log("Cannot send message: missing content or user");
        return;
      }

      setError(null);
      setIsLoading(true);
      console.log("Sending message:", content.trim());

      // Add user message
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content: content.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Ensure we have a valid session
        let currentSessionId = sessionId;
        if (
          !currentSessionId ||
          currentSessionId === "" ||
          currentSessionId.startsWith("session_")
        ) {
          console.log("No valid session ID, creating new session");
          try {
            currentSessionId = await AIService.createChatSession(user.id);
            setSessionId(currentSessionId);
            console.log("New session created for message:", currentSessionId);
          } catch (sessionError) {
            console.error(
              "Failed to create session for message:",
              sessionError
            );
            setError("Unable to create chat session. Please refresh the page.");
            return;
          }
        }

        // Prepare chat request
        const chatRequest: ChatRequest = {
          userId: user.id,
          sessionId: currentSessionId,
          message: content.trim(),
          context: {
            conversationHistory: messages.slice(-5), // Last 5 messages for context
            userProfile: user.profile,
          },
        };

        console.log("Sending chat request:", chatRequest);

        // Send to AI backend
        const response = await AIService.sendChatMessage(chatRequest);
        console.log("Received AI response:", response);

        // Update session ID if it changed
        if (response.sessionId && response.sessionId !== sessionId) {
          setSessionId(response.sessionId);
        }

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
        console.log("AI message added successfully");
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Failed to send message. Please try again.");

        // Add error message
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          content:
            "Maaf, terjadi kesalahan dalam mengirim pesan. Silakan coba lagi atau refresh halaman.",
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
    setSessionId(""); // Clear session ID instead of generating new one
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
