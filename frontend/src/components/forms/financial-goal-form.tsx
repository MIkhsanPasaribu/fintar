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
import { formatCurrency } from "@/lib/utils";

interface FinancialGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FinancialGoalData) => void;
  initialData?: FinancialGoalData;
}

interface FinancialGoalData {
  name: string;
  target: number;
  current: number;
  targetDate: string;
  category: string;
  description?: string;
}

const goalCategories = [
  { value: "emergency", label: "Dana Darurat" },
  { value: "property", label: "Properti" },
  { value: "travel", label: "Liburan" },
  { value: "education", label: "Pendidikan" },
  { value: "retirement", label: "Pensiun" },
  { value: "investment", label: "Investasi" },
  { value: "business", label: "Bisnis" },
  { value: "other", label: "Lainnya" },
];

export default function FinancialGoalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: FinancialGoalFormProps) {
  const [formData, setFormData] = useState<FinancialGoalData>(
    initialData || {
      name: "",
      target: 0,
      current: 0,
      targetDate: "",
      category: "",
      description: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    field: keyof FinancialGoalData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama tujuan keuangan harus diisi";
    }

    if (formData.target <= 0) {
      newErrors.target = "Target harus lebih dari 0";
    }

    if (formData.current < 0) {
      newErrors.current = "Nilai saat ini tidak boleh negatif";
    }

    if (formData.current > formData.target) {
      newErrors.current = "Nilai saat ini tidak boleh melebihi target";
    }

    if (!formData.category) {
      newErrors.category = "Kategori harus dipilih";
    }

    if (!formData.targetDate) {
      newErrors.targetDate = "Tanggal target harus diisi";
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      if (targetDate <= today) {
        newErrors.targetDate = "Tanggal target harus di masa depan";
      }
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
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const progress =
    formData.target > 0 ? (formData.current / formData.target) * 100 : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <h2 className="text-xl font-bold text-text-primary">
          {initialData ? "Edit" : "Tambah"} Tujuan Keuangan
        </h2>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Tujuan"
              placeholder="e.g. Dana Darurat, Rumah Impian"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
            />

            <Select
              label="Kategori"
              placeholder="Pilih kategori"
              options={goalCategories}
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              error={errors.category}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Target (IDR)"
              type="number"
              placeholder="0"
              value={formData.target}
              onChange={(e) =>
                handleInputChange("target", parseInt(e.target.value) || 0)
              }
              error={errors.target}
            />

            <Input
              label="Jumlah Saat Ini (IDR)"
              type="number"
              placeholder="0"
              value={formData.current}
              onChange={(e) =>
                handleInputChange("current", parseInt(e.target.value) || 0)
              }
              error={errors.current}
            />
          </div>

          <Input
            label="Tanggal Target"
            type="date"
            value={formData.targetDate}
            onChange={(e) => handleInputChange("targetDate", e.target.value)}
            error={errors.targetDate}
          />

          <Textarea
            label="Deskripsi (Opsional)"
            placeholder="Jelaskan detail tujuan keuangan Anda..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
          />

          {/* Progress Preview */}
          {formData.target > 0 && (
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-text-primary mb-3">
                Preview Progress
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-metadata">Progress saat ini</span>
                  <span className="font-medium text-text-primary">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-metadata">
                    {formatCurrency(formData.current)}
                  </span>
                  <span className="text-text-metadata">
                    {formatCurrency(formData.target)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? "Update" : "Simpan"} Tujuan
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
