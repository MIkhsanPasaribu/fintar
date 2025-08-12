import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const specialization = searchParams.get("specialization");
    const experience = searchParams.get("experience");
    const priceRange = searchParams.get("priceRange");
    const rating = searchParams.get("rating");

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (specialization) queryParams.append("specialization", specialization);
    if (experience) queryParams.append("experience", experience);
    if (priceRange) queryParams.append("priceRange", priceRange);
    if (rating) queryParams.append("rating", rating);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/consultants?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
    } catch (backendError) {
      console.error("Backend consultants error:", backendError);

      // Fallback data
      return NextResponse.json({
        data: [
          {
            id: "cons1",
            email: "adi.financial@example.com",
            firstName: "Adi",
            lastName: "Wicaksono",
            phone: "+6281312345678",
            avatar: "https://randomuser.me/api/portraits/men/11.jpg",
            specialization: ["FINANCIAL_PLANNING", "INVESTMENT_ADVICE"],
            experience: 8,
            rating: 4.7,
            hourlyRate: 350000,
            isActive: true,
            bio: "Certified Financial Planner dengan pengalaman 8 tahun di industri keuangan",
            certifications: ["CFP", "RFP"],
            languages: ["id", "en"],
            timeZone: "Asia/Jakarta",
            availability: {
              monday: ["09:00-12:00", "13:00-17:00"],
              tuesday: ["09:00-12:00", "13:00-17:00"],
              wednesday: ["09:00-12:00", "13:00-17:00"],
              thursday: ["09:00-12:00", "13:00-17:00"],
              friday: ["09:00-12:00", "13:00-15:00"],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "cons2",
            email: "maya.advisor@example.com",
            firstName: "Maya",
            lastName: "Putri",
            phone: "+6281323456789",
            avatar: "https://randomuser.me/api/portraits/women/11.jpg",
            specialization: ["DEBT_MANAGEMENT", "BUDGETING"],
            experience: 5,
            rating: 4.5,
            hourlyRate: 300000,
            isActive: true,
            bio: "Spesialis dalam manajemen utang dan perencanaan anggaran pribadi",
            certifications: ["RFP", "QWP"],
            languages: ["id", "en"],
            timeZone: "Asia/Jakarta",
            availability: {
              monday: ["10:00-15:00"],
              tuesday: ["10:00-15:00"],
              wednesday: ["10:00-15:00"],
              thursday: ["10:00-15:00"],
              friday: ["10:00-13:00"],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        fallback: true,
      });
    }
  } catch (error) {
    console.error("Consultants API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
