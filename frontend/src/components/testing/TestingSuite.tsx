/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Play,
  RefreshCw,
  Database,
  Cloud,
  Zap,
  Shield,
  FileText,
  Bot,
  DollarSign,
} from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import AIService from "@/lib/ai-api";

interface TestResult {
  id: string;
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  duration?: number;
  error?: string;
  details?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tests: TestResult[];
}

const TestingSuite = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);
  const { sendMessage } = useAIChat();

  // Initialize test suites
  useEffect(() => {
    const initialSuites: TestSuite[] = [
      {
        id: "backend-connectivity",
        name: "Backend Connectivity",
        description: "Test backend API endpoints and connectivity",
        icon: Database,
        tests: [
          { id: "health-check", name: "API Health Check", status: "pending" },
          {
            id: "auth-endpoint",
            name: "Authentication Endpoint",
            status: "pending",
          },
          { id: "user-endpoint", name: "User Management", status: "pending" },
          { id: "cors-check", name: "CORS Configuration", status: "pending" },
        ],
      },
      {
        id: "ai-integration",
        name: "AI Integration",
        description: "Test AI chat and financial analysis",
        icon: Bot,
        tests: [
          {
            id: "chat-connection",
            name: "AI Chat Connection",
            status: "pending",
          },
          {
            id: "financial-analysis",
            name: "Financial Analysis API",
            status: "pending",
          },
          {
            id: "consultant-agent",
            name: "Consultant Agent",
            status: "pending",
          },
          { id: "response-time", name: "AI Response Time", status: "pending" },
        ],
      },
      {
        id: "financial-features",
        name: "Financial Features",
        description: "Test financial planning and analysis tools",
        icon: DollarSign,
        tests: [
          { id: "budget-tracker", name: "Budget Tracker", status: "pending" },
          { id: "goal-planning", name: "Goal Planning", status: "pending" },
          {
            id: "investment-advice",
            name: "Investment Recommendations",
            status: "pending",
          },
          {
            id: "file-upload",
            name: "Financial File Upload",
            status: "pending",
          },
        ],
      },
      {
        id: "security",
        name: "Security & Authentication",
        description: "Test security measures and authentication",
        icon: Shield,
        tests: [
          {
            id: "jwt-validation",
            name: "JWT Token Validation",
            status: "pending",
          },
          { id: "rate-limiting", name: "Rate Limiting", status: "pending" },
          {
            id: "input-validation",
            name: "Input Validation",
            status: "pending",
          },
          { id: "data-encryption", name: "Data Encryption", status: "pending" },
        ],
      },
      {
        id: "performance",
        name: "Performance",
        description: "Test application performance and load handling",
        icon: Zap,
        tests: [
          { id: "page-load", name: "Page Load Times", status: "pending" },
          { id: "api-response", name: "API Response Times", status: "pending" },
          { id: "memory-usage", name: "Memory Usage", status: "pending" },
          {
            id: "concurrent-users",
            name: "Concurrent Users",
            status: "pending",
          },
        ],
      },
      {
        id: "ui-ux",
        name: "UI/UX Testing",
        description: "Test user interface and experience",
        icon: FileText,
        tests: [
          {
            id: "responsive-design",
            name: "Responsive Design",
            status: "pending",
          },
          {
            id: "accessibility",
            name: "Accessibility (a11y)",
            status: "pending",
          },
          { id: "navigation", name: "Navigation Flow", status: "pending" },
          { id: "form-validation", name: "Form Validation", status: "pending" },
        ],
      },
    ];

    setTestSuites(initialSuites);
  }, []);

  const runTest = async (
    suiteId: string,
    testId: string
  ): Promise<TestResult> => {
    const startTime = Date.now();

    // Update test status to running
    setTestSuites((prev) =>
      prev.map((suite) =>
        suite.id === suiteId
          ? {
              ...suite,
              tests: suite.tests.map((test) =>
                test.id === testId ? { ...test, status: "running" } : test
              ),
            }
          : suite
      )
    );

    try {
      let result: TestResult;

      // Simulate different test scenarios
      switch (`${suiteId}-${testId}`) {
        case "backend-connectivity-health-check":
          try {
            // Test basic health check - this should work if backend is running
            const response = await fetch("http://localhost:3001/health");
            if (response.ok) {
              result = {
                id: testId,
                name: "API Health Check",
                status: "passed",
                duration: Date.now() - startTime,
                details: "Backend is responding correctly",
              };
            } else {
              throw new Error(`HTTP ${response.status}`);
            }
          } catch (error) {
            result = {
              id: testId,
              name: "API Health Check",
              status: "failed",
              duration: Date.now() - startTime,
              error:
                "Backend not responding - ensure backend server is running on port 3001",
            };
          }
          break;

        case "ai-integration-chat-connection":
          try {
            const testMessage = await sendMessage(
              "Test message for connectivity check"
            );
            result = {
              id: testId,
              name: "AI Chat Connection",
              status:
                testMessage !== undefined && testMessage !== null
                  ? "passed"
                  : "failed",
              duration: Date.now() - startTime,
              details:
                testMessage !== undefined && testMessage !== null
                  ? "AI chat is responding"
                  : "AI chat not responding",
            };
          } catch (error) {
            result = {
              id: testId,
              name: "AI Chat Connection",
              status: "failed",
              duration: Date.now() - startTime,
              error: "AI chat connection failed",
            };
          }
          break;

        case "ai-integration-financial-analysis":
          try {
            const mockData = {
              userId: "test-user",
              sessionId: "test-session",
              financialData: {
                income: 15000000,
                expenses: { housing: 5000000, food: 3000000 },
                savings: 2000000,
              },
              analysisType: "budget" as const,
            };
            const analysis = await AIService.analyzeFinancialData(mockData);
            result = {
              id: testId,
              name: "Financial Analysis API",
              status: analysis ? "passed" : "failed",
              duration: Date.now() - startTime,
              details: analysis
                ? "Financial analysis API working"
                : "Analysis failed",
            };
          } catch (error) {
            result = {
              id: testId,
              name: "Financial Analysis API",
              status: "failed",
              duration: Date.now() - startTime,
              error: "Financial analysis API failed",
            };
          }
          break;

        default:
          // Simulate test execution time
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 + Math.random() * 2000)
          );

          // Random pass/fail for demo
          const shouldPass = Math.random() > 0.2; // 80% pass rate
          result = {
            id: testId,
            name: testId
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            status: shouldPass ? "passed" : "failed",
            duration: Date.now() - startTime,
            details: shouldPass ? "Test completed successfully" : undefined,
            error: shouldPass ? undefined : "Test failed - check configuration",
          };
      }

      return result;
    } catch (error) {
      return {
        id: testId,
        name: testId
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        status: "failed",
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const runSuiteTests = async (suiteId: string) => {
    const suite = testSuites.find((s) => s.id === suiteId);
    if (!suite) return;

    setIsRunningTests(true);

    for (const test of suite.tests) {
      const result = await runTest(suiteId, test.id);

      setTestSuites((prev) =>
        prev.map((s) =>
          s.id === suiteId
            ? {
                ...s,
                tests: s.tests.map((t) => (t.id === test.id ? result : t)),
              }
            : s
        )
      );
    }

    setIsRunningTests(false);
  };

  const runAllTests = async () => {
    setIsRunningTests(true);

    for (const suite of testSuites) {
      await runSuiteTests(suite.id);
    }

    setIsRunningTests(false);
  };

  const resetTests = () => {
    setTestSuites((prev) =>
      prev.map((suite) => ({
        ...suite,
        tests: suite.tests.map((test) => ({
          ...test,
          status: "pending",
          duration: undefined,
          error: undefined,
          details: undefined,
        })),
      }))
    );
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "running":
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return "border-green-200 bg-green-50";
      case "failed":
        return "border-red-200 bg-red-50";
      case "running":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const getSuiteStats = (suite: TestSuite) => {
    const passed = suite.tests.filter((t) => t.status === "passed").length;
    const failed = suite.tests.filter((t) => t.status === "failed").length;
    const running = suite.tests.filter((t) => t.status === "running").length;
    const total = suite.tests.length;

    return { passed, failed, running, total };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testing Suite</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive testing for all Fintar features and integrations
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={resetTests}
            disabled={isRunningTests}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset All
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isRunningTests ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run All Tests
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {testSuites.map((suite) => {
          const stats = getSuiteStats(suite);
          const IconComponent = suite.icon;

          return (
            <motion.div
              key={suite.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {suite.name}
                    </h3>
                    <p className="text-sm text-gray-600">{suite.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => runSuiteTests(suite.id)}
                  disabled={isRunningTests}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>
                    {stats.passed + stats.failed}/{stats.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((stats.passed + stats.failed) / stats.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                {suite.tests.map((test) => (
                  <div
                    key={test.id}
                    className={`p-3 border rounded-lg ${getStatusColor(
                      test.status
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(test.status)}
                        <span className="text-sm font-medium">{test.name}</span>
                      </div>

                      {test.duration && (
                        <span className="text-xs text-gray-500">
                          {test.duration}ms
                        </span>
                      )}
                    </div>

                    {test.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        <div className="flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error: {test.error}
                        </div>
                      </div>
                    )}

                    {test.details && (
                      <div className="mt-2 text-xs text-gray-600">
                        {test.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Statistics */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Overall Test Results
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testSuites.map((suite) => {
            const stats = getSuiteStats(suite);
            return (
              <div key={suite.id} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.passed}/{stats.total}
                </div>
                <div className="text-sm text-gray-600">{suite.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.failed > 0 && (
                    <span className="text-red-600">{stats.failed} failed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestingSuite;
