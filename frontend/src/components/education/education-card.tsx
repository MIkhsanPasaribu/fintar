/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Badge, Button, Progress } from "@/components/ui";

interface EducationContent {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: number; // in minutes
  thumbnail?: string;
  author: string;
  rating: number;
  totalRatings: number;
  isCompleted?: boolean;
  progress?: number; // 0-100
  tags: string[];
  type: "ARTICLE" | "VIDEO" | "COURSE" | "WEBINAR";
}

interface EducationCardProps {
  content: EducationContent;
  onView: (contentId: string) => void;
  onBookmark?: (contentId: string) => void;
  isBookmarked?: boolean;
}

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

const BookIcon = () => (
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
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const VideoIcon = () => (
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
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    className="w-4 h-4"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 fill-current text-accent" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

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

export default function EducationCard({
  content,
  onView,
  onBookmark,
  isBookmarked = false,
}: EducationCardProps) {
  const getTypeIcon = () => {
    switch (content.type) {
      case "VIDEO":
        return <VideoIcon />;
      case "ARTICLE":
        return <BookIcon />;
      case "COURSE":
        return <PlayIcon />;
      case "WEBINAR":
        return <VideoIcon />;
      default:
        return <BookIcon />;
    }
  };

  const getLevelVariant = () => {
    switch (content.level) {
      case "BEGINNER":
        return "success";
      case "INTERMEDIATE":
        return "warning";
      case "ADVANCED":
        return "danger";
      default:
        return "primary";
    }
  };

  const getLevelLabel = () => {
    const labels = {
      BEGINNER: "Pemula",
      INTERMEDIATE: "Menengah",
      ADVANCED: "Lanjutan",
    };
    return labels[content.level];
  };

  const getTypeLabel = () => {
    const labels = {
      ARTICLE: "Artikel",
      VIDEO: "Video",
      COURSE: "Kursus",
      WEBINAR: "Webinar",
    };
    return labels[content.type];
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} menit`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} jam ${remainingMinutes} menit`
      : `${hours} jam`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-hover">
        <CardBody className="space-y-4">
          {/* Thumbnail */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
              {content.thumbnail ? (
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-primary text-3xl">{getTypeIcon()}</div>
              )}
            </div>

            {/* Bookmark Button */}
            <button
              onClick={() => onBookmark?.(content.id)}
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                isBookmarked
                  ? "bg-accent text-white"
                  : "bg-white/80 text-text-metadata hover:text-accent"
              }`}
            >
              <BookmarkIcon filled={isBookmarked} />
            </button>

            {/* Completion Badge */}
            {content.isCompleted && (
              <div className="absolute top-2 left-2 bg-success text-white rounded-full p-1">
                <CheckIcon />
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" size="sm">
                  {getTypeLabel()}
                </Badge>
                <Badge variant={getLevelVariant()} size="sm">
                  {getLevelLabel()}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <StarIcon />
                <span className="text-sm font-medium text-text-primary">
                  {content.rating.toFixed(1)}
                </span>
                <span className="text-xs text-text-metadata">
                  ({content.totalRatings})
                </span>
              </div>
            </div>

            {/* Title and Description */}
            <div>
              <h3 className="font-semibold text-text-primary line-clamp-2 mb-2">
                {content.title}
              </h3>
              <p className="text-sm text-text-description line-clamp-2">
                {content.description}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-text-metadata">
              <span>{content.author}</span>
              <span>{formatDuration(content.duration)}</span>
            </div>

            {/* Progress Bar */}
            {content.progress !== undefined && content.progress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text-metadata">Progress</span>
                  <span className="text-text-primary">{content.progress}%</span>
                </div>
                <Progress
                  value={content.progress}
                  max={100}
                  variant="primary"
                />
              </div>
            )}

            {/* Tags */}
            {content.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {content.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 bg-neutral-100 text-text-metadata text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {content.tags.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-neutral-100 text-text-metadata text-xs rounded-md">
                    +{content.tags.length - 3} lainnya
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            variant={content.isCompleted ? "success" : "primary"}
            size="sm"
            onClick={() => onView(content.id)}
            className="w-full"
            icon={content.isCompleted ? <CheckIcon /> : getTypeIcon()}
          >
            {content.isCompleted
              ? "Selesai"
              : content.progress && content.progress > 0
              ? "Lanjutkan"
              : "Mulai"}
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );
}
