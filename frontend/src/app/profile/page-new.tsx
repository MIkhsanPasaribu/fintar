"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui";
import { Button } from "@/components/ui/tombol";
import { userService } from "../../lib/services/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/forms/FormField";
import { Settings, User, DollarSign, Briefcase } from "lucide-react";
import { UserProfile } from "../../types";

const FORM_OPTIONS = {
  GENDER: [
    { value: "MALE", label: "Laki-laki" },
    { value: "FEMALE", label: "Perempuan" },
    { value: "OTHER", label: "Lainnya" },
  ],
  MARITAL_STATUS: [
    { value: "SINGLE", label: "Belum Menikah" },
    { value: "MARRIED", label: "Menikah" },
    { value: "DIVORCED", label: "Bercerai" },
    { value: "WIDOWED", label: "Janda/Duda" },
  ],
  RISK_TOLERANCE: [
    { value: "LOW", label: "Konservatif" },
    { value: "MODERATE", label: "Moderat" },
    { value: "HIGH", label: "Agresif" },
  ],
  INVESTMENT_EXPERIENCE: [
    { value: "Beginner", label: "Pemula" },
    { value: "Intermediate", label: "Menengah" },
    { value: "Advanced", label: "Ahli" },
  ],
  EDUCATION_LEVEL: [
    { value: "SMA", label: "SMA/SMK" },
    { value: "Diploma", label: "Diploma" },
    { value: "Bachelor's Degree", label: "Sarjana (S1)" },
    { value: "Master's Degree", label: "Magister (S2)" },
    { value: "Doctorate", label: "Doktor (S3)" },
  ],
  CURRENCY: [
    { value: "IDR", label: "Rupiah (IDR)" },
    { value: "USD", label: "US Dollar (USD)" },
  ],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await userService.getProfile();

      if (profileData) {
        setProfile(profileData);
        setFormData(profileData);
      } else {
        // Initialize empty profile
        const emptyProfile: Partial<UserProfile> = {
          currency: "IDR",
          dependents: 0,
          financialGoals: [],
        };
        setProfile(emptyProfile as UserProfile);
        setFormData(emptyProfile);
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Gagal memuat profil. Silakan coba lagi.");
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      await userService.updateProfile(formData);
      await loadProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFinancialGoalsChange = (
    field: keyof UserProfile,
    goals: string
  ) => {
    const goalsArray = goals
      .split(",")
      .map((goal) => goal.trim())
      .filter((goal) => goal.length > 0);
    setFormData((prev) => ({
      ...prev,
      financialGoals: goalsArray,
    }));
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Belum diisi";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: profile?.currency || "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gagal Memuat Profil
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={loadProfile}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials =
    `${profile?.firstName?.[0] || ""}${profile?.lastName?.[0] || ""}` ||
    profile?.username?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Profil Pengguna
              </h1>
              <p className="text-text-description">
                Kelola informasi pribadi dan preferensi akun Anda
              </p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => {
                if (isEditing) {
                  setFormData(profile || {});
                }
                setIsEditing(!isEditing);
              }}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {isEditing ? "Batal" : "Edit Profil"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardBody className="flex items-center space-x-6 p-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={profile?.avatar}
                alt={`${profile?.firstName} ${profile?.lastName}`}
              />
              <AvatarFallback className="text-lg bg-primary-light text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary">
                {profile?.firstName && profile?.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile?.username || "Pengguna"}
              </h2>
              <p className="text-text-metadata">{profile?.email}</p>
              <p className="text-text-description mt-1">
                {profile?.occupation
                  ? `${profile.occupation}${
                      profile.company ? ` di ${profile.company}` : ""
                    }`
                  : "Pekerjaan belum diisi"}
              </p>
            </div>
            {profile?.monthlyIncome && (
              <div className="text-right">
                <p className="text-sm text-text-description">
                  Penghasilan Bulanan
                </p>
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(profile.monthlyIncome)}
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Keuangan
            </TabsTrigger>
            <TabsTrigger value="additional" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Tambahan
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Pengaturan
            </TabsTrigger>
          </TabsList>

          {/* Personal Tab */}
          <TabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informasi Dasar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Nama Depan"
                      field="firstName"
                      value={formData.firstName}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama depan"
                    />
                    <FormField
                      label="Nama Belakang"
                      field="lastName"
                      value={formData.lastName}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama belakang"
                    />
                  </div>

                  <FormField
                    label="Nomor Telepon"
                    field="phone"
                    value={formData.phone}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    placeholder="+62812345678"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Tanggal Lahir"
                      field="dateOfBirth"
                      value={formData.dateOfBirth}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      type="date"
                    />
                    <FormField
                      label="Jenis Kelamin"
                      field="gender"
                      value={formData.gender}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      type="select"
                      options={FORM_OPTIONS.GENDER}
                      placeholder="Pilih jenis kelamin"
                    />
                  </div>

                  <FormField
                    label="Alamat"
                    field="address"
                    value={formData.address}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="textarea"
                    placeholder="Masukkan alamat lengkap"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Informasi Pekerjaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    label="Pekerjaan"
                    field="occupation"
                    value={formData.occupation}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    placeholder="Software Engineer"
                  />

                  <FormField
                    label="Perusahaan"
                    field="company"
                    value={formData.company}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    placeholder="PT. Teknologi Indonesia"
                  />

                  <FormField
                    label="Pendidikan Terakhir"
                    field="educationLevel"
                    value={formData.educationLevel}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="select"
                    options={FORM_OPTIONS.EDUCATION_LEVEL}
                    placeholder="Pilih pendidikan terakhir"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Status Pernikahan"
                      field="maritalStatus"
                      value={formData.maritalStatus}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      type="select"
                      options={FORM_OPTIONS.MARITAL_STATUS}
                      placeholder="Pilih status"
                    />
                    <FormField
                      label="Jumlah Tanggungan"
                      field="dependents"
                      value={formData.dependents}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      type="number"
                      displayValue={`${profile?.dependents || 0} orang`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Informasi Keuangan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Penghasilan Bulanan"
                      field="monthlyIncome"
                      value={formData.monthlyIncome}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="15000000"
                      displayValue={formatCurrency(profile?.monthlyIncome)}
                    />
                    <FormField
                      label="Pengeluaran Bulanan"
                      field="monthlyExpenses"
                      value={formData.monthlyExpenses}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="10000000"
                      displayValue={formatCurrency(profile?.monthlyExpenses)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Tabungan Saat Ini"
                      field="currentSavings"
                      value={formData.currentSavings}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="50000000"
                      displayValue={formatCurrency(profile?.currentSavings)}
                    />
                    <FormField
                      label="Utang Saat Ini"
                      field="currentDebt"
                      value={formData.currentDebt}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="5000000"
                      displayValue={formatCurrency(profile?.currentDebt)}
                    />
                  </div>

                  <FormField
                    label="Dana Darurat"
                    field="emergencyFundAmount"
                    value={formData.emergencyFundAmount}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="30000000"
                    displayValue={formatCurrency(profile?.emergencyFundAmount)}
                  />

                  <FormField
                    label="Tujuan Keuangan (pisahkan dengan koma)"
                    field="financialGoals"
                    value={formData.financialGoals?.join(", ")}
                    isEditing={isEditing}
                    onChange={handleFinancialGoalsChange}
                    type="textarea"
                    placeholder="Emergency Fund, Buy House, Retirement"
                    displayValue={
                      profile?.financialGoals &&
                      profile.financialGoals.length > 0
                        ? profile.financialGoals.join(", ")
                        : "Belum diisi"
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investasi & Preferensi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    label="Toleransi Risiko"
                    field="riskTolerance"
                    value={formData.riskTolerance}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="select"
                    options={FORM_OPTIONS.RISK_TOLERANCE}
                    placeholder="Pilih toleransi risiko"
                  />

                  <FormField
                    label="Pengalaman Investasi"
                    field="investmentExperience"
                    value={formData.investmentExperience}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="select"
                    options={FORM_OPTIONS.INVESTMENT_EXPERIENCE}
                    placeholder="Pilih pengalaman"
                  />

                  <FormField
                    label="Investasi Saat Ini"
                    field="currentInvestments"
                    value={formData.currentInvestments}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="textarea"
                    placeholder="Saham, Reksa Dana, Obligasi"
                  />

                  <FormField
                    label="Mata Uang"
                    field="currency"
                    value={formData.currency}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="select"
                    options={FORM_OPTIONS.CURRENCY}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Additional Tab */}
          <TabsContent value="additional">
            <Card>
              <CardHeader>
                <CardTitle>Aset & Kewajiban</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    label="Aset yang Dimiliki"
                    field="assets"
                    value={formData.assets}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="textarea"
                    placeholder="Rumah, Mobil, Tabungan"
                  />

                  <FormField
                    label="Kewajiban/Utang"
                    field="liabilities"
                    value={formData.liabilities}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="textarea"
                    placeholder="KPR, Kredit Mobil, Kartu Kredit"
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Asuransi"
                    field="insurance"
                    value={formData.insurance}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    type="textarea"
                    placeholder="Asuransi Kesehatan, Jiwa, Kendaraan"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Akun</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-text-description">
                        {profile?.email}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ubah Email
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-text-description">
                        Terakhir diubah 30 hari yang lalu
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ubah Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Notifikasi</h4>
                      <p className="text-sm text-text-description">
                        Kelola preferensi notifikasi
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Pengaturan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        {isEditing && (
          <div className="fixed bottom-6 right-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(profile || {});
                  setIsEditing(false);
                }}
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary-dark"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
