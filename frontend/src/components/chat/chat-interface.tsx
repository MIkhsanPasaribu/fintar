/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { useState } from "react";
import { ChatSession, ChatMessage } from "@/types";

interface ChatInterfaceProps {
  session: ChatSession;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isOwn: boolean;
  sender: {
    name: string;
    avatar: string;
  };
}

export function ChatInterface({
  session,
  messages,
  onSendMessage,
  isLoading,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");

  const sampleMessages: Message[] = [
    {
      id: 1,
      content:
        "Hi! I'm looking for some advice on investment planning. Can you help me understand the best options for a beginner?",
      timestamp: "10:30 AM",
      isOwn: true,
      sender: {
        name: "You",
        avatar: "",
      },
    },
    {
      id: 2,
      content:
        "Of course! I'd be happy to help you with investment planning. Let's start with your financial goals and risk tolerance. What's your investment timeline?",
      timestamp: "10:32 AM",
      isOwn: false,
      sender: {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b524?w=100&h=100&fit=crop&crop=face",
      },
    },
    {
      id: 3,
      content:
        "I'm thinking about a 5-10 year timeline. I want to save for a house down payment and also build some long-term wealth.",
      timestamp: "10:35 AM",
      isOwn: true,
      sender: {
        name: "You",
        avatar: "",
      },
    },
    {
      id: 4,
      content:
        "Great! For that timeline, I'd recommend a diversified portfolio with a mix of stocks and bonds. We should also look at tax-advantaged accounts like IRAs.",
      timestamp: "10:37 AM",
      isOwn: false,
      sender: {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b524?w=100&h=100&fit=crop&crop=face",
      },
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <CardHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src="https://images.unsplash.com/photo-1494790108755-2616b612b524?w=100&h=100&fit=crop&crop=face"
                alt="Sarah Johnson"
              />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">Sarah Johnson</h3>
              <p className="text-sm text-gray-500">
                Financial Consultant • Online
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {sampleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex space-x-2 max-w-[70%] ${
                  msg.isOwn ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {!msg.isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={msg.sender.avatar}
                      alt={msg.sender.name}
                    />
                    <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-lg p-3 ${
                    msg.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.isOwn ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          <div className="flex-1 flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
