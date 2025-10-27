"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  messageId: string;
  onFeedback: (feedbackType: "THUMBS_UP" | "THUMBS_DOWN") => void;
  initialFeedback?: "THUMBS_UP" | "THUMBS_DOWN" | null;
}

export function FeedbackButtons({
  messageId,
  onFeedback,
  initialFeedback = null,
}: Props) {
  const [feedback, setFeedback] = useState<"THUMBS_UP" | "THUMBS_DOWN" | null>(
    initialFeedback
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (type: "THUMBS_UP" | "THUMBS_DOWN") => {
    if (isSubmitting || feedback === type) return;

    setIsSubmitting(true);
    setFeedback(type);

    try {
      await onFeedback(type);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setFeedback(null); // Reset on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={() => handleFeedback("THUMBS_UP")}
        disabled={isSubmitting}
        className={`p-1.5 rounded-lg transition-all ${
          feedback === "THUMBS_UP"
            ? "bg-green-100 text-green-600"
            : "hover:bg-gray-100 text-gray-400 hover:text-green-500"
        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title="Helpful"
      >
        <ThumbsUp className="h-4 w-4" />
      </button>

      <button
        onClick={() => handleFeedback("THUMBS_DOWN")}
        disabled={isSubmitting}
        className={`p-1.5 rounded-lg transition-all ${
          feedback === "THUMBS_DOWN"
            ? "bg-red-100 text-red-600"
            : "hover:bg-gray-100 text-gray-400 hover:text-red-500"
        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title="Not helpful"
      >
        <ThumbsDown className="h-4 w-4" />
      </button>

      {feedback && (
        <span className="text-xs text-gray-500 ml-2">
          Thanks for your feedback!
        </span>
      )}
    </div>
  );
}
