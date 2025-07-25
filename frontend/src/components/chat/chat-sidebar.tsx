"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { ChatSession } from "@/types";
import { formatDate } from "@/lib/utils";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onSelectSession: (session: ChatSession) => void;
  onNewSession: () => void;
  isLoading?: boolean;
}

const PlusIcon = () => (
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
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const ChatIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

export default function ChatSidebar({
  sessions,
  currentSession,
  onSelectSession,
  onNewSession,
  isLoading = false,
}: ChatSidebarProps) {
  const getChatTypeLabel = (type?: string) => {
    if (!type) return "Umum";
    const labels = {
      GENERAL: "Umum",
      FINANCIAL_ADVICE: "Konsultasi Keuangan",
      INVESTMENT_HELP: "Bantuan Investasi",
      BUDGET_PLANNING: "Perencanaan Anggaran",
      DEBT_ASSISTANCE: "Bantuan Utang",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="w-80 bg-white border-r border-neutral-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <Button onClick={onNewSession} className="w-full" icon={<PlusIcon />}>
          Chat Baru
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-text-metadata">Loading sessions...</p>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ x: 4 }}
                onClick={() => onSelectSession(session)}
                className={`cursor-pointer rounded-lg p-3 mb-2 transition-colors ${
                  currentSession?.id === session.id
                    ? "bg-primary-50 border-primary-200 border"
                    : "hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      currentSession?.id === session.id
                        ? "bg-primary text-white"
                        : "bg-neutral-100 text-text-metadata"
                    }`}
                  >
                    <ChatIcon />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">
                      {session.title || "Chat Tanpa Judul"}
                    </h3>
                    <p className="text-xs text-text-metadata mt-1">
                      {getChatTypeLabel(session.type)}
                    </p>
                    <p className="text-xs text-text-metadata">
                      {formatDate(session.updatedAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatIcon />
              </div>
              <p className="text-text-metadata">Belum ada riwayat chat</p>
              <p className="text-sm text-text-description mt-1">
                Mulai percakapan baru dengan AI
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <div className="text-xs text-text-metadata">
          <p>💡 Tips: Gunakan bahasa yang jelas untuk hasil terbaik</p>
        </div>
      </div>
    </div>
  );
}
