"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import AuthNavbar from "@/components/layout/AuthNavbar";
import Footer from "@/components/layout/Footer";

const EyeIcon = () => (
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
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
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
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878A3 3 0 0012 9c.166 0 .33.014.491.042M14.121 14.121L14.12 14.12M14.121 14.121A3 3 0 0012 15c-.166 0-.33-.014-.491-.042m2.612-.879L15.536 15.536M12 19C16.478 19 20.268 16.057 21.543 12a9.97 9.97 0 00-1.563-3.029"
    />
  </svg>
);

const CheckIcon = () => (
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
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nama depan wajib diisi";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Nama depan minimal 2 karakter";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nama belakang wajib diisi";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Nama belakang minimal 2 karakter";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (
      formData.phone &&
      !/^[\+]?[0-9]{10,13}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Format nomor telepon tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password harus mengandung huruf besar, huruf kecil, dan angka";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, text: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strength = [
      { text: "Sangat Lemah", color: "text-danger" },
      { text: "Lemah", color: "text-warning" },
      { text: "Cukup", color: "text-accent" },
      { text: "Kuat", color: "text-success" },
      { text: "Sangat Kuat", color: "text-success" },
    ];

    return { score, ...strength[Math.min(score, 4)] };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Check if email verification is required
      if (data.requiresVerification) {
        addToast({
          title: "Registrasi Berhasil",
          description:
            data.message || "Silakan periksa email Anda untuk verifikasi akun.",
          variant: "default",
        });

        // Redirect to a verification notice page
        router.push(
          `/verification-notice?email=${encodeURIComponent(formData.email)}`
        );
      } else {
        addToast({
          title: "Registrasi Berhasil",
          description: "Akun Anda telah berhasil dibuat",
          variant: "default",
        });

        // Store token if provided
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }

        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-soft p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center mb-6"
              >
                <Image
                  src="/Fintarlogo.png"
                  alt="Fintar Logo"
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </Link>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Buat Akun Baru
              </h1>
              <p className="text-text-description">
                Mulai perjalanan keuangan cerdas dengan AI
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-text-subtitle"
                  >
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-text-body placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
                      errors.firstName
                        ? "border-danger focus:ring-danger/20 focus:border-danger"
                        : "border-neutral-200 focus:ring-primary/20 focus:border-primary"
                    }`}
                    placeholder="Nama depan"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-danger">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-text-subtitle"
                  >
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-text-body placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
                      errors.lastName
                        ? "border-danger focus:ring-danger/20 focus:border-danger"
                        : "border-neutral-200 focus:ring-primary/20 focus:border-primary"
                    }`}
                    placeholder="Nama belakang"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-danger">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-text-subtitle"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-text-body placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
                    errors.username
                      ? "border-danger focus:ring-danger/20 focus:border-danger"
                      : "border-neutral-200 focus:ring-primary/20 focus:border-primary"
                  }`}
                  placeholder="Username unik"
                />
                {errors.username && (
                  <p className="text-sm text-danger">{errors.username}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-subtitle"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-text-body placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? "border-danger focus:ring-danger/20 focus:border-danger"
                      : "border-neutral-200 focus:ring-primary/20 focus:border-primary"
                  }`}
                  placeholder="nama@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-danger">{errors.email}</p>
                )}
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-text-subtitle"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-text-body placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone
                      ? "border-danger focus:ring-danger/20 focus:border-danger"
                      : "border-neutral-200 focus:ring-primary/20 focus:border-primary"
                  }`}
                  placeholder="+62 812 3456 7890"
                />
                {errors.phone && (
                  <p className="text-sm text-danger">{errors.phone}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-subtitle"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white text-text-body placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
                      errors.password
                        ? "border-danger focus:ring-danger/20 focus:border-danger"
                        : "border-neutral-200 focus:ring-primary/20 focus:border-primary"
                    }`}
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-metadata hover:text-text-description transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.score <= 1
                              ? "bg-danger"
                              : passwordStrength.score <= 2
                              ? "bg-warning"
                              : passwordStrength.score <= 3
                              ? "bg-accent"
                              : "bg-success"
                          }`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-medium ${passwordStrength.color}`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-danger">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-text-subtitle"
                >
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white text-text-body placeholder:text-text-placeholder focus:outline-none focus:ring-2 transition-colors ${
                      errors.confirmPassword
                        ? "border-danger focus:ring-danger/20 focus:border-danger"
                        : formData.confirmPassword &&
                          formData.password === formData.confirmPassword
                        ? "border-success focus:ring-success/20 focus:border-success"
                        : "border-neutral-200 focus:ring-primary/20 focus:border-primary"
                    }`}
                    placeholder="Ulangi password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-metadata hover:text-text-description transition-colors"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-success">
                        <CheckIcon />
                      </div>
                    )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-danger">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-2">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className={`mt-1 w-4 h-4 text-primary border-neutral-200 rounded focus:ring-primary/20 focus:ring-2 ${
                      errors.agreeToTerms ? "border-danger" : ""
                    }`}
                  />
                  <span className="text-sm text-text-description leading-relaxed">
                    Saya menyetujui{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:text-primary-600 transition-colors"
                    >
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:text-primary-600 transition-colors"
                    >
                      Kebijakan Privasi
                    </Link>{" "}
                    Fintar
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-danger">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Membuat Akun...
                  </div>
                ) : (
                  "Buat Akun"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-metadata">Atau</span>
                </div>
              </div>
            </div>

            {/* Social Register */}
            <div className="space-y-3">
              <button className="w-full bg-white border border-neutral-200 text-text-body py-3 px-4 rounded-lg font-medium hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Daftar dengan Google
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-text-description">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-600 font-medium transition-colors"
                >
                  Masuk sekarang
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
