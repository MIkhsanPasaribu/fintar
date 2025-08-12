"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, RefreshCw, ArrowRight } from "lucide-react";

function VerificationNoticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const resendVerification = async () => {
    if (!email) return;

    setIsResending(true);
    setMessage("");
    setMessageType("");

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
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Email verifikasi baru telah dikirim!");
        setMessageType("success");
      } else {
        setMessage(data.message || "Gagal mengirim email verifikasi.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat mengirim email.");
      setMessageType("error");
      console.error("Resend error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="text-3xl font-bold text-primary mb-2">FINTAR</div>
            <p className="text-text-metadata text-sm">
              Verifikasi Email Diperlukan
            </p>
          </div>

          {/* Mail Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary-50 border-2 border-primary-200 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-body mb-4">
              Periksa Email Anda
            </h1>

            <div className="text-text-subtitle text-base leading-relaxed space-y-3">
              <p>Kami telah mengirimkan link verifikasi ke email Anda:</p>

              {email && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <p className="font-medium text-primary break-all">{email}</p>
                </div>
              )}

              <p>
                Klik link dalam email tersebut untuk mengaktifkan akun Anda dan
                mulai menggunakan Fintar.
              </p>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                messageType === "success"
                  ? "bg-success-50 border-success-200 text-success-700"
                  : "bg-danger-50 border-danger-200 text-danger-700"
              }`}
            >
              <div className="flex items-center">
                {messageType === "success" && (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                <p className="text-sm">{message}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-8 p-4 bg-accent-50 border border-accent-200 rounded-lg">
            <h3 className="font-semibold text-accent-800 mb-2">Tips:</h3>
            <ul className="text-sm text-accent-700 text-left space-y-1">
              <li>• Periksa folder spam/junk jika email tidak ditemukan</li>
              <li>• Link verifikasi berlaku selama 24 jam</li>
              <li>• Pastikan email yang dimasukkan sudah benar</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={resendVerification}
              disabled={isResending || !email}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Kirim Ulang Email
                </>
              )}
            </button>

            <Link
              href="/login"
              className="w-full bg-neutral-200 text-text-body py-3 px-6 rounded-lg font-medium hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300/50 focus:ring-offset-2 transition-all duration-200 inline-flex items-center justify-center"
            >
              Kembali ke Login
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-text-metadata text-sm mb-4">
              Masih mengalami kesulitan?
            </p>

            <div className="space-y-2">
              <Link
                href="/contact"
                className="text-primary hover:text-primary-600 text-sm font-medium"
              >
                Hubungi Support
              </Link>
              <span className="text-text-metadata text-sm mx-2">•</span>
              <Link
                href="/help/verification"
                className="text-primary hover:text-primary-600 text-sm font-medium"
              >
                Panduan Verifikasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerificationNoticePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationNoticeContent />
    </Suspense>
  );
}
