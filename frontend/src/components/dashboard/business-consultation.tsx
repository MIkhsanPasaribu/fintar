/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  Building,
  Loader2,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

interface BusinessData {
  companyName: string;
  industryType: string;
  employeeCount: number;
  monthlyRevenue: number;
  businessAge: number;
  challenges: string[];
  objectives: string[];
}

interface ConsultationResult {
  consultationId: string;
  analysis: string;
  recommendations: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    actionItems: string[];
  }>;
  implementationPlan: Array<{
    phase: string;
    duration: string;
    tasks: string[];
  }>;
  riskAssessment: string;
  fallback?: boolean;
}

const industryOptions = [
  "teknologi",
  "retail",
  "manufaktur",
  "jasa",
  "keuangan",
  "pendidikan",
  "kesehatan",
  "f&b",
  "properti",
  "general",
];

const consultationTypes = [
  { value: "strategy", label: "Strategi Bisnis", icon: Target },
  { value: "operations", label: "Operasional", icon: Building },
  { value: "financial", label: "Keuangan", icon: TrendingUp },
  { value: "marketing", label: "Pemasaran", icon: Users },
  { value: "technology", label: "Teknologi", icon: Lightbulb },
];

export default function BusinessConsultation() {
  const [formData, setFormData] = useState<BusinessData>({
    companyName: "",
    industryType: "general",
    employeeCount: 0,
    monthlyRevenue: 0,
    businessAge: 0,
    challenges: [],
    objectives: [],
  });

  const [consultationType, setConsultationType] = useState("general");
  const [consultation, setConsultation] = useState<ConsultationResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [newChallenge, setNewChallenge] = useState("");
  const [newObjective, setNewObjective] = useState("");

  const handleInputChange = (field: keyof BusinessData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addChallenge = () => {
    if (newChallenge.trim() && formData.challenges.length < 5) {
      setFormData((prev) => ({
        ...prev,
        challenges: [...prev.challenges, newChallenge.trim()],
      }));
      setNewChallenge("");
    }
  };

  const addObjective = () => {
    if (newObjective.trim() && formData.objectives.length < 5) {
      setFormData((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
      setNewObjective("");
    }
  };

  const removeChallenge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index),
    }));
  };

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const getConsultation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industryType: formData.industryType,
          consultationType,
          businessData: formData,
          specificQuestions: formData.challenges,
          objectives: formData.objectives,
        }),
      });

      if (!response.ok) {
        throw new Error(`Consultation failed with status: ${response.status}`);
      }

      const result = await response.json();
      setConsultation(result);
    } catch (error) {
      console.error("Business consultation error:", error);
      setConsultation({
        consultationId: "error",
        analysis:
          "Terjadi kesalahan saat melakukan konsultasi. Silakan coba lagi.",
        recommendations: [],
        implementationPlan: [],
        riskAssessment: "Tidak dapat melakukan penilaian risiko saat ini.",
        fallback: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-500/20 border-red-500/30";
      case "medium":
        return "text-yellow-500 bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "text-green-500 bg-green-500/20 border-green-500/30";
      default:
        return "text-gray-500 bg-gray-500/20 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="glass-effect border-primary-light/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-primary-400" />
            <span>Fintar Business Consultation</span>
          </CardTitle>
          <p className="text-sm text-font-secondary">
            Dapatkan wawasan strategis dan rekomendasi untuk mengembangkan
            bisnis Anda
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Business Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Nama Perusahaan
              </label>
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                placeholder="PT. Contoh Indonesia"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Industri
              </label>
              <select
                value={formData.industryType}
                onChange={(e) =>
                  handleInputChange("industryType", e.target.value)
                }
                className="w-full p-2 border border-primary-light/20 rounded-md bg-bg-darker text-font-light"
              >
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Jumlah Karyawan
              </label>
              <Input
                type="number"
                value={formData.employeeCount || ""}
                onChange={(e) =>
                  handleInputChange("employeeCount", Number(e.target.value))
                }
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Revenue Bulanan (Rp)
              </label>
              <Input
                type="number"
                value={formData.monthlyRevenue || ""}
                onChange={(e) =>
                  handleInputChange("monthlyRevenue", Number(e.target.value))
                }
                placeholder="0"
                className="text-right"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Usia Bisnis (tahun)
              </label>
              <Input
                type="number"
                value={formData.businessAge || ""}
                onChange={(e) =>
                  handleInputChange("businessAge", Number(e.target.value))
                }
                placeholder="0"
              />
            </div>
          </div>

          {/* Consultation Type */}
          <div>
            <label className="text-sm font-medium text-font-light mb-3 block">
              Jenis Konsultasi
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {consultationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={
                      consultationType === type.value ? "default" : "outline"
                    }
                    onClick={() => setConsultationType(type.value)}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Challenges */}
          <div>
            <label className="text-sm font-medium text-font-light mb-2 block">
              Tantangan Bisnis
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={newChallenge}
                onChange={(e) => setNewChallenge(e.target.value)}
                placeholder="Tambah tantangan yang dihadapi..."
                onKeyDown={(e) => e.key === "Enter" && addChallenge()}
              />
              <Button
                onClick={addChallenge}
                disabled={
                  !newChallenge.trim() || formData.challenges.length >= 5
                }
                size="sm"
              >
                +
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.challenges.map((challenge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-500/20"
                  onClick={() => removeChallenge(index)}
                >
                  {challenge} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div>
            <label className="text-sm font-medium text-font-light mb-2 block">
              Tujuan Bisnis
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Tambah tujuan yang ingin dicapai..."
                onKeyDown={(e) => e.key === "Enter" && addObjective()}
              />
              <Button
                onClick={addObjective}
                disabled={
                  !newObjective.trim() || formData.objectives.length >= 5
                }
                size="sm"
              >
                +
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.objectives.map((objective, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-500/20"
                  onClick={() => removeObjective(index)}
                >
                  {objective} ×
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={getConsultation}
            disabled={isLoading || !formData.companyName.trim()}
            className="w-full bg-primary-500 hover:bg-primary-600"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Menganalisis dengan Fintar AI...
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5 mr-2" />
                Dapatkan Konsultasi Bisnis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Consultation Results */}
      {consultation && (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <Card className="glass-effect border-primary-light/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analisis Bisnis</span>
                {consultation.fallback && (
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500"
                  >
                    Offline Mode
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-font-secondary leading-relaxed">
                {consultation.analysis}
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {consultation.recommendations.length > 0 && (
            <Card className="glass-effect border-primary-light/20">
              <CardHeader>
                <CardTitle>Rekomendasi Strategis</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {consultation.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 border border-primary-light/20 rounded-lg bg-primary-dark/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-font-light">
                        {rec.title}
                      </h4>
                      <Badge
                        className={`${getPriorityColor(rec.priority)} border-0`}
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>

                    <p className="text-font-secondary mb-3">
                      {rec.description}
                    </p>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-font-light">
                        Action Items:
                      </h5>
                      {rec.actionItems.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start space-x-2 text-sm text-font-secondary"
                        >
                          <ArrowRight className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Implementation Plan */}
          {consultation.implementationPlan.length > 0 && (
            <Card className="glass-effect border-primary-light/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Rencana Implementasi</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {consultation.implementationPlan.map((phase, index) => (
                  <div
                    key={index}
                    className="p-4 border border-teal-light/20 rounded-lg bg-teal-dark/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-font-light">
                        {phase.phase}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-teal-400 border-teal-400"
                      >
                        {phase.duration}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {phase.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className="flex items-start space-x-2 text-sm text-font-secondary"
                        >
                          <CheckCircle className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Risk Assessment */}
          <Card className="glass-effect border-primary-light/20">
            <CardHeader>
              <CardTitle>Penilaian Risiko</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-font-secondary leading-relaxed">
                {consultation.riskAssessment}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
