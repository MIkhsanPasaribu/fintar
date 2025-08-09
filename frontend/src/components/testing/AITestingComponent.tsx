/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TestTube,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Database,
  Bot,
  TrendingUp,
} from "lucide-react";
import AIService from "@/lib/ai-api";
import { useUser } from "@/hooks/useUser";

const AITestingComponent = () => {
  const { user } = useUser();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testMessage, setTestMessage] = useState("Test pesan untuk AI chat");

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    const tests = [
      {
        name: "Backend Health Check",
        type: "health",
        test: async () => {
          try {
            const response = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
              }/health`
            );
            if (response.ok) {
              const data = await response.json();
              return {
                success: true,
                message: `Backend server accessible - ${
                  data.service || "fintar-backend"
                }`,
              };
            } else {
              return {
                success: false,
                message: `Backend server responded with status ${response.status}`,
              };
            }
          } catch (error) {
            console.error("Health check error:", error);
            return {
              success: false,
              message: "Backend server tidak accessible",
            };
          }
        },
      },
      {
        name: "AI Chat Test",
        type: "chat",
        test: async () => {
          if (!user)
            return { success: false, message: "User not authenticated" };
          try {
            const response = await AIService.sendChatMessage({
              userId: user.id,
              sessionId: AIService.generateSessionId(),
              message: testMessage,
            });
            return {
              success: !!response.response,
              message: `Response: ${response.response.substring(0, 100)}...`,
            };
          } catch (error) {
            return { success: false, message: `Error: ${error}` };
          }
        },
      },
      {
        name: "Financial Analysis Test",
        type: "analysis",
        test: async () => {
          if (!user)
            return { success: false, message: "User not authenticated" };
          try {
            const response = await AIService.analyzeFinancialData();
            return {
              success: !!response,
              message: "Financial analysis completed successfully",
            };
          } catch (error) {
            return { success: false, message: `Error: ${error}` };
          }
        },
      },
      {
        name: "Financial Advice Test",
        type: "advice",
        test: async () => {
          if (!user)
            return { success: false, message: "User not authenticated" };
          try {
            const response = await AIService.getFinancialAdvice();
            return {
              success: !!response,
              message: "Financial advice generated successfully",
            };
          } catch (error) {
            return { success: false, message: `Error: ${error}` };
          }
        },
      },
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            type: test.type,
            success: result.success,
            message: result.message,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (error) {
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            type: test.type,
            success: false,
            message: `Test failed: ${error}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    }

    setIsLoading(false);
  };

  const getTestIcon = (type: string) => {
    switch (type) {
      case "health":
        return Database;
      case "chat":
        return Bot;
      case "analysis":
        return TrendingUp;
      case "advice":
        return TestTube;
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">AI System Testing</h1>
          <p className="text-indigo-100 mb-6">
            Test konektivitas dan functionality AI backend integration
          </p>
        </motion.div>
      </div>

      {/* Test Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Test Configuration
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Message untuk AI Chat
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan pesan test..."
              />
              <button
                onClick={runTests}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span>{isLoading ? "Testing..." : "Run Tests"}</span>
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              Backend URL:{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}
            </p>
            <p>
              User Status:{" "}
              {user ? `Authenticated (${user.name})` : "Not authenticated"}
            </p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results</h3>

        {testResults.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <TestTube className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              Belum ada test yang dijalankan. Klik &quot;Run Tests&quot; untuk
              memulai.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Menjalankan test AI system...</p>
          </div>
        )}

        <div className="space-y-4">
          {testResults.map((result, index) => {
            const IconComponent = getTestIcon(result.type);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${
                  result.success
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    result.success
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{result.name}</h4>
                    <span className="text-sm text-gray-500">
                      {result.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        result.success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {result.success ? "PASS" : "FAIL"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">{result.message}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {testResults.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Total Tests: {testResults.length}
              </span>
              <div className="flex space-x-4">
                <span className="text-green-600">
                  Passed: {testResults.filter((r) => r.success).length}
                </span>
                <span className="text-red-600">
                  Failed: {testResults.filter((r) => !r.success).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITestingComponent;
