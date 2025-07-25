"use client";

import { motion } from "framer-motion";
import { Avatar, Badge, Button } from "@/components/ui";
import { Consultant } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ConsultantCardProps {
  consultant: Consultant;
  onBook: (consultantId: string) => void;
  onViewProfile: (consultantId: string) => void;
}

const StarIcon = () => (
  <svg className="w-4 h-4 fill-current text-[#FFB800]" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default function ConsultantCard({
  consultant,
  onBook,
  onViewProfile,
}: ConsultantCardProps) {
  const getSpecializationLabel = (spec: string) => {
    const labels = {
      FINANCIAL_PLANNING: "Perencanaan Keuangan",
      INVESTMENT_ADVICE: "Konsultasi Investasi",
      DEBT_MANAGEMENT: "Manajemen Utang",
      RETIREMENT_PLANNING: "Perencanaan Pensiun",
      TAX_PLANNING: "Perencanaan Pajak",
      BUDGETING: "Perencanaan Anggaran",
      INSURANCE_PLANNING: "Perencanaan Asuransi",
      EMERGENCY_FUND: "Dana Darurat",
    };
    return labels[spec as keyof typeof labels] || spec;
  };

  const getLanguageLabel = (lang: string) => {
    const labels = {
      id: "Indonesia",
      en: "English",
      mandarin: "Mandarin",
      arabic: "Arabic",
    };
    return labels[lang as keyof typeof labels] || lang;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-[#E9ECEF] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#0052CC] transition-all duration-300"
    >
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar
              src={consultant.avatar}
              firstName={consultant.firstName}
              lastName={consultant.lastName}
              size="lg"
              className="ring-2 ring-[#E9ECEF]"
            />
            {consultant.isActive && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00C853] border-2 border-white rounded-full flex items-center justify-center">
                <CheckIcon />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-[#0A1628] truncate">
              {consultant.firstName} {consultant.lastName}
            </h3>

            {/* Rating and Experience */}
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1">
                <StarIcon />
                <span className="text-sm font-semibold text-[#37474F]">
                  {consultant.rating.toFixed(1)}
                </span>
              </div>
              <div className="h-1 w-1 bg-[#90A4AE] rounded-full"></div>
              <span className="text-sm text-[#78909C]">
                {consultant.experience} tahun
              </span>
            </div>
          </div>

          {/* Price Badge */}
          <div className="text-right">
            <div className="bg-gradient-to-r from-[#00C853] to-[#4CAF50] text-white px-3 py-1 rounded-lg">
              <div className="text-lg font-bold">
                {formatCurrency(consultant.hourlyRate)}
              </div>
              <div className="text-xs opacity-90">per jam</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-4">
        {/* Specializations */}
        <div className="mb-4">
          <div className="text-sm font-medium text-[#37474F] mb-2">
            Spesialisasi:
          </div>
          <div className="flex flex-wrap gap-2">
            {consultant.specialization.slice(0, 2).map((spec) => (
              <Badge
                key={spec}
                className="bg-[#E3F2FD] text-[#0052CC] border border-[#2196F3]/20"
                size="sm"
              >
                {getSpecializationLabel(spec)}
              </Badge>
            ))}
            {consultant.specialization.length > 2 && (
              <Badge
                className="bg-[#F5F7FA] text-[#78909C] border border-[#E9ECEF]"
                size="sm"
              >
                +{consultant.specialization.length - 2} lainnya
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-sm text-[#455A64] leading-relaxed line-clamp-3">
            {consultant.bio}
          </p>
        </div>

        {/* Certifications */}
        {consultant.certifications && consultant.certifications.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-[#37474F] mb-2">
              Sertifikasi:
            </div>
            <div className="flex flex-wrap gap-2">
              {consultant.certifications.slice(0, 3).map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center px-2 py-1 bg-[#E8F5E9] text-[#00C853] text-xs rounded-md border border-[#4CAF50]/20"
                >
                  <CheckIcon />
                  <span className="ml-1">{cert}</span>
                </span>
              ))}
              {consultant.certifications.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 bg-[#F5F7FA] text-[#78909C] text-xs rounded-md">
                  +{consultant.certifications.length - 3} lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {consultant.languages && consultant.languages.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-[#37474F] mb-1">
              Bahasa:{" "}
              <span className="font-normal text-[#78909C]">
                {consultant.languages.map(getLanguageLabel).join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className="border-t border-[#E9ECEF] p-6 pt-4 bg-[#FAFBFC]">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onViewProfile(consultant.id)}
            icon={<EyeIcon />}
            className="flex-1 border-[#E9ECEF] text-[#546E7A] hover:border-[#0052CC] hover:text-[#0052CC]"
          >
            Lihat Profil
          </Button>
          <Button
            onClick={() => onBook(consultant.id)}
            disabled={!consultant.isActive}
            icon={<CalendarIcon />}
            className="flex-1 bg-gradient-to-r from-[#0052CC] to-[#003D82] hover:from-[#0066FF] hover:to-[#0052CC] text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {consultant.isActive ? "Book Konsultasi" : "Tidak Tersedia"}
          </Button>
        </div>
      </div>

      {/* Status Indicator */}
      {!consultant.isActive && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
          <div className="bg-[#FF9800] text-white px-4 py-2 rounded-lg font-medium">
            Sedang Tidak Tersedia
          </div>
        </div>
      )}
    </motion.div>
  );
}