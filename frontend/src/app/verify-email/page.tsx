"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

interface UserData {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  role?: string;
  isVerified?: boolean;
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan.");
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/api/v1/auth/verify-email?token=${verificationToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Email berhasil diverifikasi!");
        setUserData(data.user);

        // Store tokens if provided
        if (data.accessToken) {
          localStorage.setItem("auth_token", data.accessToken);
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Verifikasi email gagal.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Verification error:", error);
    }
  };

  const resendVerification = async () => {
    if (!userData?.email) return;

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/api/v1/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData.email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Email verifikasi baru telah dikirim!");
      } else {
        setMessage(data.message || "Gagal mengirim email verifikasi.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat mengirim email.");
      console.error("Resend error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="text-3xl font-bold text-primary mb-2">FINTAR</div>
            <p className="text-text-metadata text-sm">Verifikasi Email</p>
          </div>

          {/* Status Icon */}
          <div className="mb-6">
            {status === "loading" && (
              <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
            )}
            {status === "error" && (
              <XCircle className="w-16 h-16 text-danger mx-auto" />
            )}
          </div>

          {/* Status Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-body mb-3">
              {status === "loading" && "Memverifikasi Email..."}
              {status === "success" && "Email Berhasil Diverifikasi!"}
              {status === "error" && "Verifikasi Gagal"}
            </h1>

            <p className="text-text-subtitle text-base leading-relaxed">
              {message}
            </p>

            {status === "success" && userData && (
              <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
                <p className="text-success-700 text-sm">
                  Selamat datang,{" "}
                  <strong>{userData.firstName || userData.username}</strong>!
                  <br />
                  Anda akan diarahkan ke dashboard dalam beberapa detik...
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {status === "success" && (
              <Link
                href="/dashboard"
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 inline-block"
              >
                Masuk ke Dashboard
              </Link>
            )}

            {status === "error" && (
              <div className="space-y-3">
                {userData?.email && (
                  <button
                    onClick={resendVerification}
                    className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Kirim Ulang Email Verifikasi
                  </button>
                )}

                <Link
                  href="/login"
                  className="w-full bg-neutral-200 text-text-body py-3 px-6 rounded-lg font-medium hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300/50 focus:ring-offset-2 transition-all duration-200 inline-block"
                >
                  Kembali ke Login
                </Link>
              </div>
            )}

            {status === "loading" && (
              <div className="text-text-metadata text-sm">
                Mohon tunggu, proses verifikasi sedang berlangsung...
              </div>
            )}
          </div>

          {/* Help Link */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-text-metadata text-sm">
              Butuh bantuan?{" "}
              <Link
                href="/contact"
                className="text-primary hover:text-primary-600"
              >
                Hubungi Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
