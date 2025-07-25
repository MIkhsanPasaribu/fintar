/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, Select, Textarea, Modal } from "@/components/ui";
import { Consultant } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
  consultant: Consultant;
}

export default function BookingForm({
  isOpen,
  onClose,
  onSubmit,
  consultant,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    type: "CONSULTATION",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { value: "CONSULTATION", label: "Konsultasi" },
    { value: "FOLLOW_UP", label: "Follow-up" },
    { value: "EMERGENCY", label: "Darurat" },
  ];

  const durationOptions = [
    { value: "30", label: "30 menit" },
    { value: "60", label: "60 menit" },
    { value: "90", label: "90 menit" },
    { value: "120", label: "120 menit" },
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculatePrice = () => {
    const hours = formData.duration / 60;
    return consultant.hourlyRate * hours;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const scheduledAt = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime}`
      );

      const bookingData = {
        consultantId: consultant.id,
        type: formData.type,
        scheduledAt: scheduledAt.toISOString(),
        duration: formData.duration,
        price: calculatePrice(),
        notes: formData.notes,
      };

      await onSubmit(bookingData);
      onClose();
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate available time slots based on consultant availability
  const getAvailableTimeSlots = () => {
    const selectedDate = new Date(formData.scheduledDate);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    }).toLowerCase();

    const availability =
      consultant.availability?.[
        dayName as keyof typeof consultant.availability
      ];
    if (!availability) return [];

    interface TimeSlot {
      value: string;
      label: string;
    }

    const timeSlots: TimeSlot[] = [];
    availability.forEach((timeRange) => {
      const [startTime, endTime] = timeRange.split("-");
      // Generate 30-minute slots
      let current = startTime;
      while (current < endTime) {
        timeSlots.push({ value: current, label: current });
        // Add 30 minutes
        const [hours, minutes] = current.split(":").map(Number);
        const newMinutes = minutes + 30;
        const newHours = hours + Math.floor(newMinutes / 60);
        current = `${newHours.toString().padStart(2, "0")}:${(newMinutes % 60)
          .toString()
          .padStart(2, "0")}`;
        if (current >= endTime) break;
      }
    });

    return timeSlots;
  };

  const availableTimeSlots = formData.scheduledDate
    ? getAvailableTimeSlots()
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Book Konsultasi
            </h2>

            {/* Consultant Info */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={consultant.avatar}
                  alt={`${consultant.firstName} ${consultant.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {consultant.firstName} {consultant.lastName}
                  </h3>
                  <p className="text-text-description">
                    {consultant.experience} tahun pengalaman
                  </p>
                  <div className="text-success font-semibold">
                    {formatCurrency(consultant.hourlyRate)}/jam
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Booking Type */}
              <Select
                label="Jenis Konsultasi"
                options={typeOptions}
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                required
              />

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tanggal"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    handleInputChange("scheduledDate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <Select
                  label="Waktu"
                  options={availableTimeSlots}
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    handleInputChange("scheduledTime", e.target.value)
                  }
                  disabled={!formData.scheduledDate}
                  placeholder={
                    formData.scheduledDate
                      ? "Pilih waktu"
                      : "Pilih tanggal terlebih dahulu"
                  }
                  required
                />
              </div>

              {/* Duration */}
              <Select
                label="Durasi"
                options={durationOptions}
                value={formData.duration}
                onChange={(e) =>
                  handleInputChange("duration", parseInt(e.target.value))
                }
                required
              />

              {/* Notes */}
              <Textarea
                label="Catatan"
                placeholder="Jelaskan topik atau kebutuhan konsultasi Anda..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />

              {/* Price Summary */}
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-description">Total Biaya:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(calculatePrice())}
                  </span>
                </div>
                <p className="text-sm text-text-metadata mt-2">
                  {formData.duration} menit ×{" "}
                  {formatCurrency(consultant.hourlyRate)}/jam
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                  disabled={!formData.scheduledDate || !formData.scheduledTime}
                >
                  Konfirmasi Booking
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
