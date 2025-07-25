/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
} from "@/components/ui";
import { Booking } from "@/types";
import { bookingApi } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDateTime } from "@/lib/utils";

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

const VideoIcon = () => (
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
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const EditIcon = () => (
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
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchBookingDetail(params.id as string);
    }
  }, [params.id]);

  const fetchBookingDetail = async (bookingId: string) => {
    try {
      setLoading(true);
      const response = await bookingApi.getById(bookingId);
      setBooking(response.data as Booking);
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      addToast({
        title: "Error",
        description: "Gagal memuat detail booking",
        variant: "danger",
      });

      // Fallback data
      setBooking({
        id: bookingId,
        userId: "user1",
        consultantId: "cons1",
        consultant: {
          id: "cons1",
          email: "adi.wicaksono@example.com",
          firstName: "Adi",
          lastName: "Wicaksono",
          avatar: "https://randomuser.me/api/portraits/men/11.jpg",
          specialization: ["FINANCIAL_PLANNING"],
          experience: 8,
          rating: 4.7,
          hourlyRate: 350000,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
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
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!booking) return;

    try {
      addToast({
        title: "Reschedule Request",
        description: "Permintaan reschedule telah dikirim ke konsultan",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Gagal melakukan reschedule",
        variant: "danger",
      });
    }
  };

  const handleCancel = async () => {
    if (!booking) return;

    try {
      await bookingApi.cancel(booking.id);
      setBooking((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      addToast({
        title: "Booking Dibatalkan",
        description: "Booking telah berhasil dibatalkan",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Gagal membatalkan booking",
        variant: "danger",
      });
    }
  };

  const handleJoinMeeting = () => {
    if (!booking) return;
    window.open(`/meeting/${booking.id}`, "_blank");
  };

  const getStatusBadge = () => {
    if (!booking) return null;

    switch (booking.status) {
      case "CONFIRMED":
        return <Badge variant="success">Dikonfirmasi</Badge>;
      case "PENDING":
        return <Badge variant="warning">Menunggu</Badge>;
      case "COMPLETED":
        return <Badge variant="primary">Selesai</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Dibatalkan</Badge>;
      default:
        return <Badge variant="secondary">{booking.status}</Badge>;
    }
  };

  const canJoin = () => {
    if (!booking) return false;
    const scheduledDate = new Date(booking.scheduledAt);
    const now = new Date();
    const timeDiff = scheduledDate.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return (
      minutesDiff <= 15 && minutesDiff >= -60 && booking.status === "CONFIRMED"
    );
  };

  const canModify = () => {
    if (!booking) return false;
    return ["CONFIRMED", "PENDING"].includes(booking.status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Booking Tidak Ditemukan
          </h2>
          <Button onClick={() => router.push("/bookings")}>
            Kembali ke Daftar Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/bookings")}
            className="mb-4"
          >
            ← Kembali
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Detail Booking
              </h1>
              <p className="text-text-description">Booking ID: {booking.id}</p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Info */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Informasi Booking
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-text-metadata">
                        Jenis Konsultasi
                      </label>
                      <p className="font-medium text-text-primary">
                        {booking.type === "CONSULTATION"
                          ? "Konsultasi"
                          : booking.type === "FOLLOW_UP"
                          ? "Follow-up"
                          : "Darurat"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-text-metadata">
                        Durasi
                      </label>
                      <p className="font-medium text-text-primary">
                        {booking.duration} menit
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-text-metadata">
                        Tanggal & Waktu
                      </label>
                      <p className="font-medium text-text-primary">
                        {formatDateTime(booking.scheduledAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-text-metadata">
                        Biaya
                      </label>
                      <p className="font-medium text-success text-lg">
                        {formatCurrency(booking.price)}
                      </p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div>
                      <label className="text-sm text-text-metadata">
                        Catatan
                      </label>
                      <p className="font-medium text-text-primary">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Aksi
                </h3>

                <div className="flex flex-wrap gap-3">
                  {canJoin() && (
                    <Button
                      onClick={handleJoinMeeting}
                      icon={<VideoIcon />}
                      className="flex-1 min-w-0"
                    >
                      Gabung Meeting
                    </Button>
                  )}

                  {canModify() && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleReschedule}
                        icon={<EditIcon />}
                      >
                        Reschedule
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="text-danger border-danger hover:bg-danger-50"
                      >
                        Batalkan
                      </Button>
                    </>
                  )}
                </div>

                {canJoin() && (
                  <p className="text-xs text-text-metadata mt-3">
                    Meeting bisa diakses 15 menit sebelum jadwal konsultasi
                  </p>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultant Info */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Konsultan
                </h3>

                <div className="text-center">
                  <Avatar
                    src={booking.consultant?.avatar}
                    firstName={booking.consultant?.firstName}
                    lastName={booking.consultant?.lastName}
                    size="xl"
                    className="mx-auto mb-4"
                  />

                  <h4 className="font-semibold text-text-primary">
                    {booking.consultant?.firstName}{" "}
                    {booking.consultant?.lastName}
                  </h4>

                  <p className="text-text-metadata mb-2">
                    {booking.consultant?.experience} tahun pengalaman
                  </p>

                  <div className="flex items-center justify-center space-x-1 mb-4">
                    <span className="text-accent">★</span>
                    <span className="font-medium">
                      {booking.consultant?.rating}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/consultants/${booking.consultantId}`)
                    }
                  >
                    Lihat Profil
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Meeting Preparation */}
            {booking.status === "CONFIRMED" && (
              <Card>
                <CardBody>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Persiapan Meeting
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-success">✓</span>
                      <span>Siapkan pertanyaan yang ingin didiskusikan</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-success">✓</span>
                      <span>Pastikan koneksi internet stabil</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-success">✓</span>
                      <span>Siapkan dokumen keuangan yang relevan</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-success">✓</span>
                      <span>Test kamera dan mikrofon sebelum meeting</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
