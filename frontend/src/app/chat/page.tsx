"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/use-auth";
import { chatApi } from "@/lib/api";
import { ChatSession, ChatMessage } from "@/types";
import { ChatSidebar, ChatInterface } from "@/components/chat";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load user sessions
  const loadSessions = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoadingSessions(true);
      const response = await chatApi.getUserSessions(user.id);
      const userSessions = (response.data || []) as ChatSession[];
      setSessions(userSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      addToast({
        title: "Error",
        description: "Failed to load chat sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSessions(false);
    }
  }, [user?.id, addToast]);

  useEffect(() => {
    if (user?.id) {
      loadSessions();
    }
  }, [user?.id, loadSessions]);

  // Load messages for current session
  const loadMessages = useCallback(
    async (sessionId: string) => {
      try {
        setIsLoading(true);
        const response = await chatApi.getChatHistory(sessionId);
        const sessionMessages = (response.data || []) as ChatMessage[];
        setMessages(sessionMessages);
      } catch (error) {
        console.error("Failed to load messages:", error);
        addToast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  const handleNewSession = async () => {
    if (!user?.id) return;

    try {
      const response = await chatApi.generateSession();
      const sessionData = response.data as {
        sessionId: string;
        title?: string;
      };
      const newSession: ChatSession = {
        id: sessionData.sessionId,
        title: sessionData.title || "New Chat",
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };

      setSessions((prev) => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create new session:", error);
      addToast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive",
      });
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSession(session);
    loadMessages(session.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSession || !user?.id) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      sessionId: currentSession.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage({
        sessionId: currentSession.id,
        message: content,
        userId: user.id,
      });

      const responseData = response.data as {
        response?: string;
        message?: string;
      };
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseData.response || responseData.message || "No response",
        role: "assistant",
        sessionId: currentSession.id,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      addToast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        sessions={sessions}
        currentSession={currentSession}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        isLoading={isLoadingSessions}
      />

      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <ChatInterface
            session={currentSession}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                Welcome to Fintar Chat
              </h3>
              <p className="text-sm">
                Select a chat session or create a new one to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
