/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Award,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const ConsultantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  // Mock data for consultants
  const consultants = [
    {
      id: 1,
      name: "Dr. Sarah Wijaya",
      title: "Senior Financial Advisor",
      specialty: "Investment Planning",
      rating: 4.9,
      reviews: 127,
      experience: "8 years",
      location: "Jakarta",
      phone: "+62 812-3456-7890",
      email: "sarah.wijaya@fintar.com",
      hourlyRate: 250000,
      availability: "Available Today",
      image: "SW",
      bio: "Specialist in investment planning with focus on Indonesian market dynamics",
      certifications: ["CFP", "CFA", "FRM"],
    },
    {
      id: 2,
      name: "Budi Santoso",
      title: "Business Financial Consultant",
      specialty: "Business Finance",
      rating: 4.8,
      reviews: 89,
      experience: "6 years",
      location: "Surabaya",
      phone: "+62 813-9876-5432",
      email: "budi.santoso@fintar.com",
      hourlyRate: 200000,
      availability: "Available Tomorrow",
      image: "BS",
      bio: "Expert in business financial planning and SME growth strategies",
      certifications: ["CPA", "MBA"],
    },
    {
      id: 3,
      name: "Maya Sari",
      title: "Personal Finance Coach",
      specialty: "Personal Finance",
      rating: 4.7,
      reviews: 156,
      experience: "5 years",
      location: "Bandung",
      phone: "+62 814-1111-2222",
      email: "maya.sari@fintar.com",
      hourlyRate: 180000,
      availability: "Available Now",
      image: "MS",
      bio: "Passionate about helping individuals achieve financial independence",
      certifications: ["CFP", "AFC"],
    },
  ];

  const specialties = [
    "all",
    "Investment Planning",
    "Business Finance",
    "Personal Finance",
    "Tax Planning",
    "Insurance",
  ];

  const filteredConsultants = consultants.filter((consultant) => {
    const matchesSearch = consultant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "all" || consultant.specialty === selectedSpecialty;
    const matchesRating =
      selectedRating === "all" ||
      consultant.rating >= parseFloat(selectedRating);

    return matchesSearch && matchesSpecialty && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Financial Consultants</h1>
          <p className="text-blue-100 mb-6">
            Connect with certified financial experts to achieve your financial
            goals
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">Certified Experts</div>
                <div className="text-sm text-blue-100">
                  All consultants verified
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">500+ Consultants</div>
                <div className="text-sm text-blue-100">
                  Choose your perfect match
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">95% Success Rate</div>
                <div className="text-sm text-blue-100">Proven track record</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search consultants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>

          {/* Specialty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full appearance-none"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty === "all" ? "All Specialties" : specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="relative">
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full appearance-none"
            >
              <option value="all">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredConsultants.map((consultant, index) => (
          <motion.div
            key={consultant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Consultant Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {consultant.image}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {consultant.name}
                  </h3>
                  <p className="text-gray-600">{consultant.title}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {consultant.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({consultant.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultant Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{consultant.specialty}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{consultant.experience} experience</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{consultant.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>Rp {consultant.hourlyRate.toLocaleString()}/hour</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {consultant.bio}
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2 mb-4">
              {consultant.certifications.map((cert) => (
                <span
                  key={cert}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  consultant.availability === "Available Now"
                    ? "bg-green-100 text-green-700"
                    : consultant.availability === "Available Today"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {consultant.availability}
              </span>
            </div>

            {/* Contact Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Book Session</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Message</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredConsultants.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No consultants found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ConsultantsPage;
