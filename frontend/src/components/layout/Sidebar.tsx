"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  PiggyBank,
  TrendingUp,
  Sparkles,
  Calculator,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Target,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  const pathname = usePathname();

  const navigationGroups = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: TrendingUp,
          description: "Financial overview",
        },
        {
          label: "AI Co-Pilot",
          href: "/chat",
          icon: Sparkles,
          description: "24/7 AI assistant",
          badge: "AI",
        },
      ],
    },
    {
      title: "Financial Tools",
      items: [
        {
          label: "Budget Tracker",
          href: "/dashboard/budget",
          icon: Calculator,
          description: "Track your expenses",
        },
        {
          label: "Investment",
          href: "/dashboard/investment",
          icon: BarChart3,
          description: "Portfolio management",
        },
        {
          label: "Goals",
          href: "/dashboard/goals",
          icon: Target,
          description: "Financial planning",
        },
      ],
    },
    {
      title: "Services",
      items: [
        {
          label: "Consultants",
          href: "/consultants",
          icon: Users,
          description: "Expert financial advice",
        },
        {
          label: "Bookings",
          href: "/bookings",
          icon: Calendar,
          description: "Your appointments",
        },
      ],
    },
    {
      title: "Learning",
      items: [
        {
          label: "Education",
          href: "/education",
          icon: BookOpen,
          description: "Financial literacy",
        },
      ],
    },
  ];

  const bottomItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      description: "Account settings",
    },
    {
      label: "Settings",
      href: "/profile/settings",
      icon: Settings,
      description: "Preferences",
    },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 fixed left-0 top-16 z-30"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Fintar
              </span>
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.title} className="px-4">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {group.title}
                </h3>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${
                          isCollapsed ? "mx-auto" : "mr-3"
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {item.description}
                          </p>
                        </div>
                      )}

                      {isActive && (
                        <motion.div
                          layoutId="sidebarActiveIndicator"
                          className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-3"}`}
                />

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate">{item.label}</span>
                    <p className="text-xs text-gray-500 truncate">
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
