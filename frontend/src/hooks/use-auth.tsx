"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For development - auto-login with mock user
    const mockUser: User = {
      id: "1",
      email: "demo@fintar.com",
      username: "demo_user",
      firstName: "Demo",
      lastName: "User",
      phone: "+62812345678",
      avatar: undefined,
      isVerified: true,
      role: "CLIENT",
      preferences: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if we're on client side
    if (typeof window !== "undefined") {
      // Check for existing auth token on mount
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          // Set mock user for development
          setUser(mockUser);
          localStorage.setItem("auth_token", "mock_token");
          localStorage.setItem("user_data", JSON.stringify(mockUser));
        }
      } else {
        // Set mock user for development
        setUser(mockUser);
        localStorage.setItem("auth_token", "mock_token");
        localStorage.setItem("user_data", JSON.stringify(mockUser));
      }
    } else {
      // Server-side fallback
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));
    }
    setUser(data.user);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    }
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
