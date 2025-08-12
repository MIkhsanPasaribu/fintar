"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Mock data for bookings
  const bookings = [
    {
      id: 1,
      consultantName: "Dr. Sarah Wijaya",
      consultantAvatar: "SW",
      service: "Investment Planning Consultation",
      date: "2025-01-28",
      time: "10:00 AM",
      duration: "60 minutes",
      type: "video",
      status: "confirmed",
      location: "Video Call",
      price: 250000,
    },
    {
      id: 2,
      consultantName: "Budi Santoso",
      consultantAvatar: "BS",
      service: "Business Financial Review",
      date: "2025-01-30",
      time: "2:00 PM",
      duration: "90 minutes",
      type: "in-person",
      status: "pending",
      location: "Surabaya Office",
      price: 300000,
    },
    {
      id: 3,
      consultantName: "Maya Sari",
      consultantAvatar: "MS",
      service: "Personal Budget Planning",
      date: "2025-01-25",
      time: "3:00 PM",
      duration: "45 minutes",
      type: "phone",
      status: "completed",
      location: "Phone Call",
      price: 180000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    switch (activeTab) {
      case "upcoming":
        return booking.status === "confirmed" || booking.status === "pending";
      case "completed":
        return booking.status === "completed";
      case "cancelled":
        return booking.status === "cancelled";
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-purple-100 mb-6">
            Manage your consultation appointments with financial experts
          </p>

          <button className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors font-medium">
            <Plus className="h-5 w-5" />
            <span>Book New Consultation</span>
          </button>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-8 border-b border-gray-200">
          {[
            { id: "upcoming", label: "Upcoming", count: 2 },
            { id: "completed", label: "Completed", count: 1 },
            { id: "cancelled", label: "Cancelled", count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Consultant Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {booking.consultantAvatar}
                </div>

                {/* Booking Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {booking.service}
                      </h3>
                      <p className="text-gray-600">
                        with {booking.consultantName}
                      </p>
                    </div>
                    <div
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(booking.date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {booking.time} ({booking.duration})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(booking.type)}
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        Rp {booking.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              {booking.status === "confirmed" && (
                <>
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Join Meeting
                  </button>
                </>
              )}
              {booking.status === "pending" && (
                <>
                  <button className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Waiting Confirmation
                  </button>
                </>
              )}
              {booking.status === "completed" && (
                <>
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Download Receipt
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Book Again
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} bookings
          </h3>
          <p className="text-gray-600 mb-4">
            {activeTab === "upcoming"
              ? "You don't have any upcoming appointments"
              : `No ${activeTab} bookings found`}
          </p>
          <button className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Book New Consultation</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
