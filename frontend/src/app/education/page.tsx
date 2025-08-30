/* eslint-disable @next/next/no-img-element */
"use client";

import { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Input } from "@/components/ui";

const BookIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CalculatorIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ClockIcon = () => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 fill-current text-accent" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface EducationContent {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "calculator" | "course";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  rating: number;
  category: string;
  thumbnail?: string;
}

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const categories = [
    { value: "all", label: "Semua Kategori" },
    { value: "budgeting", label: "Budgeting" },
    { value: "investing", label: "Investasi" },
    { value: "debt", label: "Manajemen Utang" },
    { value: "retirement", label: "Perencanaan Pensiun" },
    { value: "insurance", label: "Asuransi" },
    { value: "tax", label: "Pajak" },
  ];

  const types = [
    { value: "all", label: "Semua Tipe" },
    { value: "article", label: "Artikel" },
    { value: "video", label: "Video" },
    { value: "calculator", label: "Kalkulator" },
    { value: "course", label: "Kursus" },
  ];

  const educationContent: EducationContent[] = [
    {
      id: "1",
      title: "Panduan Lengkap Budgeting untuk Pemula",
      description:
        "Pelajari cara membuat anggaran yang efektif dan realistis untuk mengelola keuangan harian.",
      type: "article",
      difficulty: "beginner",
      duration: "10 menit",
      rating: 4.8,
      category: "budgeting",
      thumbnail:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
    },
    {
      id: "2",
      title: "Mengenal Reksadana untuk Investasi Pemula",
      description:
        "Video edukasi tentang reksadana, jenis-jenisnya, dan cara memilih yang tepat untuk profil risiko Anda.",
      type: "video",
      difficulty: "beginner",
      duration: "15 menit",
      rating: 4.9,
      category: "investing",
      thumbnail:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
    },
    {
      id: "3",
      title: "Kalkulator Dana Darurat",
      description:
        "Hitung berapa dana darurat yang ideal untuk kebutuhan Anda berdasarkan profil keuangan.",
      type: "calculator",
      difficulty: "beginner",
      duration: "5 menit",
      rating: 4.7,
      category: "budgeting",
    },
    {
      id: "4",
      title: "Strategi Melunasi Utang dengan Metode Snowball vs Avalanche",
      description:
        "Perbandingan dua metode populer untuk melunasi utang dan cara memilih yang tepat.",
      type: "article",
      difficulty: "intermediate",
      duration: "12 menit",
      rating: 4.6,
      category: "debt",
      thumbnail:
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop",
    },
    {
      id: "5",
      title: "Kursus Investasi Saham untuk Pemula",
      description:
        "Kursus komprehensif 10 modul tentang investasi saham, analisis fundamental, dan teknikal.",
      type: "course",
      difficulty: "beginner",
      duration: "3 jam",
      rating: 4.9,
      category: "investing",
      thumbnail:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&h=200&fit=crop",
    },
    {
      id: "6",
      title: "Kalkulator Simulasi Pensiun",
      description:
        "Simulasikan kebutuhan dana pensiun Anda dan rencanakan investasi yang tepat.",
      type: "calculator",
      difficulty: "intermediate",
      duration: "8 menit",
      rating: 4.5,
      category: "retirement",
    },
    {
      id: "7",
      title: "Memahami Asuransi Jiwa dan Kesehatan",
      description:
        "Panduan memilih asuransi yang tepat sesuai kebutuhan dan kemampuan finansial.",
      type: "video",
      difficulty: "beginner",
      duration: "20 menit",
      rating: 4.7,
      category: "insurance",
      thumbnail:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop",
    },
    {
      id: "8",
      title: "Optimalisasi Pajak untuk Karyawan",
      description:
        "Tips dan strategi legal untuk mengoptimalkan pajak penghasilan Anda.",
      type: "article",
      difficulty: "intermediate",
      duration: "15 menit",
      rating: 4.4,
      category: "tax",
      thumbnail:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1311&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const filteredContent = educationContent.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || content.category === selectedCategory;
    const matchesType = selectedType === "all" || content.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookIcon />;
      case "video":
        return <PlayIcon />;
      case "calculator":
        return <CalculatorIcon />;
      case "course":
        return <BookIcon />;
      default:
        return <BookIcon />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "article":
        return "Artikel";
      case "video":
        return "Video";
      case "calculator":
        return "Kalkulator";
      case "course":
        return "Kursus";
      default:
        return type;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Pemula";
      case "intermediate":
        return "Menengah";
      case "advanced":
        return "Lanjutan";
      default:
        return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-success-100 text-success-700";
      case "intermediate":
        return "bg-accent-100 text-accent-700";
      case "advanced":
        return "bg-danger-100 text-danger-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Edukasi Keuangan
            </h1>
            <p className="text-lg text-text-description max-w-2xl mx-auto">
              Tingkatkan literasi keuangan Anda dengan berbagai konten edukasi
              berkualitas
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Input
                  placeholder="Cari artikel, video, atau kalkulator..."
                  value={searchQuery}
                  onChange={(e: {
                    target: { value: SetStateAction<string> };
                  }) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-metadata">
                  <SearchIcon />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-subtitle mb-2">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-subtitle mb-2">
                  Tipe Konten
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full hover:shadow-hover">
                <CardBody className="p-0">
                  {/* Thumbnail */}
                  {content.thumbnail && (
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                          {getTypeIcon(content.type)}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            content.difficulty
                          )}`}
                        >
                          {getDifficultyLabel(content.difficulty)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {!content.thumbnail && (
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(content.type)}
                          <span className="text-sm font-medium text-text-primary">
                            {getTypeLabel(content.type)}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            content.difficulty
                          )}`}
                        >
                          {getDifficultyLabel(content.difficulty)}
                        </span>
                      </div>
                    )}

                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                      {content.title}
                    </h3>

                    <p className="text-sm text-text-description mb-4 line-clamp-3">
                      {content.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-text-metadata mb-4">
                      <div className="flex items-center space-x-1">
                        <ClockIcon />
                        <span>{content.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StarIcon />
                        <span>{content.rating}</span>
                      </div>
                    </div>

                    <Button className="w-full">
                      {content.type === "calculator"
                        ? "Gunakan Kalkulator"
                        : content.type === "video"
                        ? "Tonton Video"
                        : content.type === "course"
                        ? "Mulai Kursus"
                        : "Baca Artikel"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Tidak ada konten ditemukan
            </h3>
            <p className="text-text-description mb-4">
              Coba ubah kata kunci pencarian atau filter Anda
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedType("all");
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
