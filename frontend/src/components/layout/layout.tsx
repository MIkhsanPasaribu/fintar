"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Calendar,
  Settings,
  User,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useUserStore, useNotificationStore } from "@/store";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "AI Assistant",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Edukasi",
    href: "/education",
    icon: BookOpen,
  },
  {
    name: "Konsultasi",
    href: "/booking",
    icon: Calendar,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const { unreadCount } = useNotificationStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-main to-bg-darker">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass-effect shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-primary-light/20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-primary-light/20">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-teal-dark to-orange-500 rounded-xl flex items-center justify-center neon-glow group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="text-xl font-bold gradient-text">Fintar</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-font-light hover:bg-secondary-400/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 pt-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                        isActive
                          ? "bg-secondary-400/20 text-accent-400 border border-secondary-400/30 neon-glow"
                          : "text-font-secondary hover:bg-secondary-400/10 hover:text-font-light hover:border-secondary-400/20 border border-transparent"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 transition-all duration-200",
                          isActive
                            ? "text-accent-400"
                            : "group-hover:text-accent-400"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User menu */}
          <div className="border-t border-secondary-400/20 p-4 glass-effect">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full flex items-center justify-center shadow-xl neon-glow">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-font-light truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-font-muted truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-font-secondary hover:bg-secondary-400/10 hover:text-font-light"
                onClick={() => {
                  /* Navigate to settings */
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-font-secondary hover:bg-error-dark/20 hover:text-error-light"
                onClick={logout}
              >
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 glass-effect border-b border-secondary-400/20">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-font-light hover:bg-secondary-400/20"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-font-light hover:bg-secondary-400/20"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-error-dark text-error-light text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
