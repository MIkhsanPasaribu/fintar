"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error" | "financial";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  className?: string;
}

const NotificationSystem = ({ className = "" }: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "financial",
        title: "Budget Alert",
        message:
          "Anda telah menggunakan 85% dari budget bulanan untuk kategori Entertainment",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        actionButton: {
          label: "Lihat Detail",
          onClick: () => console.log("View budget details"),
        },
      },
      {
        id: "2",
        type: "success",
        title: "Goal Achieved",
        message:
          "Selamat! Anda telah mencapai target tabungan emergency fund sebesar Rp 10.000.000",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
      },
      {
        id: "3",
        type: "info",
        title: "Investment Opportunity",
        message:
          "Reksadana RDPT yang Anda pantau mengalami penurunan 3%. Mungkin saat yang tepat untuk menambah investasi?",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
      },
      {
        id: "4",
        type: "warning",
        title: "Payment Reminder",
        message:
          "Tagihan kartu kredit Anda jatuh tempo dalam 3 hari. Total: Rp 2.450.000",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: false,
        actionButton: {
          label: "Bayar Sekarang",
          onClick: () => console.log("Pay now"),
        },
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "error":
        return AlertCircle;
      case "financial":
        return DollarSign;
      default:
        return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-orange-600 bg-orange-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "financial":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Baru saja";
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const IconComponent = getIcon(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-full ${getTypeColor(
                              notification.type
                            )}`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.read
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatTimeAgo(notification.timestamp)}
                              </span>

                              {notification.actionButton && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notification.actionButton!.onClick();
                                  }}
                                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                                >
                                  {notification.actionButton.label}
                                </button>
                              )}
                            </div>

                            {!notification.read && (
                              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setNotifications([]);
                    setIsOpen(false);
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationSystem;
