"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui";
import { Star } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Review {
  id: string;
  userId: string;
  consultantId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  user?: User;
}

interface ReviewCardProps {
  review: Review;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-accent fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const user = review.user || {
    firstName: "Anonymous",
    lastName: "User",
    avatar: undefined,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-text-primary">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-text-description">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-text-primary leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
