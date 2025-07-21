"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Play,
  Clock,
  Star,
  Search,
  Filter,
  Award,
  TrendingUp,
  PiggyBank,
  Calculator,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EducationContent {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "quiz";
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  points: number;
  thumbnail?: string;
  completed?: boolean;
  rating: number;
}

const mockContent: EducationContent[] = [
  {
    id: "1",
    title: "Dasar-Dasar Budgeting untuk Pemula",
    description:
      "Pelajari cara membuat dan mengelola budget bulanan yang efektif dengan metode 50/30/20",
    type: "article",
    category: "Budgeting",
    difficulty: "beginner",
    duration: 15,
    points: 50,
    rating: 4.8,
    completed: true,
  },
  {
    id: "2",
    title: "Investasi Reksa Dana: Panduan Lengkap",
    description:
      "Video komprehensif tentang cara memilih dan berinvestasi di reksa dana",
    type: "video",
    category: "Investasi",
    difficulty: "intermediate",
    duration: 25,
    points: 75,
    rating: 4.9,
  },
  {
    id: "3",
    title: "Quiz: Seberapa Baik Pengetahuan Investasi Anda?",
    description: "Uji pemahaman Anda tentang berbagai instrumen investasi",
    type: "quiz",
    category: "Investasi",
    difficulty: "intermediate",
    duration: 10,
    points: 100,
    rating: 4.7,
  },
  {
    id: "4",
    title: "Strategi Menabung untuk Dana Darurat",
    description:
      "Tips praktis membangun dana darurat yang cukup dalam 12 bulan",
    type: "article",
    category: "Tabungan",
    difficulty: "beginner",
    duration: 12,
    points: 40,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Perencanaan Keuangan untuk Milenial",
    description:
      "Strategi khusus anak muda dalam merencanakan masa depan finansial",
    type: "video",
    category: "Perencanaan",
    difficulty: "intermediate",
    duration: 30,
    points: 80,
    rating: 4.8,
  },
  {
    id: "6",
    title: "Mengelola Hutang dengan Bijak",
    description:
      "Metode efektif untuk melunasi hutang dan menghindari jeratan debt trap",
    type: "article",
    category: "Debt Management",
    difficulty: "advanced",
    duration: 20,
    points: 90,
    rating: 4.9,
  },
];

const categories = [
  "Semua",
  "Budgeting",
  "Investasi",
  "Tabungan",
  "Perencanaan",
  "Debt Management",
];
const difficulties = ["Semua", "beginner", "intermediate", "advanced"];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "article":
      return BookOpen;
    case "video":
      return Play;
    case "quiz":
      return Award;
    default:
      return BookOpen;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Budgeting":
      return Calculator;
    case "Investasi":
      return TrendingUp;
    case "Tabungan":
      return PiggyBank;
    case "Perencanaan":
      return Target;
    default:
      return BookOpen;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-secondary-100 text-secondary-700";
    case "intermediate":
      return "bg-accent-100 text-accent-700";
    case "advanced":
      return "bg-error/10 text-error";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
};

export default function EducationModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Semua");
  const [content] = useState(mockContent);

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "Semua" || item.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const completedCount = content.filter((item) => item.completed).length;
  const totalPoints = content.reduce(
    (sum, item) => sum + (item.completed ? item.points : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary-100 text-secondary-600 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Konten Diselesaikan
                </p>
                <p className="text-2xl font-bold text-neutral-900">
                  {completedCount}/{content.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent-100 text-accent-600 rounded-lg">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Total Poin
                </p>
                <p className="text-2xl font-bold text-neutral-900">
                  {totalPoints}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Level</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {totalPoints < 200
                    ? "Pemula"
                    : totalPoints < 500
                    ? "Menengah"
                    : "Ahli"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Pencarian</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Cari konten edukasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Tingkat Kesulitan
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={
                      selectedDifficulty === difficulty ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty === "Semua"
                      ? difficulty
                      : difficulty === "beginner"
                      ? "Pemula"
                      : difficulty === "intermediate"
                      ? "Menengah"
                      : "Lanjutan"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          const CategoryIcon = getCategoryIcon(item.category);

          return (
            <Card
              key={item.id}
              className="hover:shadow-financial transition-shadow duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  {item.completed && (
                    <div className="p-1 bg-secondary-100 text-secondary-600 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-neutral-600 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <TypeIcon className="h-3 w-3" />
                      <span className="capitalize">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.duration} min</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current text-accent-500" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    className={cn(
                      "text-xs",
                      getDifficultyColor(item.difficulty)
                    )}
                  >
                    {item.difficulty === "beginner"
                      ? "Pemula"
                      : item.difficulty === "intermediate"
                      ? "Menengah"
                      : "Lanjutan"}
                  </Badge>
                  <span className="text-sm font-medium text-accent-600">
                    +{item.points} poin
                  </span>
                </div>

                <Button
                  className="w-full"
                  variant={item.completed ? "outline" : "default"}
                >
                  {item.completed ? "Ulangi" : "Mulai Belajar"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Tidak ada konten ditemukan
            </h3>
            <p className="text-neutral-600">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
