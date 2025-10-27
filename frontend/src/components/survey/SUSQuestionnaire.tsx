"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import {
  SUS_QUESTIONS,
  LIKERT_SCALE_LABELS,
  SUSResponses,
  getSUSGradeColor,
  getSUSGradeDescription,
} from "@/lib/sus-questions";

interface SUSQuestionnaireProps {
  sessionId?: string;
  onComplete?: (score: number, responses: SUSResponses) => void;
}

export default function SUSQuestionnaire({
  sessionId = "default-session",
  onComplete,
}: SUSQuestionnaireProps) {
  const [responses, setResponses] = useState<Partial<SUSResponses>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalGrade, setFinalGrade] = useState<string | null>(null);

  // Calculate progress
  const answeredCount = Object.keys(responses).length;
  const progress = (answeredCount / 10) * 100;
  const isAllAnswered = answeredCount === 10;

  // Handle response change
  const handleResponseChange = (
    questionKey: keyof SUSResponses,
    value: number
  ) => {
    setResponses((prev) => ({
      ...prev,
      [questionKey]: value,
    }));
  };

  // Submit SUS questionnaire
  const handleSubmit = async () => {
    if (!isAllAnswered) return;

    setIsSubmitting(true);

    try {
      const fullResponses = responses as SUSResponses;

      // Call API to submit SUS response
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sus/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId,
            ...fullResponses,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit SUS response");
      }

      const data = await response.json();

      // Set completion state
      setFinalScore(data.totalScore);
      setFinalGrade(data.grade);
      setIsCompleted(true);

      // Call onComplete callback
      if (onComplete) {
        onComplete(data.totalScore, fullResponses);
      }
    } catch (error) {
      console.error("Error submitting SUS questionnaire:", error);
      alert("Gagal mengirim kuesioner. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Completion view
  if (isCompleted && finalScore !== null && finalGrade !== null) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Thank You Message */}
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Terima Kasih! 🎉
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Kuesioner Anda telah berhasil dikirim. Feedback Anda sangat berharga
            untuk pengembangan Fintar.
          </p>

          {/* Score Display */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 mb-6 border border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                SUS Score Anda
              </p>
              <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {finalScore}
              </div>
              <div className="flex items-center justify-center gap-3">
                <span
                  className={`text-2xl font-bold px-6 py-2 rounded-lg border-2 ${getSUSGradeColor(
                    finalGrade
                  )}`}
                >
                  Grade: {finalGrade}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                {getSUSGradeDescription(finalGrade)}
              </p>
            </div>
          </div>

          {/* Score Interpretation */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Interpretasi Score:
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                • <strong>93-100 (A+):</strong> Excellent - Best Imaginable
              </p>
              <p>
                • <strong>86-92 (A):</strong> Very Good - Excellent Usability
              </p>
              <p>
                • <strong>79-85 (B):</strong> Good - Good Usability
              </p>
              <p>
                • <strong>69-78 (C):</strong> Okay - Marginal Usability
              </p>
              <p>
                • <strong>51-68 (D):</strong> Poor - Below Average
              </p>
              <p>
                • <strong>0-50 (F):</strong> Awful - Worst Imaginable
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Questionnaire view
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Usability Scale (SUS)
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Bantu kami meningkatkan Fintar dengan menjawab 10 pertanyaan singkat
            tentang pengalaman Anda menggunakan sistem ini.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {answeredCount} / 10 pertanyaan
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-8">
          {SUS_QUESTIONS.map((question) => {
            const currentResponse = responses[question.questionKey];
            const isAnswered = currentResponse !== undefined;

            return (
              <div
                key={question.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isAnswered
                    ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 mt-1">
                    {isAnswered ? (
                      <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        Pertanyaan {question.id}
                      </span>
                    </div>
                    <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                      {question.questionId}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      {question.questionEn}
                    </p>
                  </div>
                </div>

                {/* Likert Scale Options */}
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      key={value}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        currentResponse === value
                          ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={value}
                        checked={currentResponse === value}
                        onChange={() =>
                          handleResponseChange(question.questionKey, value)
                        }
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {
                          LIKERT_SCALE_LABELS[
                            value as keyof typeof LIKERT_SCALE_LABELS
                          ]
                        }
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({value})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered || isSubmitting}
            className={`w-full max-w-md py-4 px-8 rounded-xl font-semibold text-lg transition-all ${
              isAllAnswered && !isSubmitting
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengirim...
              </span>
            ) : isAllAnswered ? (
              "Kirim Kuesioner"
            ) : (
              `Jawab ${10 - answeredCount} pertanyaan lagi`
            )}
          </button>

          {!isAllAnswered && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Mohon jawab semua pertanyaan untuk melanjutkan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
