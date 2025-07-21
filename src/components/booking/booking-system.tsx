"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  Star,
  Video,
  Phone,
  MessageCircle,
  Filter,
  Search,
  CalendarDays,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Consultant {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  rating: number;
  reviews: number;
  price: number;
  avatar: string;
  experience: number;
  languages: string[];
  availability: "available" | "busy" | "offline";
  consultationMethods: ("video" | "phone" | "chat")[];
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const mockConsultants: Consultant[] = [
  {
    id: "1",
    name: "Dr. Sarah Wijaya",
    title: "Certified Financial Planner",
    specialization: ["Perencanaan Keuangan", "Investasi", "Asuransi"],
    rating: 4.9,
    reviews: 124,
    price: 150000,
    avatar: "/avatars/sarah.jpg",
    experience: 8,
    languages: ["Indonesia", "English"],
    availability: "available",
    consultationMethods: ["video", "phone", "chat"],
  },
  {
    id: "2",
    name: "Ahmad Rizki, CFP",
    title: "Investment Advisor",
    specialization: ["Investasi Saham", "Reksa Dana", "Portfolio Management"],
    rating: 4.8,
    reviews: 98,
    price: 125000,
    avatar: "/avatars/ahmad.jpg",
    experience: 6,
    languages: ["Indonesia"],
    availability: "available",
    consultationMethods: ["video", "chat"],
  },
  {
    id: "3",
    name: "Lisa Purnama",
    title: "Personal Finance Coach",
    specialization: ["Budgeting", "Debt Management", "Financial Psychology"],
    rating: 4.7,
    reviews: 87,
    price: 100000,
    avatar: "/avatars/lisa.jpg",
    experience: 5,
    languages: ["Indonesia", "English"],
    availability: "busy",
    consultationMethods: ["video", "phone", "chat"],
  },
  {
    id: "4",
    name: "Budi Santoso",
    title: "Tax Consultant",
    specialization: ["Pajak Pribadi", "Tax Planning", "Compliance"],
    rating: 4.6,
    reviews: 56,
    price: 175000,
    avatar: "/avatars/budi.jpg",
    experience: 10,
    languages: ["Indonesia"],
    availability: "available",
    consultationMethods: ["video", "phone"],
  },
];

const timeSlots: TimeSlot[] = [
  { id: "1", time: "09:00", available: true },
  { id: "2", time: "10:00", available: true },
  { id: "3", time: "11:00", available: false },
  { id: "4", time: "13:00", available: true },
  { id: "5", time: "14:00", available: true },
  { id: "6", time: "15:00", available: false },
  { id: "7", time: "16:00", available: true },
];

const specializations = [
  "Semua",
  "Perencanaan Keuangan",
  "Investasi",
  "Budgeting",
  "Debt Management",
  "Asuransi",
  "Pajak",
  "Portfolio Management",
];

export default function BookingSystem() {
  const [selectedConsultant, setSelectedConsultant] =
    useState<Consultant | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<
    "video" | "phone" | "chat"
  >("video");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Semua");
  const [showBookingForm, setShowBookingForm] = useState(false);

  const filteredConsultants = mockConsultants.filter((consultant) => {
    const matchesSearch =
      consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.specialization.some((spec) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSpecialization =
      selectedSpecialization === "Semua" ||
      consultant.specialization.includes(selectedSpecialization);

    return matchesSearch && matchesSpecialization;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-secondary-100 text-secondary-700";
      case "busy":
        return "bg-accent-100 text-accent-700";
      case "offline":
        return "bg-neutral-100 text-neutral-500";
      default:
        return "bg-neutral-100 text-neutral-500";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Tersedia";
      case "busy":
        return "Sibuk";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "video":
        return Video;
      case "phone":
        return Phone;
      case "chat":
        return MessageCircle;
      default:
        return Video;
    }
  };

  const handleBookConsultation = () => {
    if (!selectedConsultant || !selectedDate || !selectedTime) return;

    // Simulate booking process
    alert(
      `Konsultasi berhasil dibooking!\n\nKonsultan: ${
        selectedConsultant.name
      }\nTanggal: ${selectedDate}\nWaktu: ${selectedTime}\nMetode: ${selectedMethod}\nBiaya: Rp ${selectedConsultant.price.toLocaleString()}`
    );

    // Reset form
    setShowBookingForm(false);
    setSelectedConsultant(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Booking Konsultasi Finansial
        </h1>
        <p className="text-lg text-neutral-600">
          Konsultasi langsung dengan ahli keuangan berpengalaman
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Cari Konsultan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Cari berdasarkan nama atau spesialisasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Spesialisasi
            </label>
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec) => (
                <Button
                  key={spec}
                  variant={
                    selectedSpecialization === spec ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedSpecialization(spec)}
                >
                  {spec}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredConsultants.map((consultant) => (
          <Card
            key={consultant.id}
            className="hover:shadow-financial transition-shadow duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{consultant.name}</CardTitle>
                    <Badge
                      className={cn(
                        "text-xs",
                        getAvailabilityColor(consultant.availability)
                      )}
                    >
                      {getAvailabilityText(consultant.availability)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm font-medium text-primary-600">
                    {consultant.title}
                  </CardDescription>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 fill-current text-accent-500" />
                    <span className="text-sm font-medium">
                      {consultant.rating}
                    </span>
                    <span className="text-sm text-neutral-500">
                      ({consultant.reviews} ulasan)
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">
                  Spesialisasi:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {consultant.specialization.map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-neutral-600">
                <div className="flex items-center space-x-4">
                  <span>{consultant.experience} tahun pengalaman</span>
                  <span>{consultant.languages.join(", ")}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {consultant.consultationMethods.map((method) => {
                  const MethodIcon = getMethodIcon(method);
                  return (
                    <div key={method} className="p-2 bg-neutral-100 rounded-lg">
                      <MethodIcon className="h-4 w-4 text-neutral-600" />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-neutral-900">
                  Rp {consultant.price.toLocaleString()}/sesi
                </div>
                <Button
                  onClick={() => {
                    setSelectedConsultant(consultant);
                    setShowBookingForm(true);
                  }}
                  disabled={consultant.availability === "offline"}
                >
                  Book Konsultasi
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5" />
                <span>Book Konsultasi dengan {selectedConsultant.name}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Pilih Tanggal
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Pilih Waktu
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={
                        selectedTime === slot.time ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className="flex items-center space-x-1"
                    >
                      <Clock className="h-3 w-3" />
                      <span>{slot.time}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Method Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Metode Konsultasi
                </label>
                <div className="flex space-x-2">
                  {selectedConsultant.consultationMethods.map((method) => {
                    const MethodIcon = getMethodIcon(method);
                    return (
                      <Button
                        key={method}
                        variant={
                          selectedMethod === method ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedMethod(method)}
                        className="flex items-center space-x-2"
                      >
                        <MethodIcon className="h-4 w-4" />
                        <span className="capitalize">{method}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <Card className="bg-neutral-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-neutral-900 mb-2">
                    Ringkasan Booking
                  </h4>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <p>Konsultan: {selectedConsultant.name}</p>
                    <p>Tanggal: {selectedDate}</p>
                    <p>Waktu: {selectedTime}</p>
                    <p>Metode: {selectedMethod}</p>
                    <p className="text-lg font-bold text-neutral-900 mt-2">
                      Total: Rp {selectedConsultant.price.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleBookConsultation}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1"
                >
                  Konfirmasi Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredConsultants.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Tidak ada konsultan ditemukan
            </h3>
            <p className="text-neutral-600">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
