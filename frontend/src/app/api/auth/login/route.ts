import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
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

    try {
      // Call backend API
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          return NextResponse.json(
            { error: "Email atau password tidak valid" },
            { status: 401 }
          );
        }

        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();

      // Set HTTP-only cookie for token (optional, more secure)
      const responseHeaders = new Headers();
      if (body.remember) {
        responseHeaders.set(
          "Set-Cookie",
          `auth_token=${userData.token}; HttpOnly; Path=/; Max-Age=${
            7 * 24 * 60 * 60
          }`
        );
      }

      return NextResponse.json(
        {
          message: "Login berhasil",
          user: {
            id: userData.user.id,
            email: userData.user.email,
            username: userData.user.username,
            firstName: userData.user.firstName,
            lastName: userData.user.lastName,
            role: userData.user.role,
            isVerified: userData.user.isVerified,
          },
          token: userData.token,
          refreshToken: userData.refreshToken,
        },
        { headers: responseHeaders }
      );
    } catch (backendError) {
      console.error("Backend login error:", backendError);

      // Fallback login logic for development
      if (email === "budi@example.com" && password === "Password123") {
        return NextResponse.json({
          message: "Login berhasil (mode development)",
          user: {
            id: "user1",
            email: "budi@example.com",
            username: "budi123",
            firstName: "Budi",
            lastName: "Santoso",
            role: "CLIENT",
            isVerified: true,
          },
          token: `dev_token_${Date.now()}`,
          warning: "Backend unavailable, using fallback authentication",
        });
      } else {
        return NextResponse.json(
          { error: "Email atau password tidak valid" },
          { status: 401 }
        );
      }
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
