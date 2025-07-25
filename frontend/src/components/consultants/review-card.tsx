"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    className={`w-4 h-4 ${
      filled ? "fill-current text-accent" : "fill-current text-neutral-300"
    }`}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon key={index} filled={index < review.rating} />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-neutral-200 rounded-lg p-6"
    >
      <div className="flex items-start space-x-4">
        <Avatar
          src={review.user?.avatar}
          firstName={review.user?.firstName}
          lastName={review.user?.lastName}
          size="md"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-text-primary">
                {review.user?.firstName} {review.user?.lastName}
              </h4>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars()}
              </div>
            </div>
            <span className="text-sm text-text-metadata">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {review.comment && (
            <p className="text-text-description leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
