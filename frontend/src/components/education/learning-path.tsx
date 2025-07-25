/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Badge, Progress, Button } from "@/components/ui";

interface LearningStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  duration: number;
  type: "ARTICLE" | "VIDEO" | "QUIZ" | "EXERCISE";
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  totalSteps: number;
  completedSteps: number;
  estimatedDuration: number; // in hours
  steps: LearningStep[];
  thumbnail?: string;
}

interface LearningPathProps {
  learningPath: LearningPath;
  onStartStep: (stepId: string) => void;
  onViewPath: (pathId: string) => void;
}

const CheckIcon = () => (
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
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const LockIcon = () => (
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
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const PlayIcon = () => (
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
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-9h-1m-4 0h-1m-6 4h1m4 0h1"
    />
  </svg>
);

const ArrowIcon = () => (
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
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
);

export default function LearningPathCard({
  learningPath,
  onStartStep,
  onViewPath,
}: LearningPathProps) {
  const progressPercentage =
    (learningPath.completedSteps / learningPath.totalSteps) * 100;

  const getLevelVariant = () => {
    switch (learningPath.level) {
      case "BEGINNER":
        return "success";
      case "INTERMEDIATE":
        return "warning";
      case "ADVANCED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getLevelLabel = () => {
    const labels = {
      BEGINNER: "Pemula",
      INTERMEDIATE: "Menengah",
      ADVANCED: "Lanjutan",
    };
    return labels[learningPath.level];
  };

  const getNextStep = () => {
    return learningPath.steps.find(
      (step) => !step.isCompleted && !step.isLocked
    );
  };

  const getStepIcon = (step: LearningStep) => {
    if (step.isCompleted) {
      return <CheckIcon />;
    }
    if (step.isLocked) {
      return <LockIcon />;
    }
    return <PlayIcon />;
  };

  const getStepStatus = (step: LearningStep) => {
    if (step.isCompleted) return "completed";
    if (step.isLocked) return "locked";
    return "available";
  };

  const nextStep = getNextStep();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-hover">
        <CardBody className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={getLevelVariant()} size="sm">
                  {getLevelLabel()}
                </Badge>
                <Badge variant="secondary" size="sm">
                  {learningPath.category}
                </Badge>
              </div>
              <h3 className="font-semibold text-text-primary">
                {learningPath.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-description line-clamp-2">
            {learningPath.description}
          </p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-metadata">Progress</span>
              <span className="text-text-primary">
                {learningPath.completedSteps}/{learningPath.totalSteps} selesai
              </span>
            </div>
            <Progress value={progressPercentage} max={100} variant="primary" />
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-text-metadata">
            <span>{learningPath.estimatedDuration} jam</span>
            <span>{learningPath.totalSteps} langkah</span>
          </div>

          {/* Steps Preview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-primary">
              Langkah Pembelajaran:
            </h4>
            <div className="space-y-1">
              {learningPath.steps.slice(0, 3).map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 text-xs p-2 rounded-lg ${
                    step.isCompleted
                      ? "bg-success-50 text-success"
                      : step.isLocked
                      ? "bg-neutral-100 text-text-metadata"
                      : "bg-primary-50 text-primary"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      step.isCompleted
                        ? "text-success"
                        : step.isLocked
                        ? "text-text-metadata"
                        : "text-primary"
                    }`}
                  >
                    {getStepIcon(step)}
                  </div>
                  <span className="flex-1 truncate">{step.title}</span>
                  <span>{Math.ceil(step.duration / 60)} min</span>
                </div>
              ))}
              {learningPath.steps.length > 3 && (
                <div className="text-xs text-text-metadata text-center py-1">
                  +{learningPath.steps.length - 3} langkah lainnya
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {nextStep ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStartStep(nextStep.id)}
                className="w-full"
                icon={<PlayIcon />}
              >
                {learningPath.completedSteps === 0
                  ? "Mulai Belajar"
                  : "Lanjutkan"}
              </Button>
            ) : progressPercentage === 100 ? (
              <Button
                variant="success"
                size="sm"
                disabled
                className="w-full"
                icon={<CheckIcon />}
              >
                Selesai
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewPath(learningPath.id)}
                className="w-full"
              >
                Lihat Detail
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewPath(learningPath.id)}
              className="w-full"
              icon={<ArrowIcon />}
            >
              Lihat Semua Langkah
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
