"use client";

import { useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PersonalInfoStepProps {
  onNext: () => void;
  onSkip: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  data?: Record<string, unknown>;
}

interface PersonalInfoData {
  dateOfBirth?: string;
  gender?: string;
  occupation?: string;
  company?: string;
  phone?: string;
  maritalStatus?: string;
  dependents?: number;
  educationLevel?: string;
}

export function PersonalInfoStep({
  onNext,
  onSkip,
  onBack,
  isLoading = false,
  data = {},
}: PersonalInfoStepProps) {
  const { updateOnboardingData, submitPersonalInfo } = useOnboarding();

  const [formData, setFormData] = useState<PersonalInfoData>({
    dateOfBirth: "",
    gender: "",
    occupation: "",
    company: "",
    phone: "",
    maritalStatus: "",
    dependents: 0,
    educationLevel: "",
    ...data,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof PersonalInfoData,
    value: string | number
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation - semua field optional untuk onboarding
    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      newErrors.dateOfBirth = "Tanggal lahir tidak valid";
    }

    if (formData.dependents && formData.dependents < 0) {
      newErrors.dependents = "Jumlah tanggungan tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Update context data
      updateOnboardingData({
        personalInfo: formData,
      });

      // Submit to backend
      await submitPersonalInfo();

      // Move to next step
      onNext();
    } catch (error) {
      console.error("Error submitting personal info:", error);
    }
  };

  const handleSkip = () => {
    updateOnboardingData({
      personalInfo: {},
    });
    onSkip();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tanggal Lahir */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Jenis Kelamin */}
        <div className="space-y-2">
          <Label htmlFor="gender">Jenis Kelamin</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Laki-laki</SelectItem>
              <SelectItem value="FEMALE">Perempuan</SelectItem>
              <SelectItem value="OTHER">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pekerjaan */}
        <div className="space-y-2">
          <Label htmlFor="occupation">Pekerjaan</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => handleInputChange("occupation", e.target.value)}
            placeholder="Misal: Software Engineer"
          />
        </div>

        {/* Perusahaan */}
        <div className="space-y-2">
          <Label htmlFor="company">Perusahaan</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Nama perusahaan"
          />
        </div>

        {/* Nomor Telepon */}
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+62 xxx xxxx xxxx"
          />
        </div>

        {/* Status Pernikahan */}
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Status Pernikahan</Label>
          <Select
            value={formData.maritalStatus}
            onValueChange={(value) => handleInputChange("maritalStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLE">Belum Menikah</SelectItem>
              <SelectItem value="MARRIED">Menikah</SelectItem>
              <SelectItem value="DIVORCED">Cerai</SelectItem>
              <SelectItem value="WIDOWED">Janda/Duda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jumlah Tanggungan */}
        <div className="space-y-2">
          <Label htmlFor="dependents">Jumlah Tanggungan</Label>
          <Input
            id="dependents"
            type="number"
            min="0"
            value={formData.dependents}
            onChange={(e) =>
              handleInputChange("dependents", parseInt(e.target.value) || 0)
            }
            placeholder="0"
          />
          {errors.dependents && (
            <p className="text-sm text-red-600">{errors.dependents}</p>
          )}
        </div>

        {/* Tingkat Pendidikan */}
        <div className="space-y-2">
          <Label htmlFor="educationLevel">Tingkat Pendidikan</Label>
          <Select
            value={formData.educationLevel}
            onValueChange={(value) =>
              handleInputChange("educationLevel", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tingkat pendidikan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SD">SD</SelectItem>
              <SelectItem value="SMP">SMP</SelectItem>
              <SelectItem value="SMA">SMA/SMK</SelectItem>
              <SelectItem value="D1">Diploma 1</SelectItem>
              <SelectItem value="D2">Diploma 2</SelectItem>
              <SelectItem value="D3">Diploma 3</SelectItem>
              <SelectItem value="S1">Sarjana (S1)</SelectItem>
              <SelectItem value="S2">Magister (S2)</SelectItem>
              <SelectItem value="S3">Doktor (S3)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} disabled={isLoading}>
            Kembali
          </Button>
        )}

        <div className="flex gap-3 ml-auto">
          <Button variant="ghost" onClick={handleSkip} disabled={isLoading}>
            Lewati
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Lanjut"}
          </Button>
        </div>
      </div>
    </div>
  );
}
