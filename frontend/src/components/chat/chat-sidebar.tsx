/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card, CardContent } from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus } from "lucide-react";
import { ChatSession } from "@/types";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onSelectSession: (session: ChatSession) => void;
  onNewSession: () => void;
  isLoading: boolean;
}

export function ChatSidebar({
  sessions,
  currentSession,
  onSelectSession,
  onNewSession,
  isLoading,
}: ChatSidebarProps) {
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "Looking forward to our session!",
      time: "2 min ago",
      isOnline: true,
      unreadCount: 2,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b524?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "David Chen",
      lastMessage: "Thanks for the financial advice",
      time: "1 hour ago",
      isOnline: false,
      unreadCount: 0,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      lastMessage: "Can we reschedule?",
      time: "3 hours ago",
      isOnline: true,
      unreadCount: 1,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <Card className="h-full border-r">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={onNewSession}
            disabled={isLoading}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500">{contact.time}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {contact.lastMessage}
                </p>
              </div>

              {contact.unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {contact.unreadCount}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
