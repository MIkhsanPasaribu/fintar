"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useUserStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Mock login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "demo@fintar.com" && password === "demo123") {
        const mockUser = {
          id: "1",
          email: email,
          name: "Demo User",
          role: "user" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setUser(mockUser);
        router.push("/dashboard");
      } else {
        setError("Email atau password tidak valid");
      }
    } catch {
      setError("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-main to-bg-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <Link
            href="/landing"
            className="inline-flex items-center space-x-2 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center neon-glow group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-3xl font-bold gradient-text">Fintar</span>
          </Link>
          <p className="mt-4 text-font-secondary">
            Masuk ke akun Anda dan kelola keuangan dengan cerdas
          </p>
        </div>

        {/* Login Form */}
        <Card className="glass-effect border-primary-500/20">
          <CardHeader>
            <CardTitle className="text-font-light text-2xl text-center">
              Selamat Datang Kembali
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="masukkan@email.com"
                icon={<Mail className="h-4 w-4" />}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  icon={<Lock className="h-4 w-4" />}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-font-muted hover:text-font-secondary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {error && (
                <div className="text-sm text-error-light bg-error-dark/20 border border-error-dark/30 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-400 hover:text-primary-300 hover:underline transition-colors"
                >
                  Lupa password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-500/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-bg-main text-font-muted">Atau</span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-sm text-font-secondary">
                  Belum punya akun?{" "}
                </span>
                <Link
                  href="/register"
                  className="text-sm text-primary-400 hover:text-primary-300 hover:underline font-medium transition-colors"
                >
                  Daftar sekarang
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="glass-effect border-accent-500/30 bg-accent-500/10">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-accent-300">
                  Demo Account
                </span>
              </div>
              <p className="text-sm text-font-secondary">
                <strong className="text-font-light">Email:</strong>{" "}
                demo@fintar.com
                <br />
                <strong className="text-font-light">Password:</strong> demo123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
