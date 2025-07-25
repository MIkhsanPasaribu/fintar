"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { X, Calendar, Clock, User } from "lucide-react";

interface Consultant {
  id: string;
  firstName: string;
  lastName: string;
  hourlyRate: number;
}

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
  consultant: Consultant;
}

interface BookingFormData {
  consultantId: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
  contactEmail: string;
  contactPhone: string;
}

export default function BookingForm({
  isOpen,
  onClose,
  onSubmit,
  consultant,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    consultantId: consultant.id,
    date: "",
    time: "",
    duration: 60,
    notes: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({
        consultantId: consultant.id,
        date: "",
        time: "",
        duration: 60,
        notes: "",
        contactEmail: "",
        contactPhone: "",
      });
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotal = () => {
    const hours = formData.duration / 60;
    return consultant.hourlyRate * hours;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Book Konsultasi</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-text-description">
                dengan {consultant.firstName} {consultant.lastName}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Tanggal</span>
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Waktu</span>
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Durasi (menit)</Label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value={30}>30 menit</option>
                    <option value={60}>60 menit</option>
                    <option value={90}>90 menit</option>
                    <option value={120}>120 menit</option>
                  </select>
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="contactEmail"
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Email Kontak</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Nomor Telepon</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+62812345678"
                    required
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Jelaskan topik yang ingin didiskusikan..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={3}
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-description">
                      {formData.duration} menit ×{" "}
                      {formatCurrency(consultant.hourlyRate)}/jam
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Memproses..." : "Book Sekarang"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
