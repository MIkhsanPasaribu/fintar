/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui";
import { useToast } from "@/components/ui/toast";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionData) => Promise<void>;
  initialData?: TransactionData;
}

interface TransactionData {
  type: "INCOME" | "EXPENSE" | "INVESTMENT" | "DEBT" | "ASSET";
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  recurring: boolean;
  frequency?: string;
  tags: string[];
}

const transactionTypes = [
  { value: "INCOME", label: "Pemasukan" },
  { value: "EXPENSE", label: "Pengeluaran" },
  { value: "INVESTMENT", label: "Investasi" },
  { value: "DEBT", label: "Utang" },
  { value: "ASSET", label: "Aset" },
];

const categoryOptions = {
  INCOME: [
    { value: "SALARY", label: "Gaji" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "BUSINESS", label: "Bisnis" },
    { value: "INVESTMENT_RETURN", label: "Return Investasi" },
    { value: "OTHER", label: "Lainnya" },
  ],
  EXPENSE: [
    { value: "FOOD", label: "Makanan" },
    { value: "TRANSPORTATION", label: "Transportasi" },
    { value: "UTILITIES", label: "Utilitas" },
    { value: "RENT", label: "Sewa" },
    { value: "ENTERTAINMENT", label: "Hiburan" },
    { value: "HEALTHCARE", label: "Kesehatan" },
    { value: "EDUCATION", label: "Pendidikan" },
    { value: "OTHER", label: "Lainnya" },
  ],
  INVESTMENT: [
    { value: "STOCKS", label: "Saham" },
    { value: "MUTUAL_FUND", label: "Reksadana" },
    { value: "BONDS", label: "Obligasi" },
    { value: "CRYPTO", label: "Cryptocurrency" },
    { value: "GOLD", label: "Emas" },
    { value: "PROPERTY", label: "Properti" },
    { value: "OTHER", label: "Lainnya" },
  ],
  DEBT: [
    { value: "CREDIT_CARD", label: "Kartu Kredit" },
    { value: "PERSONAL_LOAN", label: "KTA" },
    { value: "MORTGAGE", label: "KPR" },
    { value: "CAR_LOAN", label: "Kredit Kendaraan" },
    { value: "OTHER", label: "Lainnya" },
  ],
  ASSET: [
    { value: "PROPERTY", label: "Properti" },
    { value: "VEHICLE", label: "Kendaraan" },
    { value: "EQUIPMENT", label: "Peralatan" },
    { value: "JEWELRY", label: "Perhiasan" },
    { value: "OTHER", label: "Lainnya" },
  ],
};

const frequencyOptions = [
  { value: "DAILY", label: "Harian" },
  { value: "WEEKLY", label: "Mingguan" },
  { value: "MONTHLY", label: "Bulanan" },
  { value: "QUARTERLY", label: "Triwulan" },
  { value: "YEARLY", label: "Tahunan" },
];

export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TransactionFormProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<TransactionData>(
    initialData || {
      type: "EXPENSE",
      category: "",
      amount: 0,
      currency: "IDR",
      description: "",
      date: new Date().toISOString().split("T")[0],
      recurring: false,
      frequency: "",
      tags: [],
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (field: keyof TransactionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      type: type as TransactionData["type"],
      category: "", // Reset category when type changes
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = "Tipe transaksi harus dipilih";
    }

    if (!formData.category) {
      newErrors.category = "Kategori harus dipilih";
    }

    if (formData.amount <= 0) {
      newErrors.amount = "Jumlah harus lebih dari 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi harus diisi";
    }

    if (!formData.date) {
      newErrors.date = "Tanggal harus diisi";
    }

    if (formData.recurring && !formData.frequency) {
      newErrors.frequency = "Frekuensi harus dipilih untuk transaksi berulang";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      addToast({
        title: "Berhasil",
        description: `Transaksi ${initialData ? "diperbarui" : "ditambahkan"}`,
        variant: "success",
      });
      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        description: "Gagal menyimpan transaksi",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCategories = () => {
    return categoryOptions[formData.type] || [];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <h2 className="text-xl font-bold text-text-primary">
          {initialData ? "Edit" : "Tambah"} Transaksi
        </h2>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipe Transaksi"
              placeholder="Pilih tipe"
              options={transactionTypes}
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              error={errors.type}
            />

            <Select
              label="Kategori"
              placeholder="Pilih kategori"
              options={getCurrentCategories()}
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              error={errors.category}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Jumlah (IDR)"
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) =>
                handleInputChange("amount", parseFloat(e.target.value) || 0)
              }
              error={errors.amount}
            />

            <Input
              label="Tanggal"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              error={errors.date}
            />
          </div>

          <Textarea
            label="Deskripsi"
            placeholder="Jelaskan detail transaksi..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            rows={3}
          />

          {/* Recurring Transaction */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) =>
                  handleInputChange("recurring", e.target.checked)
                }
                className="w-4 h-4 text-primary border-neutral-200 rounded focus:ring-primary"
              />
              <label
                htmlFor="recurring"
                className="text-sm font-medium text-text-primary"
              >
                Transaksi berulang
              </label>
            </div>

            {formData.recurring && (
              <Select
                label="Frekuensi"
                placeholder="Pilih frekuensi"
                options={frequencyOptions}
                value={formData.frequency}
                onChange={(e) => handleInputChange("frequency", e.target.value)}
                error={errors.frequency}
              />
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Tag (Opsional)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Tambah tag..."
                className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-text-primary placeholder-text-metadata focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                size="sm"
              >
                Tambah
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-400 hover:text-primary-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? "Update" : "Simpan"} Transaksi
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
