"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  User,
  Sparkles,
  TrendingUp,
  Calculator,
  Target,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";

const AIChatInterface = () => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    sendQuickAction,
    isConnected,
  } = useAIChat();
  const [inputMessage, setInputMessage] = useState("");

  const quickActions = [
    {
      icon: Calculator,
      label: "Budget Planner",
      description: "Buat rencana anggaran bulanan",
      action: "Buatkan saya rencana budget bulanan dengan gaji Rp 8.500.000",
    },
    {
      icon: TrendingUp,
      label: "Investment Analysis",
      description: "Analisis portfolio investasi",
      action: "Analisis investasi terbaik untuk profil risiko saya",
    },
    {
      icon: Target,
      label: "Goal Setting",
      description: "Tetapkan tujuan keuangan",
      action: "Bantu saya membuat target menabung untuk membeli rumah",
    },
    {
      icon: BookOpen,
      label: "Financial Tips",
      description: "Tips literasi keuangan",
      action: "Berikan tips mengelola keuangan untuk usia 20-an",
    },
  ];

  const handleSendMessage = async (content?: string) => {
    const messageToSend = content || inputMessage;
    if (!messageToSend.trim()) return;

    await sendMessage(messageToSend);
    setInputMessage("");
  };

  const handleQuickAction = (action: string) => {
    sendQuickAction(action);
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak dapat terhubung
          </h3>
          <p className="text-gray-600">
            Silakan login terlebih dahulu untuk menggunakan AI Chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 shadow-lg rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Fintar AI Copilot</h2>
              <p className="text-blue-100 text-sm">
                Asisten Keuangan Cerdas Berbasis AI
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-200"
              title="Clear Chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3">
          <div className="flex">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900 mb-3">
            🚀 Mulai dengan aksi cepat:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickAction(action.action)}
                className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left"
              >
                <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 rounded-lg">
                  <action.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {action.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {action.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-gray-50">{messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-2xl ${
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`p-2 rounded-full shadow-sm ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1">
                <div
                  className={`p-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                      : message.messageType === "error"
                      ? "bg-red-50 text-red-900 border border-red-200"
                      : "bg-white border border-gray-100 shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

                  {/* Message Type Indicator */}
                  {message.messageType === "financial_analysis" && (
                    <div className="mt-2 flex items-center space-x-1 text-blue-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        Analisis Keuangan
                      </span>
                    </div>
                  )}

                  {message.messageType === "advice" && (
                    <div className="mt-2 flex items-center space-x-1 text-green-600">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-xs font-medium">Saran AI</span>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className={`mt-1 text-xs ${message.sender === "user" ? "text-right" : "text-left"} text-gray-500`}>
                  {formatTimestamp(message.timestamp)}
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600">💡 Saran pertanyaan:</p>
                    <div className="space-y-1">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="block w-full text-left p-2 text-xs bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-lg transition-all duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2 max-w-2xl">
              <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 rounded-full shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="bg-white shadow-md border border-gray-100 p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150" />
                  </div>
                  <span className="text-xs text-gray-600">
                    AI Copilot sedang mengetik...
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-3 bg-white shadow-lg rounded-b-xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="💬 Tanyakan tentang keuangan Anda..."
            disabled={isLoading}
            className="flex-1 p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          ✨ <strong>Fintar AI Copilot</strong> - Asisten Keuangan Cerdas Berbasis AI untuk Keluarga dan UMKM
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
