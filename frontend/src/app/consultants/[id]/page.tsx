/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  Badge,
  Avatar,
  LoadingSpinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import BookingForm from "@/components/booking/booking-form";
import ReviewCard from "@/components/consultants/review-card";
import { Consultant, Review } from "@/types";
import { consultantApi, bookingApi } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";

const StarIcon = () => (
  <svg className="w-4 h-4 fill-current text-accent" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CalendarIcon = () => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4"
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

export default function ConsultantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchConsultantDetail(params.id as string);
      fetchConsultantReviews(params.id as string);
    }
  }, [params.id]);

  const fetchConsultantDetail = async (consultantId: string) => {
    try {
      setLoading(true);
      const response = await consultantApi.getById(consultantId);
      setConsultant(response.data as Consultant);
    } catch (error) {
      console.error("Error fetching consultant detail:", error);
      addToast({
        title: "Error",
        description: "Gagal memuat detail konsultan",
        variant: "danger",
      });

      // Fallback data
      setConsultant({
        id: consultantId,
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
        bio: "Certified Financial Planner dengan pengalaman 8 tahun di industri keuangan. Saya membantu individu dan keluarga merencanakan masa depan finansial yang lebih baik melalui strategi investasi dan perencanaan keuangan yang tepat.",
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
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultantReviews = async (consultantId: string) => {
    try {
      const response = await consultantApi.getReviews(consultantId);
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Fallback reviews
      setReviews([
        {
          id: "review1",
          userId: "user1",
          consultantId: consultantId,
          rating: 5,
          comment:
            "Sangat membantu dan memberikan advice yang praktis. Akan konsultasi lagi.",
          createdAt: new Date(),
          user: {
            firstName: "Budi",
            lastName: "S.",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          },
        },
        {
          id: "review2",
          userId: "user2",
          consultantId: consultantId,
          rating: 4,
          comment:
            "Penjelasan mudah dipahami dan solusi yang diberikan sesuai dengan kebutuhan saya.",
          createdAt: new Date(),
          user: {
            firstName: "Siti",
            lastName: "R.",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          },
        },
      ]);
    }
  };

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      await bookingApi.create(bookingData);
      addToast({
        title: "Booking Berhasil",
        description: "Konsultasi Anda telah dijadwalkan",
        variant: "success",
      });
      setShowBookingForm(false);
    } catch (error) {
      console.error("Booking error:", error);
      addToast({
        title: "Error",
        description: "Gagal membuat booking",
        variant: "danger",
      });
    }
  };

  const getSpecializationLabel = (spec: string) => {
    const labels = {
      FINANCIAL_PLANNING: "Perencanaan Keuangan",
      INVESTMENT_ADVICE: "Konsultasi Investasi",
      DEBT_MANAGEMENT: "Manajemen Utang",
      RETIREMENT_PLANNING: "Perencanaan Pensiun",
      TAX_PLANNING: "Perencanaan Pajak",
      BUDGETING: "Perencanaan Anggaran",
    };
    return labels[spec as keyof typeof labels] || spec;
  };

  const getAvailabilityDay = (day: string) => {
    const days = {
      monday: "Senin",
      tuesday: "Selasa",
      wednesday: "Rabu",
      thursday: "Kamis",
      friday: "Jumat",
      saturday: "Sabtu",
      sunday: "Minggu",
    };
    return days[day as keyof typeof days] || day;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Konsultan Tidak Ditemukan
          </h2>
          <Button onClick={() => router.push("/consultants")}>
            Kembali ke Daftar Konsultan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/consultants")}
            className="mb-4"
          >
            ← Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="availability">Ketersediaan</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Bio */}
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Tentang Konsultan
                    </h3>
                    <p className="text-text-description leading-relaxed">
                      {consultant.bio}
                    </p>
                  </CardBody>
                </Card>

                {/* Specializations */}
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Spesialisasi
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {consultant.specialization.map((spec) => (
                        <Badge key={spec} variant="primary">
                          {getSpecializationLabel(spec)}
                        </Badge>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Certifications */}
                {consultant.certifications &&
                  consultant.certifications.length > 0 && (
                    <Card>
                      <CardBody>
                        <h3 className="text-lg font-semibold text-text-primary mb-4">
                          Sertifikasi
                        </h3>
                        <div className="space-y-2">
                          {consultant.certifications.map((cert) => (
                            <div
                              key={cert}
                              className="flex items-center space-x-2"
                            >
                              <CheckIcon />
                              <span className="text-text-primary">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-text-metadata">
                      Belum ada review untuk konsultan ini
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="availability">
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Jadwal Ketersediaan
                    </h3>
                    <div className="space-y-3">
                      {consultant.availability &&
                        Object.entries(consultant.availability).map(
                          ([day, times]) => (
                            <div
                              key={day}
                              className="flex items-center justify-between py-2 border-b border-neutral-200 last:border-0"
                            >
                              <span className="font-medium text-text-primary">
                                {getAvailabilityDay(day)}
                              </span>
                              <div className="flex space-x-2">
                                {(times as string[]).map((time, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    size="sm"
                                  >
                                    {time}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </CardBody>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultant Card */}
            <Card>
              <CardBody className="text-center">
                <Avatar
                  src={consultant.avatar}
                  firstName={consultant.firstName}
                  lastName={consultant.lastName}
                  size="xl"
                  className="mx-auto mb-4"
                />

                <h2 className="text-xl font-bold text-text-primary mb-2">
                  {consultant.firstName} {consultant.lastName}
                </h2>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <StarIcon />
                    <span className="font-medium text-text-primary">
                      {consultant.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-text-metadata">
                    ({consultant.experience} tahun pengalaman)
                  </span>
                </div>

                <div className="text-2xl font-bold text-success mb-6">
                  {formatCurrency(consultant.hourlyRate)}/jam
                </div>

                <Button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full"
                  icon={<CalendarIcon />}
                  disabled={!consultant.isActive}
                >
                  {consultant.isActive ? "Book Konsultasi" : "Tidak Tersedia"}
                </Button>
              </CardBody>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Statistik
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-metadata">Total Review</span>
                    <span className="font-medium">{reviews.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-metadata">Rating Rata-rata</span>
                    <span className="font-medium">
                      {consultant.rating.toFixed(1)} ⭐
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-metadata">Pengalaman</span>
                    <span className="font-medium">
                      {consultant.experience} tahun
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-metadata">Bahasa</span>
                    <span className="font-medium">
                      {consultant.languages?.join(", ").toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {consultant && (
        <BookingForm
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          onSubmit={handleBookingSubmit}
          consultant={consultant}
        />
      )}
    </div>
  );
}
