"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

interface ExpenseCategory {
  name: string;
  amount: string;
  percentage: number;
}

interface AnalysisResult {
  income: string;
  expenses: string;
  savings: string;
  categories: ExpenseCategory[];
  recommendations: string[];
}

interface FileUploadProps {
  onFileAnalysis?: (analysis: AnalysisResult) => void;
}

const FileUpload = ({ onFileAnalysis }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);

    try {
      // Mock analysis for now
      const mockAnalysis = {
        income: "Rp 15,000,000",
        expenses: "Rp 12,500,000",
        savings: "Rp 2,500,000",
        categories: [
          { name: "Housing", amount: "Rp 5,000,000", percentage: 40 },
          { name: "Food", amount: "Rp 3,000,000", percentage: 24 },
          { name: "Transportation", amount: "Rp 2,000,000", percentage: 16 },
          { name: "Entertainment", amount: "Rp 1,500,000", percentage: 12 },
          { name: "Others", amount: "Rp 1,000,000", percentage: 8 },
        ],
        recommendations: [
          "Consider reducing entertainment expenses by 20%",
          "Your savings rate is good at 16.7%",
          "Emergency fund recommendation: Rp 37,500,000 (3x monthly expenses)",
        ],
      };

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAnalysisResult(mockAnalysis);
      onFileAnalysis?.(mockAnalysis);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!uploadedFile ? (
        <motion.div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Financial Document
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your bank statement, budget file, or financial report
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Supports PDF, Excel, CSV files up to 10MB
          </p>
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
            <input
              type="file"
              className="hidden"
              accept=".pdf,.xlsx,.xls,.csv"
              onChange={handleFileInput}
            />
          </label>
        </motion.div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">
                  {uploadedFile.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your financial data...</p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-6">
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Analysis Complete</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800">Total Income</h5>
                  <p className="text-2xl font-bold text-green-600">
                    {analysisResult.income}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-800">Total Expenses</h5>
                  <p className="text-2xl font-bold text-red-600">
                    {analysisResult.expenses}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800">Savings</h5>
                  <p className="text-2xl font-bold text-blue-600">
                    {analysisResult.savings}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">
                  Expense Categories
                </h5>
                <div className="space-y-2">
                  {analysisResult.categories.map(
                    (category: ExpenseCategory, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700">{category.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {category.amount}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">
                  AI Recommendations
                </h5>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map(
                    (rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
