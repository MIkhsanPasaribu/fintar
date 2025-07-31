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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "../../lib/services/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, DollarSign } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  occupation?: string;
  company?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  currentSavings?: number;
  riskTolerance?: string;
  financialGoals?: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

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
        // If no profile exists, initialize with empty data
        const emptyProfile: Partial<UserProfile> = {
          id: `user_${Date.now()}`,
          email: "",
          username: "",
          firstName: "",
          lastName: "",
          phone: "",
          occupation: "",
          company: "",
          monthlyIncome: undefined,
          monthlyExpenses: undefined,
          currentSavings: undefined,
          riskTolerance: "",
          financialGoals: [],
        };
        setProfile(emptyProfile as UserProfile);
        setFormData(emptyProfile);
        setIsEditing(true); // Auto-enable editing for new profiles
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Gagal memuat profil. Silakan coba lagi.");

      // Initialize with empty profile on error
      const emptyProfile: Partial<UserProfile> = {
        id: `user_${Date.now()}`,
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        phone: "",
        occupation: "",
        company: "",
        monthlyIncome: undefined,
        monthlyExpenses: undefined,
        currentSavings: undefined,
        riskTolerance: "",
        financialGoals: [],
      };
      setProfile(emptyProfile as UserProfile);
      setFormData(emptyProfile);
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

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Belum diisi";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gagal Memuat Profil
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <Button
                onClick={loadProfile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Coba Lagi
              </Button>
              <Button
                onClick={() => {
                  setError(null);
                  setIsEditing(true);
                }}
                variant="outline"
              >
                Buat Profil Baru
              </Button>
            </div>
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
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Profil Pengguna
          </h1>
          <p className="text-text-description">
            Kelola informasi pribadi dan preferensi akun Anda
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Keuangan
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Pengaturan
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture & Basic Info */}
              <div className="lg:col-span-1">
                <Card>
                  <CardBody className="text-center">
                    <Avatar className="mx-auto mb-4 h-20 w-20">
                      <AvatarImage
                        src={profile?.avatar}
                        alt={`${profile?.firstName} ${profile?.lastName}`}
                      />
                      <AvatarFallback className="text-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {profile?.firstName && profile?.lastName
                        ? `${profile.firstName} ${profile.lastName}`
                        : profile?.username || "Pengguna"}
                    </h3>
                    <p className="text-text-metadata">{profile?.email}</p>
                    <p className="text-sm text-text-description mt-2">
                      {profile?.occupation || "Pekerjaan belum diisi"}
                    </p>
                  </CardBody>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Informasi Personal</CardTitle>
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => {
                        if (isEditing) {
                          setFormData(profile || {});
                        }
                        setIsEditing(!isEditing);
                      }}
                    >
                      {isEditing ? "Batal" : "Edit"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nama Depan</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={formData.firstName || ""}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-text-primary">
                            {profile?.firstName || "Belum diisi"}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nama Belakang</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={formData.lastName || ""}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-text-primary">
                            {profile?.lastName || "Belum diisi"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone || ""}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+62"
                        />
                      ) : (
                        <p className="text-text-primary">
                          {profile?.phone || "Belum diisi"}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="occupation">Pekerjaan</Label>
                      {isEditing ? (
                        <Input
                          id="occupation"
                          value={formData.occupation || ""}
                          onChange={(e) =>
                            handleInputChange("occupation", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-text-primary">
                          {profile?.occupation || "Belum diisi"}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="company">Perusahaan</Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={formData.company || ""}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-text-primary">
                          {profile?.company || "Belum diisi"}
                        </p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSave} disabled={isSaving}>
                          {isSaving ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData(profile || {});
                          }}
                        >
                          Batal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Informasi Keuangan</CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="ml-auto"
                  >
                    Edit Data Finansial
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyIncome">Pendapatan Bulanan</Label>
                    {isEditing ? (
                      <Input
                        id="monthlyIncome"
                        type="number"
                        value={formData.monthlyIncome || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "monthlyIncome",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Masukkan pendapatan bulanan"
                      />
                    ) : (
                      <p className="text-text-primary font-semibold">
                        {formatCurrency(profile?.monthlyIncome)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="monthlyExpenses">Pengeluaran Bulanan</Label>
                    {isEditing ? (
                      <Input
                        id="monthlyExpenses"
                        type="number"
                        value={formData.monthlyExpenses || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "monthlyExpenses",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Masukkan pengeluaran bulanan"
                      />
                    ) : (
                      <p className="text-text-primary font-semibold">
                        {formatCurrency(profile?.monthlyExpenses)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="currentSavings">Tabungan Saat Ini</Label>
                    {isEditing ? (
                      <Input
                        id="currentSavings"
                        type="number"
                        value={formData.currentSavings || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "currentSavings",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Masukkan jumlah tabungan"
                      />
                    ) : (
                      <p className="text-text-primary font-semibold">
                        {formatCurrency(profile?.currentSavings)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="riskTolerance">Toleransi Risiko</Label>
                    {isEditing ? (
                      <select
                        id="riskTolerance"
                        value={formData.riskTolerance || ""}
                        onChange={(e) =>
                          handleInputChange("riskTolerance", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Pilih toleransi risiko</option>
                        <option value="low">Rendah</option>
                        <option value="medium">Sedang</option>
                        <option value="high">Tinggi</option>
                      </select>
                    ) : (
                      <p className="text-text-primary">
                        {profile?.riskTolerance === "low" && "Rendah"}
                        {profile?.riskTolerance === "medium" && "Sedang"}
                        {profile?.riskTolerance === "high" && "Tinggi"}
                        {!profile?.riskTolerance && "Belum diisi"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="financialGoals">Tujuan Keuangan</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        id="financialGoals"
                        value={formData.financialGoals?.join(", ") || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "financialGoals",
                            e.target.value
                              .split(", ")
                              .filter((goal) => goal.trim())
                          )
                        }
                        placeholder="Masukkan tujuan keuangan (pisahkan dengan koma)"
                      />
                      <p className="text-sm text-text-description">
                        Contoh: Emergency Fund, Beli Rumah, Dana Pensiun
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile?.financialGoals?.length ? (
                        profile.financialGoals.map((goal, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {goal}
                          </span>
                        ))
                      ) : (
                        <p className="text-text-description">
                          Belum ada tujuan keuangan
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Menyimpan..." : "Simpan Data Finansial"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profile || {});
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-text-description mt-1">
                    Email tidak dapat diubah
                  </p>
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile?.username || ""}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-text-description mt-1">
                    Username tidak dapat diubah
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4">Preferensi Notifikasi</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifikasi</p>
                        <p className="text-sm text-text-description">
                          Terima notifikasi melalui email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rekomendasi Investasi</p>
                        <p className="text-sm text-text-description">
                          Terima rekomendasi investasi mingguan
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Laporan Keuangan</p>
                        <p className="text-sm text-text-description">
                          Terima laporan keuangan bulanan
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4 text-red-600">
                    Zona Bahaya
                  </h4>
                  <Button variant="destructive">Hapus Akun</Button>
                  <p className="text-sm text-text-description mt-2">
                    Menghapus akun akan menghilangkan semua data Anda secara
                    permanen
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
