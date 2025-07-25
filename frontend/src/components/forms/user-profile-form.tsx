"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { User, MapPin, Briefcase, DollarSign } from "lucide-react";

interface UserProfileData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "";

  // Address
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  // Professional Info
  occupation: string;
  incomeRange: string;
  maritalStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "";
  dependents: number;

  // Financial Info
  financialGoals: string[];
  riskTolerance: "LOW" | "MODERATE" | "HIGH" | "AGGRESSIVE" | "";
  investmentExperience: string;
  emergencyFund: boolean;

  // Insurance
  insurance: {
    health: boolean;
    life: boolean;
    disability: boolean;
    property: boolean;
  };
}

interface UserProfileFormProps {
  initialData?: Partial<UserProfileData>;
  onSubmit?: (data: UserProfileData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const INCOME_RANGES = [
  "Dibawah 5 juta",
  "5 - 10 juta",
  "10 - 20 juta",
  "20 - 50 juta",
  "50 - 100 juta",
  "Diatas 100 juta",
];

const FINANCIAL_GOALS = [
  "Dana Darurat",
  "Membeli Rumah",
  "Pendidikan Anak",
  "Pensiun",
  "Liburan",
  "Investasi",
  "Bayar Hutang",
  "Memulai Bisnis",
];

const INVESTMENT_EXPERIENCE = [
  "Pemula (< 1 tahun)",
  "Menengah (1-3 tahun)",
  "Berpengalaman (3-5 tahun)",
  "Ahli (> 5 tahun)",
];

export function UserProfileForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
}: UserProfileFormProps) {
  const [formData, setFormData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Indonesia",
    },
    occupation: "",
    incomeRange: "",
    maritalStatus: "",
    dependents: 0,
    financialGoals: [],
    riskTolerance: "",
    investmentExperience: "",
    emergencyFund: false,
    insurance: {
      health: false,
      life: false,
      disability: false,
      property: false,
    },
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof UserProfileData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter((g) => g !== goal)
        : [...prev.financialGoals, goal],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "Nama depan wajib diisi";
    if (!formData.lastName.trim())
      newErrors.lastName = "Nama belakang wajib diisi";
    if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
    if (!formData.phone.trim()) newErrors.phone = "Nomor telepon wajib diisi";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Tanggal lahir wajib diisi";
    if (!formData.occupation.trim())
      newErrors.occupation = "Pekerjaan wajib diisi";
    if (!formData.incomeRange)
      newErrors.incomeRange = "Range pendapatan wajib dipilih";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Format nomor telepon tidak valid";
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Profil Pengguna
        </h1>
        <p className="text-text-description">
          Lengkapi profil Anda untuk mendapatkan rekomendasi keuangan yang lebih
          personal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Informasi Dasar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nama Depan *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Masukkan nama depan"
                className={errors.firstName ? "border-danger" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-danger">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nama Belakang *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Masukkan nama belakang"
                className={errors.lastName ? "border-danger" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-danger">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contoh@email.com"
                className={errors.email ? "border-danger" : ""}
              />
              {errors.email && (
                <p className="text-sm text-danger">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+62 812 3456 7890"
                className={errors.phone ? "border-danger" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-danger">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Tanggal Lahir *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className={errors.dateOfBirth ? "border-danger" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-danger">{errors.dateOfBirth}</p>
              )}
            </div>

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
          </div>
        </Card>

        {/* Address Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Alamat</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Alamat Lengkap</Label>
              <Textarea
                id="street"
                value={formData.address.street}
                onChange={(e) =>
                  handleInputChange("address.street", e.target.value)
                }
                placeholder="Jalan, No. Rumah, RT/RW"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Kota</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) =>
                  handleInputChange("address.city", e.target.value)
                }
                placeholder="Nama kota"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Provinsi</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) =>
                  handleInputChange("address.state", e.target.value)
                }
                placeholder="Nama provinsi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Kode Pos</Label>
              <Input
                id="postalCode"
                value={formData.address.postalCode}
                onChange={(e) =>
                  handleInputChange("address.postalCode", e.target.value)
                }
                placeholder="12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Negara</Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={(e) =>
                  handleInputChange("address.country", e.target.value)
                }
                placeholder="Indonesia"
              />
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Informasi Profesi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Pekerjaan *</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) =>
                  handleInputChange("occupation", e.target.value)
                }
                placeholder="Pekerjaan atau profesi"
                className={errors.occupation ? "border-danger" : ""}
              />
              {errors.occupation && (
                <p className="text-sm text-danger">{errors.occupation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomeRange">Range Pendapatan *</Label>
              <Select
                value={formData.incomeRange}
                onValueChange={(value) =>
                  handleInputChange("incomeRange", value)
                }
              >
                <SelectTrigger
                  className={errors.incomeRange ? "border-danger" : ""}
                >
                  <SelectValue placeholder="Pilih range pendapatan" />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incomeRange && (
                <p className="text-sm text-danger">{errors.incomeRange}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Status Pernikahan</Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) =>
                  handleInputChange("maritalStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status pernikahan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Belum Menikah</SelectItem>
                  <SelectItem value="MARRIED">Menikah</SelectItem>
                  <SelectItem value="DIVORCED">Cerai</SelectItem>
                  <SelectItem value="WIDOWED">Janda/Duda</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
            </div>
          </div>
        </Card>

        {/* Financial Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Informasi Keuangan
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Tujuan Keuangan</Label>
              <div className="flex flex-wrap gap-2">
                {FINANCIAL_GOALS.map((goal) => (
                  <Badge
                    key={goal}
                    variant={
                      formData.financialGoals.includes(goal)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer hover:bg-primary-100"
                    onClick={() => handleGoalToggle(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Toleransi Risiko</Label>
                <Select
                  value={formData.riskTolerance}
                  onValueChange={(value) =>
                    handleInputChange("riskTolerance", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih toleransi risiko" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Konservatif (Rendah)</SelectItem>
                    <SelectItem value="MODERATE">Moderat</SelectItem>
                    <SelectItem value="HIGH">Agresif (Tinggi)</SelectItem>
                    <SelectItem value="AGGRESSIVE">Sangat Agresif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentExperience">
                  Pengalaman Investasi
                </Label>
                <Select
                  value={formData.investmentExperience}
                  onValueChange={(value) =>
                    handleInputChange("investmentExperience", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pengalaman investasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_EXPERIENCE.map((exp) => (
                      <SelectItem key={exp} value={exp}>
                        {exp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Asuransi yang Dimiliki</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.insurance).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleInputChange(`insurance.${key}`, e.target.checked)
                      }
                      className="rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-body capitalize">
                      {key === "health"
                        ? "Kesehatan"
                        : key === "life"
                        ? "Jiwa"
                        : key === "disability"
                        ? "Disabilitas"
                        : "Properti"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emergencyFund"
                checked={formData.emergencyFund}
                onChange={(e) =>
                  handleInputChange("emergencyFund", e.target.checked)
                }
                className="rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="emergencyFund">
                Saya sudah memiliki dana darurat
              </Label>
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </div>
      </form>
    </div>
  );
}
