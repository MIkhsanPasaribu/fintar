"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  Calculator,
  Target,
  BookOpen,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  suggestions?: string[];
}

const AIChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
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
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: "ai",
        timestamp: new Date(),
        suggestions: generateSuggestions(content),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("budget") || lowerInput.includes("anggaran")) {
      return "Untuk membuat budget yang efektif, saya sarankan menggunakan aturan 50/30/20:\n\n💰 50% untuk kebutuhan pokok (makanan, transport, tagihan)\n🎯 30% untuk keinginan (hiburan, shopping)\n💎 20% untuk tabungan dan investasi\n\nDengan gaji Anda, alokasi idealnya:\n- Kebutuhan: Rp 4.250.000\n- Keinginan: Rp 2.550.000\n- Tabungan: Rp 1.700.000\n\nApakah Anda ingin saya buatkan detail budget per kategori?";
    }

    if (lowerInput.includes("investasi") || lowerInput.includes("invest")) {
      return "📈 Untuk pemula, saya rekomendasikan investasi bertahap:\n\n1. **Dana Darurat** (3-6 bulan pengeluaran)\n   - Deposito atau tabungan berjangka\n   - Risiko rendah, likuiditas tinggi\n\n2. **Reksadana Campuran** \n   - Mulai Rp 100.000/bulan\n   - Diversifikasi otomatis\n\n3. **Saham Blue Chip**\n   - Setelah punya dana darurat\n   - Perusahaan stabil seperti BBCA, TLKM\n\nMulai dengan yang mana dulu?";
    }

    if (lowerInput.includes("menabung") || lowerInput.includes("tabung")) {
      return "💰 Tips menabung yang efektif:\n\n✅ **Bayar Diri Sendiri Dulu**\n   Set auto-debit ke rekening tabungan\n\n✅ **Gunakan Metode 52 Minggu**\n   Minggu 1: Rp 10.000\n   Minggu 2: Rp 20.000, dst.\n\n✅ **Pisahkan Rekening**\n   1 rekening untuk pengeluaran harian\n   1 rekening khusus tabungan\n\n✅ **Track Pengeluaran**\n   Catat setiap pengeluaran selama 1 bulan\n\nMau saya buatkan target tabungan spesifik?";
    }

    return "Terima kasih atas pertanyaannya! Sebagai AI assistant keuangan, saya dapat membantu Anda dengan:\n\n📊 Analisis keuangan personal\n💡 Saran investasi dan tabungan\n📈 Perencanaan financial goals\n💰 Tips mengelola budget\n🎯 Strategi mencapai target keuangan\n\nApa aspek keuangan yang ingin Anda diskusikan lebih lanjut?";
  };

  const generateSuggestions = (userInput: string): string[] => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("budget")) {
      return [
        "Detail budget per kategori pengeluaran",
        "Cara tracking budget harian",
        "Aplikasi budget yang recommended",
      ];
    }

    if (lowerInput.includes("investasi")) {
      return [
        "Cara memulai investasi saham",
        "Perbandingan reksadana vs saham",
        "Strategi investasi jangka panjang",
      ];
    }

    return [
      "Tips menghemat pengeluaran bulanan",
      "Cara meningkatkan passive income",
      "Perencanaan dana pendidikan anak",
    ];
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Fintar AI Co-Pilot
            </h2>
            <p className="text-sm text-gray-600">
              Your 24/7 Financial Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickAction(action.action)}
                className="flex items-center space-x-3 p-4 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="p-2 bg-gray-100 group-hover:bg-blue-100 rounded-lg transition-colors">
                  <action.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{action.label}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-3xl ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 ${
                  message.sender === "user" ? "ml-3" : "mr-3"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user"
                      ? "bg-blue-600"
                      : "bg-gradient-to-br from-purple-500 to-pink-500"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div
                className={`flex flex-col ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">
                    {message.content}
                  </p>
                </div>

                <span className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </span>

                {/* Suggestions */}
                {message.suggestions && message.sender === "ai" && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="block text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleSendMessage(inputMessage)
            }
            placeholder="Tanyakan tentang keuangan Anda..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          💡 Fintar AI dapat membantu perencanaan keuangan, investasi, dan tips
          menabung
        </p>
      </div>
    </div>
  );
};

export default AIChatInterface;
