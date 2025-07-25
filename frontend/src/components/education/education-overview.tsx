"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, TrendingUp, Award, Users } from "lucide-react";

interface EducationModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: number; // in minutes
  progress: number; // percentage
  rating: number;
  enrolledCount: number;
  topics: string[];
  isCompleted: boolean;
  isFeatured: boolean;
}

interface EducationOverviewProps {
  modules?: EducationModule[];
  userProgress?: {
    completedModules: number;
    totalModules: number;
    streakDays: number;
    totalLearningTime: number; // in minutes
  };
}

const mockModules: EducationModule[] = [
  {
    id: "1",
    title: "Dasar-Dasar Perencanaan Keuangan",
    description:
      "Pelajari konsep fundamental dalam mengelola keuangan pribadi dan membuat anggaran yang efektif.",
    category: "FINANCIAL_PLANNING",
    difficulty: "BEGINNER",
    duration: 45,
    progress: 75,
    rating: 4.8,
    enrolledCount: 1250,
    topics: ["Budgeting", "Emergency Fund", "Financial Goals"],
    isCompleted: false,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Investasi untuk Pemula",
    description:
      "Memahami berbagai instrumen investasi dan cara membangun portofolio yang seimbang.",
    category: "INVESTMENT",
    difficulty: "BEGINNER",
    duration: 60,
    progress: 0,
    rating: 4.6,
    enrolledCount: 980,
    topics: ["Stocks", "Bonds", "Mutual Funds", "Risk Management"],
    isCompleted: false,
    isFeatured: true,
  },
  {
    id: "3",
    title: "Manajemen Utang dan Kredit",
    description:
      "Strategi efektif untuk mengelola utang dan membangun skor kredit yang baik.",
    category: "DEBT_MANAGEMENT",
    difficulty: "INTERMEDIATE",
    duration: 50,
    progress: 100,
    rating: 4.7,
    enrolledCount: 750,
    topics: ["Credit Score", "Debt Consolidation", "Payment Strategies"],
    isCompleted: true,
    isFeatured: false,
  },
];

const mockUserProgress = {
  completedModules: 1,
  totalModules: 12,
  streakDays: 7,
  totalLearningTime: 180,
};

export function EducationOverview({
  modules = mockModules,
  userProgress = mockUserProgress,
}: EducationOverviewProps) {
  const getDifficultyColor = (difficulty: EducationModule["difficulty"]) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-success-100 text-success-700";
      case "INTERMEDIATE":
        return "bg-warning-100 text-warning-700";
      case "ADVANCED":
        return "bg-danger-100 text-danger-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      FINANCIAL_PLANNING: "Perencanaan Keuangan",
      INVESTMENT: "Investasi",
      DEBT_MANAGEMENT: "Manajemen Utang",
      INSURANCE: "Asuransi",
      TAX_PLANNING: "Perencanaan Pajak",
      RETIREMENT: "Perencanaan Pensiun",
    };
    return labels[category] || category;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}j ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Progress Pembelajaran Anda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {userProgress.completedModules}/{userProgress.totalModules}
            </div>
            <div className="text-sm text-text-description">Modul Selesai</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {userProgress.streakDays}
            </div>
            <div className="text-sm text-text-description">Hari Beruntun</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {formatDuration(userProgress.totalLearningTime)}
            </div>
            <div className="text-sm text-text-description">Total Belajar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info mb-1">
              {Math.round(
                (userProgress.completedModules / userProgress.totalModules) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-text-description">Progress</div>
          </div>
        </div>
      </Card>

      {/* Featured Modules */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Modul Rekomendasi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules
            .filter((module) => module.isFeatured)
            .map((module) => (
              <Card
                key={module.id}
                className="p-6 hover:shadow-hover transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge
                    variant="secondary"
                    className={getDifficultyColor(module.difficulty)}
                  >
                    {module.difficulty}
                  </Badge>
                  {module.isCompleted && (
                    <Award className="h-5 w-5 text-success" />
                  )}
                </div>

                <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                  {module.title}
                </h3>

                <p className="text-sm text-text-description mb-4 line-clamp-3">
                  {module.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-text-metadata">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(module.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {module.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {module.enrolledCount.toLocaleString()}
                    </div>
                  </div>

                  {module.progress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-text-metadata mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {module.topics.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {module.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{module.topics.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  variant={module.progress > 0 ? "outline" : "default"}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {module.isCompleted
                    ? "Review"
                    : module.progress > 0
                    ? "Lanjutkan"
                    : "Mulai Belajar"}
                </Button>
              </Card>
            ))}
        </div>
      </div>

      {/* All Modules */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Semua Modul Pembelajaran
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="p-4 hover:shadow-hover transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-text-primary">
                      {module.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(module.difficulty)}
                    >
                      {module.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {getCategoryLabel(module.category)}
                    </Badge>
                    {module.isCompleted && (
                      <Award className="h-4 w-4 text-success" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-text-metadata">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(module.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {module.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {module.progress}%
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  {module.isCompleted
                    ? "Review"
                    : module.progress > 0
                    ? "Lanjutkan"
                    : "Mulai"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
