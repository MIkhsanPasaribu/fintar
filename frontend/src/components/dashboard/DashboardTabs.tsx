"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { BookOpen, Video, DollarSign, TrendingUp, Users } from "lucide-react";

interface EducationModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number;
  type: "article" | "video" | "interactive";
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

interface TabSection {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface DashboardTabsProps {
  educationModules: EducationModule[];
  features: Feature[];
}

const getDifficultyColor = (difficulty: EducationModule["difficulty"]) => {
  switch (difficulty) {
    case "beginner":
      return "text-success";
    case "intermediate":
      return "text-warning";
    case "advanced":
      return "text-error";
    default:
      return "text-text-description";
  }
};

const getTypeIcon = (type: EducationModule["type"]) => {
  switch (type) {
    case "article":
      return <BookOpen className="w-4 h-4" />;
    case "video":
      return <Video className="w-4 h-4" />;
    case "interactive":
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  educationModules,
  features,
}) => {
  const tabSections: TabSection[] = [
    {
      id: "overview",
      label: "Ringkasan",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-text-description">
                    {feature.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() =>
                      feature.href && window.open(feature.href, "_blank")
                    }
                  >
                    Mulai Sekarang
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: "education",
      label: "Edukasi",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(module.type)}
                        <CardTitle className="text-base">
                          {module.title}
                        </CardTitle>
                      </div>
                      <span
                        className={`text-xs font-medium ${getDifficultyColor(
                          module.difficulty
                        )}`}
                      >
                        {module.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-text-description mb-4">
                      {module.description}
                    </CardDescription>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-description">Progress</span>
                        <span className="text-text-primary font-medium">
                          {module.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-description">
                          {module.duration}
                        </span>
                        <Button size="sm" variant="outline">
                          {module.progress > 0 ? "Lanjutkan" : "Mulai"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "tools",
      label: "Tools Keuangan",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <DollarSign className="w-6 h-6" />,
              title: "Kalkulator Tabungan",
              description:
                "Hitung berapa yang perlu ditabung untuk mencapai target finansial",
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: "Analisis Investasi",
              description:
                "Evaluasi profil risiko dan rekomendasi portofolio investasi",
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Konsultasi Ahli",
              description:
                "Booking konsultasi dengan financial advisor bersertifikat",
            },
          ].map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-text-description">
                    {tool.description}
                  </CardDescription>
                  <Button className="w-full mt-4">Gunakan Tool</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Utama</CardTitle>
        <CardDescription>
          Kelola keuangan dan tingkatkan literasi finansial Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {tabSections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabSections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-6">
              {section.content}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
