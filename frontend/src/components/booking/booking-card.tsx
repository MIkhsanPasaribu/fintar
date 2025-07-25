"use client";

import { motion } from "framer-motion";
import { Avatar, Badge, Button } from "@/components/ui";
import { Booking } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  onReschedule: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  onJoin: (bookingId: string) => void;
}

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

const XIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function BookingCard({
  booking,
  onReschedule,
  onCancel,
  onJoin,
}: BookingCardProps) {
  const getStatusBadge = () => {
    switch (booking.status) {
      case "CONFIRMED":
        return <Badge variant="success">Dikonfirmasi</Badge>;
      case "PENDING":
        return <Badge variant="warning">Menunggu</Badge>;
      case "COMPLETED":
        return <Badge variant="primary">Selesai</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Dibatalkan</Badge>;
      default:
        return <Badge variant="secondary">{booking.status}</Badge>;
    }
  };

  const getTypeLabel = () => {
    switch (booking.type) {
      case "CONSULTATION":
        return "Konsultasi";
      case "FOLLOW_UP":
        return "Follow-up";
      case "EMERGENCY":
        return "Darurat";
      default:
        return booking.type;
    }
  };

  const isUpcoming = () => {
    const scheduledDate = new Date(booking.scheduledAt);
    const now = new Date();
    return scheduledDate > now && booking.status === "CONFIRMED";
  };

  const canJoin = () => {
    const scheduledDate = new Date(booking.scheduledAt);
    const now = new Date();
    const timeDiff = scheduledDate.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    // Allow joining 15 minutes before scheduled time
    return (
      minutesDiff <= 15 && minutesDiff >= -60 && booking.status === "CONFIRMED"
    );
  };

  const canModify = () => {
    return ["CONFIRMED", "PENDING"].includes(booking.status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-hover transition-shadow"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={booking.consultant?.avatar}
              firstName={booking.consultant?.firstName}
              lastName={booking.consultant?.lastName}
              size="md"
            />
            <div>
              <h3 className="font-semibold text-text-primary">
                {booking.consultant?.firstName} {booking.consultant?.lastName}
              </h3>
              <p className="text-sm text-text-metadata">
                {getTypeLabel()} • {booking.duration} menit
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Schedule Info */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-text-description mb-2">
            <CalendarIcon />
            <span className="text-sm">
              {formatDateTime(booking.scheduledAt)}
            </span>
          </div>
          <div className="text-lg font-semibold text-success">
            {formatCurrency(booking.price)}
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mb-4">
            <p className="text-sm text-text-description line-clamp-2">
              {booking.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {canJoin() && (
            <Button
              onClick={() => onJoin(booking.id)}
              className="flex-1"
              icon={<VideoIcon />}
            >
              Gabung Meeting
            </Button>
          )}

          {!canJoin() && isUpcoming() && (
            <Button
              variant="outline"
              onClick={() => onReschedule(booking.id)}
              disabled={!canModify()}
              icon={<EditIcon />}
            >
              Reschedule
            </Button>
          )}

          {canModify() && (
            <Button
              variant="outline"
              onClick={() => onCancel(booking.id)}
              className="text-danger border-danger hover:bg-danger-50"
              icon={<XIcon />}
            >
              Batalkan
            </Button>
          )}
        </div>

        {/* Status Messages */}
        {isUpcoming() && !canJoin() && (
          <div className="mt-3 text-xs text-text-metadata">
            Meeting akan bisa diakses 15 menit sebelum jadwal
          </div>
        )}
      </div>
    </motion.div>
  );
}
