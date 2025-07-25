"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

// Icons
const BellIcon = () => (
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
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface HeaderProps {
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
  };
  showAuth?: boolean;
}

export default function Header({ user, showAuth = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", requiresAuth: true },
    { href: "/chat", label: "AI Assistant", requiresAuth: true },
    { href: "/consultants", label: "Konsultan", requiresAuth: false },
    { href: "/education", label: "Edukasi", requiresAuth: false },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-text-primary">Fintar</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors font-medium",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-text-description hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-text-metadata hover:text-primary rounded-lg hover:bg-neutral-50 transition-colors relative">
                  <BellIcon />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={user.avatar}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    size="sm"
                  />
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-text-primary">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-text-metadata">
                      {user.role === "ADMIN"
                        ? "Administrator"
                        : user.role === "CONSULTANT"
                        ? "Konsultan"
                        : "Member"}
                    </div>
                  </div>
                </div>
              </>
            ) : showAuth ? (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Daftar
                  </Button>
                </Link>
              </div>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-text-metadata hover:text-primary rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200 py-4"
          >
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => {
                if (item.requiresAuth && !user) return null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 transition-colors font-medium",
                      isActive(item.href)
                        ? "text-primary bg-primary-25"
                        : "text-text-description hover:text-primary hover:bg-neutral-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {!user && showAuth && (
                <div className="px-4 pt-4 border-t border-neutral-200 flex flex-col space-y-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="primary" className="w-full">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
