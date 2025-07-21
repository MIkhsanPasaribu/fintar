"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageCircle,
  Sparkles,
  TrendingUp,
  PiggyBank,
  Target,
} from "lucide-react";
import { useChatStore } from "@/store";

// Message type to match store definition
type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: "general" | "budgeting" | "investment" | "savings";
};

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

function QuickAction({ icon, label, onClick, color }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`flex items-center space-x-2 ${color} hover:scale-105 transition-all glass-effect border-primary-light/30 text-font-primary hover:bg-primary-light/20`}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start space-x-3 max-w-[80%]`}>
        {!isUser && (
          <div className="w-10 h-10 rounded-full bg-teal-dark/20 border border-teal-light/30 flex items-center justify-center mt-1 neon-glow">
            <Bot className="w-5 h-5 text-teal-light" />
          </div>
        )}

        <div
          className={`p-4 rounded-2xl ${
            isUser
              ? "bg-orange-500/90 text-primary-base rounded-br-none glass-effect border border-orange-500/50"
              : "glass-effect text-font-primary rounded-bl-none border border-primary-light/20"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-xs ${
                isUser ? "text-primary-base/80" : "text-font-muted"
              }`}
            >
              {message.timestamp instanceof Date
                ? message.timestamp.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : typeof message.timestamp === "string"
                ? new Date(message.timestamp).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
            {message.category && (
              <Badge
                variant="secondary"
                className="text-xs bg-teal-light/20 text-teal-light border-teal-light/30"
              >
                {message.category}
              </Badge>
            )}
          </div>
        </div>

        {isUser && (
          <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mt-1 neon-glow">
            <User className="w-5 h-5 text-orange-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIChatInterface() {
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(input),
        timestamp: new Date(),
        category: detectCategory(input),
      };

      addMessage(aiResponse);
      setLoading(false);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("budget") || input.includes("anggaran")) {
      return "Saya dapat membantu Anda membuat rencana anggaran yang efektif! Untuk memulai, mari kita analisis pendapatan dan pengeluaran bulanan Anda. Berapa total pendapatan Anda per bulan, dan apa saja kategori pengeluaran utama?";
    }

    if (input.includes("investasi") || input.includes("invest")) {
      return "Investasi adalah langkah penting untuk masa depan finansial! Untuk pemula, saya rekomendasikan memulai dengan reksa dana atau ETF yang lebih aman. Berapa persen dari pendapatan yang bisa Anda alokasikan untuk investasi?";
    }

    if (input.includes("tabung") || input.includes("saving")) {
      return "Menabung adalah fondasi keuangan yang kuat! Saya sarankan menggunakan metode 50-30-20: 50% kebutuhan, 30% keinginan, 20% tabungan. Apakah Anda sudah memiliki dana darurat setara 6-12 bulan pengeluaran?";
    }

    return "Terima kasih atas pertanyaannya! Sebagai AI Financial Advisor, saya siap membantu Anda dalam perencanaan keuangan, budgeting, investasi, dan strategi menabung. Apakah ada aspek keuangan khusus yang ingin Anda diskusikan?";
  };

  const detectCategory = (input: string): Message["category"] => {
    const inputLower = input.toLowerCase();
    if (inputLower.includes("budget") || inputLower.includes("anggaran"))
      return "budgeting";
    if (inputLower.includes("investasi") || inputLower.includes("invest"))
      return "investment";
    if (inputLower.includes("tabung") || inputLower.includes("saving"))
      return "savings";
    return "general";
  };

  const quickActions = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Tips Investasi",
      onClick: () => setInput("Berikan tips investasi untuk pemula"),
      color: "text-primary-600 border-primary-200 hover:bg-primary-50",
    },
    {
      icon: <PiggyBank className="w-4 h-4" />,
      label: "Cara Menabung",
      onClick: () => setInput("Bagaimana cara menabung yang efektif?"),
      color: "text-secondary-600 border-secondary-200 hover:bg-secondary-50",
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: "Buat Budget",
      onClick: () => setInput("Bantu saya membuat budget bulanan"),
      color: "text-accent-600 border-accent-200 hover:bg-accent-50",
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-primary-500/20">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center neon-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-font-light">
              AI Financial Advisor
            </h3>
            <p className="text-sm text-font-secondary">
              Konsultasi keuangan 24/7 dengan AI
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2 max-h-[400px] scrollbar-thin scrollbar-thumb-primary-500/50 scrollbar-track-bg-darker/20">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mx-auto neon-glow">
                <MessageCircle className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium text-font-light mb-2">
                  Selamat datang di AI Financial Advisor!
                </h4>
                <p className="text-sm text-font-secondary">
                  Tanyakan apa saja tentang keuangan, budgeting, investasi, atau
                  strategi menabung.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {quickActions.map((action, index) => (
                  <QuickAction key={index} {...action} />
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 glass-effect border border-primary-500/20 p-3 rounded-2xl rounded-bl-none">
                <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
                <span className="text-sm text-font-secondary">
                  AI sedang mengetik...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-primary-500/20 pt-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan tentang keuangan Anda..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-primary-500 hover:bg-primary-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {messages.length > 0 &&
              quickActions.map((action, index) => (
                <QuickAction key={`quick-${index}`} {...action} />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
