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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/landing" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-3xl font-bold text-primary-600">Fintar</span>
          </Link>
          <p className="mt-2 text-neutral-600">Masuk ke akun Anda</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Selamat Datang Kembali</CardTitle>
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
                  className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
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
                <div className="text-sm text-error bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:underline"
                >
                  Lupa password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">Atau</span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-sm text-neutral-600">
                  Belum punya akun?{" "}
                </span>
                <Link
                  href="/register"
                  className="text-sm text-primary-600 hover:underline font-medium"
                >
                  Daftar sekarang
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="bg-accent-50 border-accent-200">
          <CardContent className="p-4">
            <p className="text-sm text-accent-800 text-center">
              <strong>Demo Account:</strong>
              <br />
              Email: demo@fintar.com
              <br />
              Password: demo123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
