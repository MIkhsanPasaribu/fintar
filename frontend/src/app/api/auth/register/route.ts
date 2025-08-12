import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

console.log("🔧 BACKEND_URL:", BACKEND_URL);
console.log("🔧 Environment variables:", {
  BACKEND_URL: process.env.BACKEND_URL,
  NODE_ENV: process.env.NODE_ENV,
});

interface RegisterRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // Validate required fields
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      confirmPassword,
      agreeToTerms,
    } = body;

    if (!email || !username || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Password dan konfirmasi password tidak sama" },
        { status: 400 }
      );
    }

    if (!agreeToTerms) {
      return NextResponse.json(
        { error: "Anda harus menyetujui syarat dan ketentuan" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    try {
      // Call backend API with correct field names
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const userData = await response.json();

      // Return the response from backend (including requiresVerification flag)
      return NextResponse.json(userData);
    } catch (backendError) {
      console.error("Backend registration error:", backendError);

      // Fallback registration logic for development
      return NextResponse.json({
        message: "Registrasi berhasil (mode development)",
        user: {
          id: `user_${Date.now()}`,
          email,
          username,
          firstName,
          lastName,
        },
        token: `dev_token_${Date.now()}`,
        warning: "Backend unavailable, using fallback authentication",
      });
    }
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
