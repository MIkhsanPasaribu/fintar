/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface ConsultationBookingData {
  consultantId: string;
  type:
    | "FINANCIAL_PLANNING"
    | "INVESTMENT_ADVICE"
    | "DEBT_MANAGEMENT"
    | "INSURANCE_PLANNING"
    | "TAX_PLANNING"
    | "RETIREMENT_PLANNING"
    | "EMERGENCY_FUND"
    | "BUDGETING";
  scheduledAt: string;
  duration: number;
  notes: string;
  urgencyLevel: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  preferredCommunication: "VIDEO_CALL" | "PHONE_CALL" | "IN_PERSON" | "CHAT";
  topics: string[];
  documents: File[];
}

interface Consultant {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  availability: Record<string, string[]>;
  bio: string;
  avatar?: string;
}

interface ConsultationBookingFormProps {
  consultant?: Consultant;
  consultants?: Consultant[];
  onSubmit?: (data: ConsultationBookingData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CONSULTATION_TYPES = [
  {
    value: "FINANCIAL_PLANNING",
    label: "Perencanaan Keuangan",
    description: "Bantuan menyeluruh untuk merencanakan keuangan pribadi",
  },
  {
    value: "INVESTMENT_ADVICE",
    label: "Konsultasi Investasi",
    description: "Panduan investasi dan manajemen portofolio",
  },
  {
    value: "DEBT_MANAGEMENT",
    label: "Manajemen Utang",
    description: "Strategi mengelola dan melunasi utang",
  },
  {
    value: "INSURANCE_PLANNING",
    label: "Perencanaan Asuransi",
    description: "Pemilihan produk asuransi yang tepat",
  },
  {
    value: "TAX_PLANNING",
    label: "Perencanaan Pajak",
    description: "Optimalisasi strategi perpajakan",
  },
  {
    value: "RETIREMENT_PLANNING",
    label: "Perencanaan Pensiun",
    description: "Persiapan finansial untuk masa pensiun",
  },
  {
    value: "EMERGENCY_FUND",
    label: "Dana Darurat",
    description: "Strategi membangun dana darurat",
  },
  {
    value: "BUDGETING",
    label: "Budgeting",
    description: "Pembuatan dan pengelolaan anggaran",
  },
];

const DURATIONS = [
  { value: 30, label: "30 menit", price: 0.5 },
  { value: 60, label: "1 jam", price: 1 },
  { value: 90, label: "1.5 jam", price: 1.5 },
  { value: 120, label: "2 jam", price: 2 },
];

const COMMUNICATION_TYPES = [
  { value: "VIDEO_CALL", label: "Video Call", icon: "📹" },
  { value: "PHONE_CALL", label: "Telepon", icon: "📞" },
  { value: "IN_PERSON", label: "Tatap Muka", icon: "👥" },
  { value: "CHAT", label: "Chat", icon: "💬" },
];

const COMMON_TOPICS = [
  "Analisis Keuangan",
  "Investasi Saham",
  "Investasi Reksa Dana",
  "Asuransi Jiwa",
  "Asuransi Kesehatan",
  "KPR",
  "Kredit Kendaraan",
  "Dana Pendidikan",
  "Perencanaan Pensiun",
  "Bisnis",
  "Pajak",
  "Estate Planning",
];

export function ConsultationBookingForm({
  consultant,
  consultants = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: ConsultationBookingFormProps) {
  const [formData, setFormData] = useState<ConsultationBookingData>({
    consultantId: consultant?.id || "",
    type: "FINANCIAL_PLANNING",
    scheduledAt: "",
    duration: 60,
    notes: "",
    urgencyLevel: "MEDIUM",
    preferredCommunication: "VIDEO_CALL",
    topics: [],
    documents: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const selectedConsultant =
    consultant || consultants.find((c) => c.id === formData.consultantId);
  const selectedDuration = DURATIONS.find((d) => d.value === formData.duration);
  const totalPrice =
    selectedConsultant && selectedDuration
      ? selectedConsultant.hourlyRate * selectedDuration.price
      : 0;

  const handleInputChange = (
    field: keyof ConsultationBookingData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleTopicToggle = (topic: string) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];

    setSelectedTopics(newTopics);
    handleInputChange("topics", newTopics);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...fileArray],
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.consultantId)
      newErrors.consultantId = "Pilih konsultan terlebih dahulu";
    if (!formData.scheduledAt)
      newErrors.scheduledAt = "Tanggal dan waktu konsultasi wajib diisi";
    if (!formData.notes.trim())
      newErrors.notes = "Jelaskan kebutuhan konsultasi Anda";

    // Validate date is in the future
    if (formData.scheduledAt) {
      const selectedDate = new Date(formData.scheduledAt);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.scheduledAt = "Pilih tanggal dan waktu di masa depan";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2); // Minimum 2 hours from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Booking Konsultasi
        </h1>
        <p className="text-text-description">
          Jadwalkan sesi konsultasi dengan konsultan keuangan pilihan Anda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Consultant Selection */}
        {!consultant && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">
                Pilih Konsultan
              </h2>
            </div>

            <Select
              value={formData.consultantId}
              onValueChange={(value) =>
                handleInputChange("consultantId", value)
              }
            >
              <SelectTrigger
                className={errors.consultantId ? "border-danger" : ""}
              >
                <SelectValue placeholder="Pilih konsultan yang Anda inginkan" />
              </SelectTrigger>
              <SelectContent>
                {consultants.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {c.firstName} {c.lastName}
                      </span>
                      <span className="text-sm text-text-metadata">
                        {formatCurrency(c.hourlyRate)}/jam
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.consultantId && (
              <p className="text-sm text-danger mt-1">{errors.consultantId}</p>
            )}
          </Card>
        )}

        {/* Consultant Info */}
        {selectedConsultant && (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                {selectedConsultant.avatar ? (
                  <img
                    src={selectedConsultant.avatar}
                    alt={`${selectedConsultant.firstName} ${selectedConsultant.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-1">
                  {selectedConsultant.firstName} {selectedConsultant.lastName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-text-metadata mb-2">
                  <span>{selectedConsultant.experience} tahun pengalaman</span>
                  <span>⭐ {selectedConsultant.rating}</span>
                  <span>
                    {formatCurrency(selectedConsultant.hourlyRate)}/jam
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedConsultant.specialization.map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-text-description line-clamp-2">
                  {selectedConsultant.bio}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Consultation Details */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Detail Konsultasi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Jenis Konsultasi</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-text-metadata">
                          {type.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durasi</Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) =>
                  handleInputChange("duration", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((duration) => (
                    <SelectItem
                      key={duration.value}
                      value={duration.value.toString()}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{duration.label}</span>
                        {selectedConsultant && (
                          <span className="text-sm text-text-metadata ml-4">
                            {formatCurrency(
                              selectedConsultant.hourlyRate * duration.price
                            )}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Tanggal & Waktu</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                min={getMinDateTime()}
                onChange={(e) =>
                  handleInputChange("scheduledAt", e.target.value)
                }
                className={errors.scheduledAt ? "border-danger" : ""}
              />
              {errors.scheduledAt && (
                <p className="text-sm text-danger">{errors.scheduledAt}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredCommunication">Metode Komunikasi</Label>
              <Select
                value={formData.preferredCommunication}
                onValueChange={(value) =>
                  handleInputChange("preferredCommunication", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNICATION_TYPES.map((comm) => (
                    <SelectItem key={comm.value} value={comm.value}>
                      {comm.icon} {comm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgencyLevel">Tingkat Urgensi</Label>
              <Select
                value={formData.urgencyLevel}
                onValueChange={(value) =>
                  handleInputChange("urgencyLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Rendah - Dalam 1-2 minggu</SelectItem>
                  <SelectItem value="MEDIUM">
                    Sedang - Dalam 3-5 hari
                  </SelectItem>
                  <SelectItem value="HIGH">Tinggi - Dalam 1-2 hari</SelectItem>
                  <SelectItem value="URGENT">
                    Mendesak - Hari ini/besok
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Topik yang Ingin Dibahas</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_TOPICS.map((topic) => (
                <Badge
                  key={topic}
                  variant={
                    selectedTopics.includes(topic) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary-100"
                  onClick={() => handleTopicToggle(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="notes">Deskripsi Kebutuhan Konsultasi</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Jelaskan secara detail apa yang ingin Anda konsultasikan, situasi keuangan saat ini, dan hasil yang diharapkan..."
              rows={4}
              className={errors.notes ? "border-danger" : ""}
            />
            {errors.notes && (
              <p className="text-sm text-danger">{errors.notes}</p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="documents">Dokumen Pendukung (Opsional)</Label>
            <Input
              id="documents"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="cursor-pointer"
            />
            <p className="text-xs text-text-metadata">
              Upload dokumen seperti laporan keuangan, slip gaji, dll. (Max 5MB
              per file)
            </p>

            {formData.documents.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-background-soft rounded text-sm"
                  >
                    <span>{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Price Summary */}
        {selectedConsultant && (
          <Card className="p-6">
            <h3 className="font-semibold text-text-primary mb-4">
              Ringkasan Biaya
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Konsultasi ({selectedDuration?.label})</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Admin</span>
                <span>Gratis</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button type="submit" disabled={isLoading || !selectedConsultant}>
            {isLoading ? "Memproses..." : "Book Konsultasi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
