/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  CheckCircle,
  Clock,
  FileText,
  Video,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface LessonContent {
  id: string;
  type: "VIDEO" | "TEXT" | "QUIZ" | "INTERACTIVE";
  title: string;
  content: string;
  duration?: number;
  isCompleted: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  contents: LessonContent[];
  isCompleted: boolean;
  isUnlocked: boolean;
}

interface LearningModuleProps {
  moduleId: string;
  title: string;
  description: string;
  lessons: Lesson[];
  currentLessonId?: string;
  onLessonComplete?: (lessonId: string) => void;
  onContentComplete?: (contentId: string) => void;
}

const mockLessons: Lesson[] = [
  {
    id: "1",
    title: "Pengenalan Perencanaan Keuangan",
    description:
      "Memahami konsep dasar dan pentingnya perencanaan keuangan dalam kehidupan.",
    duration: 15,
    isCompleted: true,
    isUnlocked: true,
    contents: [
      {
        id: "1-1",
        type: "VIDEO",
        title: "Apa itu Perencanaan Keuangan?",
        content: "Video pengenalan tentang konsep perencanaan keuangan...",
        duration: 8,
        isCompleted: true,
      },
      {
        id: "1-2",
        type: "TEXT",
        title: "Manfaat Perencanaan Keuangan",
        content: "Perencanaan keuangan memberikan berbagai manfaat...",
        isCompleted: true,
      },
      {
        id: "1-3",
        type: "QUIZ",
        title: "Kuis: Konsep Dasar",
        content: "Uji pemahaman Anda tentang konsep dasar...",
        isCompleted: true,
      },
    ],
  },
  {
    id: "2",
    title: "Membuat Anggaran Bulanan",
    description:
      "Langkah-langkah praktis untuk membuat dan mengelola anggaran bulanan yang efektif.",
    duration: 20,
    isCompleted: false,
    isUnlocked: true,
    contents: [
      {
        id: "2-1",
        type: "VIDEO",
        title: "Metode 50/30/20",
        content: "Pelajari metode populer untuk pembagian anggaran...",
        duration: 12,
        isCompleted: false,
      },
      {
        id: "2-2",
        type: "INTERACTIVE",
        title: "Kalkulator Anggaran",
        content: "Gunakan kalkulator interaktif untuk membuat anggaran...",
        isCompleted: false,
      },
      {
        id: "2-3",
        type: "TEXT",
        title: "Tips Mengelola Anggaran",
        content: "Strategi praktis untuk tetap konsisten dengan anggaran...",
        isCompleted: false,
      },
    ],
  },
  {
    id: "3",
    title: "Dana Darurat",
    description:
      "Memahami pentingnya dan cara membangun dana darurat yang cukup.",
    duration: 18,
    isCompleted: false,
    isUnlocked: false,
    contents: [
      {
        id: "3-1",
        type: "VIDEO",
        title: "Mengapa Dana Darurat Penting?",
        content: "Memahami fungsi dan manfaat dana darurat...",
        duration: 10,
        isCompleted: false,
      },
      {
        id: "3-2",
        type: "TEXT",
        title: "Berapa Besar Dana Darurat?",
        content: "Menghitung jumlah dana darurat yang ideal...",
        isCompleted: false,
      },
    ],
  },
];

