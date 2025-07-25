"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Progress, Badge, Button } from "@/components/ui";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { FinancialGoal } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface FinancialGoalCardProps {
  goal: FinancialGoal;
  onEdit?: (goal: FinancialGoal) => void;
  onDelete?: (goalId: string) => void;
  onAddFunds?: (goalId: string) => void;
}

const MoreIcon = () => (
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
      d="M12 5v.01M12 12v.01M12 19v.01"
    />
  </svg>
);

const EditIcon = () => (
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
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const PlusIcon = () => (
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
      d="M12 4v16m8-8H4"
    />
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

export default function FinancialGoalCard({
  goal,
  onEdit,
  onDelete,
  onAddFunds,
}: FinancialGoalCardProps) {
  const progressPercentage = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current;

  const getStatusVariant = (): "success" | "primary" | "warning" | "danger" => {
    if (progressPercentage >= 100) return "success";
    if (progressPercentage >= 75) return "primary";
    if (progressPercentage >= 50) return "warning";
    return "danger";
  };

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      emergency: "Dana Darurat",
      property: "Properti",
      travel: "Liburan",
      education: "Pendidikan",
      retirement: "Pensiun",
      investment: "Investasi",
      business: "Bisnis",
      other: "Lainnya",
    };
    return labels[category || "other"] || "Lainnya";
  };

  const getCategoryIcon = (category?: string) => {
    const icons: Record<string, string> = {
      emergency: "🛡️",
      property: "🏠",
      travel: "✈️",
      education: "🎓",
      retirement: "👴",
      investment: "📈",
      business: "💼",
      other: "🎯",
    };
    return icons[category || "other"] || "🎯";
  };

  const isCompleted = progressPercentage >= 100;
  const daysUntilTarget = goal.targetDate
    ? Math.ceil(
        (new Date(goal.targetDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden ${
          isCompleted ? "border-success" : ""
        }`}
      >
        {isCompleted && (
          <div className="absolute top-0 right-0 bg-success text-white px-3 py-1 text-xs font-medium">
            Tercapai! 🎉
          </div>
        )}

        <CardBody className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
              <div>
                <h3 className="font-semibold text-text-primary">{goal.name}</h3>
                <Badge variant="secondary" size="sm">
                  {getCategoryLabel(goal.category)}
                </Badge>
              </div>
            </div>

            <Dropdown>
              <DropdownTrigger className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <MoreIcon />
              </DropdownTrigger>
              <DropdownContent align="end">
                <DropdownItem onClick={() => onEdit?.(goal)}>
                  <div className="flex items-center space-x-2">
                    <EditIcon />
                    <span>Edit</span>
                  </div>
                </DropdownItem>
                <DropdownItem onClick={() => onAddFunds?.(goal.id)}>
                  <div className="flex items-center space-x-2">
                    <PlusIcon />
                    <span>Tambah Dana</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  onClick={() => onDelete?.(goal.id)}
                  className="text-danger hover:bg-danger-50"
                >
                  <div className="flex items-center space-x-2">
                    <DeleteIcon />
                    <span>Hapus</span>
                  </div>
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-metadata">Progress</span>
              <span className="font-medium text-text-primary">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>

            <Progress
              value={progressPercentage}
              max={100}
              variant={getStatusVariant()}
            />

            <div className="flex justify-between text-sm">
              <span className="text-success font-medium">
                {formatCurrency(goal.current)}
              </span>
              <span className="text-text-metadata">
                {formatCurrency(goal.target)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-metadata">Sisa Target</span>
              <span className="text-sm font-medium text-text-primary">
                {formatCurrency(remaining)}
              </span>
            </div>

            {goal.targetDate && (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <CalendarIcon />
                  <span className="text-sm text-text-metadata">Target</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-text-primary">
                    {formatDate(new Date(goal.targetDate))}
                  </span>
                  {daysUntilTarget !== null && (
                    <p
                      className={`text-xs ${
                        daysUntilTarget < 30
                          ? "text-danger"
                          : daysUntilTarget < 90
                          ? "text-warning"
                          : "text-text-metadata"
                      }`}
                    >
                      {daysUntilTarget > 0
                        ? `${daysUntilTarget} hari lagi`
                        : "Terlewat"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              variant={isCompleted ? "success" : "primary"}
              size="sm"
              className="w-full"
              onClick={() =>
                isCompleted ? onEdit?.(goal) : onAddFunds?.(goal.id)
              }
              disabled={isCompleted}
            >
              {isCompleted ? "Tujuan Tercapai" : "Tambah Dana"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
