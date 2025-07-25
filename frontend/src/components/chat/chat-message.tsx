"use client";

import { motion } from "framer-motion";
import { Avatar, Button } from "@/components/ui";
import { ChatMessage as ChatMessageType } from "@/types";
import { formatTime } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

const BotIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "USER";
  const isSystem = message.role === "SYSTEM";

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-neutral-100 text-text-metadata text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex items-start space-x-3 max-w-[80%] ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          {isUser ? (
            <Avatar
              src="https://randomuser.me/api/portraits/men/1.jpg"
              firstName="You"
              size="sm"
            />
          ) : (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <BotIcon />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`flex flex-col ${
            isUser ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`rounded-lg px-4 py-3 ${
              isUser
                ? "bg-primary text-white"
                : "bg-neutral-100 text-text-primary"
            }`}
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          </div>

          <div className="text-xs text-text-metadata mt-1">
            {formatTime(message.timestamp)}
          </div>

          {/* Suggested Actions for AI messages */}
          {!isUser && message.metadata?.suggestedActions && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.metadata.suggestedActions
                .slice(0, 3)
                .map((action: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      // Handle suggested action click
                      console.log("Suggested action clicked:", action);
                    }}
                  >
                    {action}
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
