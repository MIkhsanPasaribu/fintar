import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Get authorization header
    const authHeader = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/bookings${userId ? `?userId=${userId}` : ""}`,
        {
          method: "GET",
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
    } catch (backendError) {
      console.error("Backend bookings error:", backendError);

      // Fallback data
      return NextResponse.json({
        data: [
          {
            id: "booking1",
            userId: "user1",
            consultantId: "cons1",
            consultant: {
              id: "cons1",
              firstName: "Adi",
              lastName: "Wicaksono",
              avatar: "https://randomuser.me/api/portraits/men/11.jpg",
              specialization: ["FINANCIAL_PLANNING"],
              experience: 8,
              rating: 4.7,
              hourlyRate: 350000,
              isActive: true,
            },
            type: "CONSULTATION",
            status: "CONFIRMED",
            scheduledAt: new Date(
              Date.now() + 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            duration: 60,
            price: 350000,
            notes: "Konsultasi perencanaan keuangan untuk pembelian rumah",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        fallback: true,
      });
    }
  } catch (error) {
    console.error("Bookings API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.message || "Failed to create booking" },
          { status: response.status }
        );
      }
    } catch (backendError) {
      console.error("Backend create booking error:", backendError);

      // Fallback response
      return NextResponse.json({
        id: `booking_${Date.now()}`,
        ...body,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fallback: true,
      });
    }
  } catch (error) {
    console.error("Create booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