export function LearningModule({
  moduleId,
  title,
  description,
  lessons = mockLessons,
  currentLessonId,
  onLessonComplete,
  onContentComplete,
}: LearningModuleProps) {
  const [activeLesson, setActiveLesson] = useState(
    currentLessonId || lessons.find((l) => l.isUnlocked)?.id || lessons[0]?.id
  );
  const [activeContent, setActiveContent] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  const currentLesson = lessons.find((l) => l.id === activeLesson);
  const currentContentItem =
    currentLesson?.contents.find((c) => c.id === activeContent) ||
    currentLesson?.contents[0];

  const getContentIcon = (type: LessonContent["type"]) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "TEXT":
        return <FileText className="h-4 w-4" />;
      case "QUIZ":
        return <HelpCircle className="h-4 w-4" />;
      case "INTERACTIVE":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: LessonContent["type"]) => {
    const labels = {
      VIDEO: "Video",
      TEXT: "Artikel",
      QUIZ: "Kuis",
      INTERACTIVE: "Interaktif",
    };
    return labels[type];
  };

  const handleContentComplete = (contentId: string) => {
    onContentComplete?.(contentId);

    // Auto-advance to next content
    if (currentLesson) {
      const currentIndex = currentLesson.contents.findIndex(
        (c) => c.id === contentId
      );
      const nextContent = currentLesson.contents[currentIndex + 1];
      if (nextContent) {
        setActiveContent(nextContent.id);
      }
    }
  };

  const handleLessonComplete = () => {
    if (currentLesson) {
      onLessonComplete?.(currentLesson.id);

      // Auto-advance to next lesson
      const currentIndex = lessons.findIndex((l) => l.id === activeLesson);
      const nextLesson = lessons[currentIndex + 1];
      if (nextLesson && nextLesson.isUnlocked) {
        setActiveLesson(nextLesson.id);
        setActiveContent("");
      }
    }
  };

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => l.isCompleted).length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Sidebar - Lesson List */}
      <div className="lg:col-span-1">
        <Card className="p-4 h-full">
          <div className="mb-4">
            <h2 className="font-semibold text-text-primary mb-2">{title}</h2>
            <p className="text-sm text-text-description mb-3">{description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-text-metadata">
                <span>Progress</span>
                <span>
                  {completedLessons}/{totalLessons}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  lesson.id === activeLesson
                    ? "bg-primary-50 border-primary-200"
                    : lesson.isUnlocked
                    ? "hover:bg-background-soft border-neutral-200"
                    : "bg-neutral-100 border-neutral-200 cursor-not-allowed opacity-60"
                }`}
                onClick={() => lesson.isUnlocked && setActiveLesson(lesson.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-text-metadata">
                    {index + 1}
                  </span>
                  {lesson.isCompleted && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  <div className="flex items-center gap-1 text-xs text-text-metadata">
                    <Clock className="h-3 w-3" />
                    {lesson.duration}m
                  </div>
                </div>

                <h3 className="text-sm font-medium text-text-primary mb-1 line-clamp-2">
                  {lesson.title}
                </h3>

                <p className="text-xs text-text-description line-clamp-2">
                  {lesson.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          {currentLesson && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-xl font-semibold text-text-primary">
                    {currentLesson.title}
                  </h1>
                  <Badge
                    variant={
                      currentLesson.isCompleted ? "default" : "secondary"
                    }
                  >
                    {currentLesson.isCompleted ? "Selesai" : "Dalam Progress"}
                  </Badge>
                </div>
                <p className="text-text-description">
                  {currentLesson.description}
                </p>
              </div>

              {/* Content Tabs */}
              <div className="flex-1 p-6">
                <Tabs
                  value={activeContent || currentLesson.contents[0]?.id}
                  onValueChange={setActiveContent}
                >
                  <TabsList className="mb-4">
                    {currentLesson.contents.map((content, index) => (
                      <TabsTrigger
                        key={content.id}
                        value={content.id}
                        className="flex items-center gap-2"
                      >
                        {getContentIcon(content.type)}
                        <span className="hidden sm:inline">
                          {getTypeLabel(content.type)} {index + 1}
                        </span>
                        {content.isCompleted && (
                          <CheckCircle className="h-3 w-3 text-success" />
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {currentLesson.contents.map((content) => (
                    <TabsContent
                      key={content.id}
                      value={content.id}
                      className="flex-1"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getContentIcon(content.type)}
                            <h3 className="font-medium text-text-primary">
                              {content.title}
                            </h3>
                            {content.duration && (
                              <Badge variant="outline" className="text-xs">
                                {content.duration}m
                              </Badge>
                            )}
                          </div>

                          {content.type === "VIDEO" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsPlaying(!isPlaying)}
                            >
                              {isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>

                        <div className="border rounded-lg p-6 bg-background-light min-h-[400px]">
                          {content.type === "VIDEO" && (
                            <div className="aspect-video bg-neutral-200 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Video className="h-12 w-12 text-neutral-500 mx-auto mb-2" />
                                <p className="text-text-metadata">
                                  Video Player Placeholder
                                </p>
                              </div>
                            </div>
                          )}

                          {content.type === "TEXT" && (
                            <div className="prose max-w-none">
                              <p className="text-text-body leading-relaxed">
                                {content.content}
                              </p>
                            </div>
                          )}

                          {content.type === "QUIZ" && (
                            <div className="text-center py-8">
                              <HelpCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                              <h4 className="font-medium text-text-primary mb-2">
                                Kuis Interaktif
                              </h4>
                              <p className="text-text-description mb-4">
                                {content.content}
                              </p>
                              <Button>Mulai Kuis</Button>
                            </div>
                          )}

                          {content.type === "INTERACTIVE" && (
                            <div className="text-center py-8">
                              <BookOpen className="h-12 w-12 text-info mx-auto mb-4" />
                              <h4 className="font-medium text-text-primary mb-2">
                                Konten Interaktif
                              </h4>
                              <p className="text-text-description mb-4">
                                {content.content}
                              </p>
                              <Button>Buka Tool</Button>
                            </div>
                          )}
                        </div>

                        {!content.isCompleted && (
                          <div className="flex justify-end">
                            <Button
                              onClick={() => handleContentComplete(content.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Tandai Selesai
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Footer Navigation */}
              <div className="p-6 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    disabled={
                      lessons.findIndex((l) => l.id === activeLesson) === 0
                    }
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Sebelumnya
                  </Button>

                  {!currentLesson.isCompleted &&
                    currentLesson.contents.every((c) => c.isCompleted) && (
                      <Button onClick={handleLessonComplete}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Selesaikan Pelajaran
                      </Button>
                    )}

                  <Button
                    variant="outline"
                    disabled={
                      lessons.findIndex((l) => l.id === activeLesson) ===
                      lessons.length - 1
                    }
                  >
                    Selanjutnya
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
