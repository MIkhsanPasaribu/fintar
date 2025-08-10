"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Orbit,
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
  TestTube,
  LogOut,
  Loader2,
  LineChart,
} from "lucide-react";
import NotificationSystem from "./NotificationSystem";
import { useUser } from "@/hooks/useUser";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

const Sidebar = ({
  isCollapsed = false,
  onToggle,
  isMobileMenuOpen = false,
  onMobileMenuClose,
}: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Perform logout
      logout();

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if error, still redirect to login
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigationGroups = [
    {
      title: "🌌 AI Universe",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: TrendingUp,
          description: "Overview Finansial Galaksi Anda",
        },
        {
          label: "AI Navigator",
          href: "/chat",
          icon: Sparkles,
          description: "Chat dengan AI Keuangan 24/7",
          badge: "AI ✨",
        },
      ],
    },
    {
      title: "🚀 Financial AI Tools",
      items: [
        {
          label: "Analisis AI",
          href: "/financial-analysis",
          icon: TrendingUp,
          description: "Insight Keuangan dengan AI",
          badge: "AI",
        },
        {
          label: "Budget AI",
          href: "/budget-ai",
          icon: Calculator,
          description: "Rekomendasi Budget Cerdas",
          badge: "AI",
        },
        {
          label: "Investment AI",
          href: "/investment-ai",
          icon: BarChart3,
          description: "Strategi Investasi Personal",
          badge: "AI",
        },
        {
          label: "Financial Planning",
          href: "/financial-planning",
          icon: Target,
          description: "Rencana Keuangan Jangka Panjang",
          badge: "AI",
        },
      ],
    },
    {
      title: "🌟 Services",
      items: [
        {
          label: "Konsultan Ahli",
          href: "/consultants",
          icon: Users,
          description: "Konsultasi dengan Expert Keuangan",
        },
        {
          label: "Jadwal Konsultasi",
          href: "/bookings",
          icon: Calendar,
          description: "Booking & Appointment",
        },
        {
          label: "Pemantauan Harga Pasar",
          href: "/market-monitoring",
          icon: LineChart,
          description: "Monitoring Saham & Crypto Real-time",
          badge: "Live",
        },
      ],
    },
    {
      title: "📚 Learning",
      items: [
        {
          label: "Edukasi Keuangan",
          href: "/education",
          icon: BookOpen,
          description: "Literasi & Tips Finansial",
        },
        {
          label: "Testing Suite",
          href: "/testing",
          icon: TestTube,
          description: "System diagnostics",
          badge: "DEV",
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
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 320 }}
        className="hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30 shadow-lg"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/Fintarlogo.png"
                    alt="Fintar Logo"
                    width={100}
                    height={70}
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {!isCollapsed && <NotificationSystem />}

              <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title} className="px-4">
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {group.title}
                  </h3>
                )}

                <div className="space-y-2">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 relative ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            isCollapsed ? "mx-auto" : "mr-3"
                          } ${isActive ? "text-blue-600" : ""}`}
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
                            className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-r-full"
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
          <div className="space-y-2">
            {bottomItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-3"} ${
                      isActive ? "text-blue-600" : ""
                    }`}
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

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`group flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 ${
                isLoggingOut
                  ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              {isLoggingOut ? (
                <Loader2
                  className={`h-5 w-5 animate-spin ${
                    isCollapsed ? "mx-auto" : "mr-3"
                  }`}
                />
              ) : (
                <LogOut
                  className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-3"}`}
                />
              )}

              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <span className="font-medium truncate">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                  <p
                    className={`text-xs truncate ${
                      isLoggingOut ? "text-gray-400" : "text-red-500"
                    }`}
                  >
                    {isLoggingOut
                      ? "Please wait..."
                      : "Sign out of your account"}
                  </p>
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-xl"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/Fintarlogo.png"
                    alt="Fintar Logo"
                    width={100}
                    height={70}
                    className="object-contain"
                  />
                </div>
          </div>
          <button
            onClick={onMobileMenuClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title} className="px-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {group.title}
                </h3>

                <div className="space-y-2">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onMobileMenuClose}
                        className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 relative ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 mr-3 ${
                            isActive ? "text-blue-600" : ""
                          }`}
                        />

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

                        {isActive && (
                          <motion.div
                            layoutId="mobileSidebarActiveIndicator"
                            className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-r-full"
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

        {/* Mobile Bottom Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-2">
            {bottomItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileMenuClose}
                  className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 ${
                      isActive ? "text-blue-600" : ""
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate">{item.label}</span>
                    <p className="text-xs text-gray-500 truncate">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}

            {/* Mobile Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                onMobileMenuClose?.();
              }}
              disabled={isLoggingOut}
              className={`group flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 ${
                isLoggingOut
                  ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              {isLoggingOut ? (
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5 mr-3" />
              )}
              <div className="flex-1 min-w-0 text-left">
                <span className="font-medium truncate">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
                <p
                  className={`text-xs truncate ${
                    isLoggingOut ? "text-gray-400" : "text-red-500"
                  }`}
                >
                  {isLoggingOut ? "Please wait..." : "Sign out of your account"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
