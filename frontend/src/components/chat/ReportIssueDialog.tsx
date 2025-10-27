"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  messageId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueDescription: string) => void;
}

export function ReportIssueDialog({
  messageId,
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!issueDescription.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit(issueDescription);
      setIssueDescription("");
      onClose();
    } catch (error) {
      console.error("Failed to report issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold">Report an Issue</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Please describe the issue with this response. Your feedback helps us
          improve.
        </p>

        <textarea
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          placeholder="E.g., The investment recommendation doesn't match my risk profile..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
          rows={5}
          disabled={isSubmitting}
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!issueDescription.trim() || isSubmitting}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
