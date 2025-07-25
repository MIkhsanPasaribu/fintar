/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button, LoadingSpinner } from "@/components/ui";
import { ChatMessage, ChatSession } from "@/types";
import { formatTime } from "@/lib/utils";

interface ChatInterfaceProps {
  session: ChatSession;
  messages: ChatMessage[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
  isTyping?: boolean;
  className?: string;
  user?: { id: string; name?: string; avatar?: string };
}

const SendIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const BotIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export default function ChatInterface({
  session,
  messages,
  onSendMessage,
  isLoading = false,
  isTyping = false,
  className = "",
  user,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = inputMessage.trim();
    if (!messageContent || isLoading || isTyping) return;

    setInputMessage("");

    // Auto-resize textarea back to original size
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      await onSendMessage(messageContent);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const quickSuggestions = [
    "💰 Analisis keuangan saya bulan ini",
    "🏠 Tips menabung untuk rumah",
    "📈 Investasi terbaik untuk pemula",
    "💡 Cara mengurangi pengeluaran",
    "📊 Rencana keuangan 5 tahun",
    "🎯 Target dana darurat",
  ];

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === "USER";
    const isError = message.metadata?.isError;

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`flex space-x-3 max-w-[85%] ${
            isUser ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            {isUser ? (
              <Avatar
                size="sm"
                firstName={user?.name?.charAt(0) || "U"}
                src={user?.avatar}
                className="bg-gradient-to-br from-[#FFB800] to-[#F5A623]"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-[#0052CC] to-[#003D82] rounded-full flex items-center justify-center shadow-md">
                <BotIcon />
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="flex flex-col space-y-1">
            <div
              className={`rounded-2xl px-4 py-3 max-w-full break-words shadow-sm ${
                isUser
                  ? "bg-gradient-to-br from-[#0052CC] to-[#003D82] text-white rounded-br-md"
                  : isError
                  ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-md"
                  : "bg-white border border-[#E9ECEF] text-[#37474F] rounded-bl-md"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>

              {/* Message metadata */}
              {message.metadata?.confidence && !isUser && (
                <div className="mt-2 text-xs text-[#78909C]">
                  Confidence: {Math.round(message.metadata.confidence * 100)}%
                </div>
              )}
            </div>

            {/* Timestamp and status */}
            <div
              className={`flex items-center space-x-1 text-xs ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {isError && <ErrorIcon />}
              <span className="text-[#78909C]">
                {formatTime(
                  message.timestamp || new Date()
                )}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-[#FAFBFC] ${className}`}>
      {/* Chat Header */}
      <div className="bg-white border-b border-[#E9ECEF] px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0052CC] to-[#003D82] rounded-full flex items-center justify-center shadow-md">
            <BotIcon />
          </div>
          <div>
            <h3 className="font-semibold text-[#0A1628]">
              Asisten Keuangan AI
            </h3>
            <p className="text-sm text-[#78909C]">
              {isTyping
                ? "Sedang mengetik..."
                : "Siap membantu konsultasi finansial Anda"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0052CC] to-[#003D82] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BotIcon />
            </div>
            <h3 className="text-lg font-semibold text-[#0A1628] mb-2">
              Selamat datang di Fintar AI!
            </h3>
            <p className="text-[#546E7A] mb-6">
              Mulai percakapan dengan menanyakan seputar keuangan Anda
            </p>
          </div>
        ) : (
          <AnimatePresence>{messages.map(renderMessage)}</AnimatePresence>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="flex space-x-3 max-w-[85%]">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0052CC] to-[#003D82] rounded-full flex items-center justify-center shadow-md">
                <BotIcon />
              </div>
              <div className="bg-white border border-[#E9ECEF] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-[#78909C] rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 0 && !isLoading && (
        <div className="px-6 pb-4">
          <div className="text-sm font-medium text-[#37474F] mb-3">
            💡 Saran Topik Percakapan:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setInputMessage(suggestion)}
                className="bg-white border border-[#E9ECEF] rounded-xl px-4 py-3 text-sm text-[#37474F] hover:border-[#0052CC] hover:bg-[#E3F2FD] transition-all duration-200 text-left shadow-sm hover:shadow-md"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-[#E9ECEF] p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pertanyaan tentang keuangan Anda..."
              className="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-4 py-3 pr-12 text-[#37474F] placeholder-[#90A4AE] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent transition-all duration-200 resize-none overflow-hidden"
              disabled={isLoading || isTyping}
              rows={1}
              maxLength={1000}
              style={{ minHeight: "44px" }}
            />
            <div className="absolute bottom-2 right-3 text-xs text-[#90A4AE]">
              {inputMessage.length}/1000
            </div>
          </div>

          <Button
            type="submit"
            disabled={!inputMessage.trim() || isLoading || isTyping}
            className="px-4 py-3 bg-gradient-to-br from-[#0052CC] to-[#003D82] hover:from-[#0066FF] hover:to-[#0052CC] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <SendIcon />
            )}
          </Button>
        </form>

        <div className="flex justify-between items-center mt-2 text-xs text-[#78909C]">
          <span>Tekan Enter untuk kirim • Shift+Enter untuk baris baru</span>
          <span>AI dapat membuat kesalahan. Verifikasi informasi penting.</span>
        </div>
      </div>
    </div>
  );
}
