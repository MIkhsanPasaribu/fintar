"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/tombol";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useOptimizedAIChat } from "@/hooks/useOptimizedAIChat";
import BackendStatus from "@/components/ui/backend-status";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
  suggestions?: string[];
}

export function OptimizedChatInterface() {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    sessionId,
    error,
    isConnected,
    retryCount,
    sendMessage,
    retryConnection,
    clearError,
    checkConnection,
  } = useOptimizedAIChat();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending || !isConnected) return;

    setIsSending(true);
    const success = await sendMessage(inputValue.trim());

    if (success) {
      setInputValue("");
    }
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header with Backend Status */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              AI Financial Assistant
            </h2>
            <p className="text-sm text-gray-600">
              Get personalized financial advice and insights
            </p>
          </div>
          <BackendStatus
            isConnected={isConnected}
            isLoading={isLoading}
            error={error}
            onRetry={retryConnection}
            retryCount={retryCount}
          />
        </div>

        {sessionId && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              Session: {sessionId.slice(-8)}
            </Badge>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
              className="ml-auto text-xs px-2 py-1 h-6"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto max-h-96">
        <div className="space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Start a Conversation
                </h3>
                <p className="text-sm">
                  Ask me anything about financial planning, budgeting, or
                  investments!
                </p>
              </div>

              {/* Suggestion Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "How can I create a budget?",
                  "What's a good emergency fund?",
                  "Explain investment basics",
                  "How to pay off debt faster?",
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs"
                    disabled={!isConnected}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-800"} rounded-lg px-4 py-2`}
              >
                <div className="text-sm">
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span className="italic">AI is thinking...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs ${message.sender === "user" ? "text-primary-foreground/70" : "text-gray-500"}`}
                  >
                    {formatTime(message.timestamp)}
                  </span>

                  {message.messageType && message.messageType !== "text" && (
                    <Badge variant="secondary" className="text-xs">
                      {message.messageType}
                    </Badge>
                  )}
                </div>

                {/* AI Message Suggestions */}
                {message.sender === "ai" &&
                  message.suggestions &&
                  message.suggestions.length > 0 &&
                  !message.isLoading && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">
                        Quick follow-ups:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-2 py-1 h-6"
                            disabled={!isConnected || isSending}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}

          {isLoading && messages.length === 0 && (
            <div className="text-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
              <p className="text-sm text-gray-600 mt-2">
                Initializing chat session...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              !isConnected
                ? "Waiting for backend connection..."
                : "Type your financial question..."
            }
            disabled={!isConnected || isSending || isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={
              !inputValue.trim() || !isConnected || isSending || isLoading
            }
            size="sm"
          >
            {isSending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!isConnected && (
          <p className="text-xs text-red-600 mt-2">
            Cannot connect to backend server. Please check your connection or
            try refreshing the page.
          </p>
        )}

        <p className="text-xs text-gray-500 mt-1">
          Press Enter to send • This AI assistant provides general financial
          guidance
        </p>
      </div>
    </div>
  );
}

export default OptimizedChatInterface;
