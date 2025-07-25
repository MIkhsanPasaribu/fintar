/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for stored auth token and user data
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user_data");

        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: "Failed to load authentication state",
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: "user1",
        email,
        username: email.split("@")[0], // Generate username from email
        firstName: "John",
        lastName: "Doe",
        isVerified: true,
        role: "CLIENT",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = "mock-jwt-token";

      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("user_data", JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setAuthState({
        user: null,
        loading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Mock registration - replace with actual API call
      const newUser: User = {
        id: "new-user",
        email: userData.email,
        username: userData.email.split("@")[0], // Generate username from email
        firstName: userData.firstName,
        lastName: userData.lastName,
        isVerified: false,
        role: "CLIENT",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = "mock-jwt-token";

      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("user_data", JSON.stringify(newUser));

      setAuthState({
        user: newUser,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setAuthState({
        user: null,
        loading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    register,
    isAuthenticated: !!authState.user,
  };
}
