"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
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

interface Consultant {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  avatar: string;
  location: string;
  phone: string;
  email: string;
  bio: string;
  certifications: string[];
  availability: string;
  languages: string[];
}

const ConsultantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Mock data
  const consultants: Consultant[] = [
    {
      id: "1",
      name: "Dr. Ahmad Wijaya",
      title: "Certified Financial Planner",
      specialization: [
        "Financial Planning",
        "Investment",
        "Retirement Planning",
      ],
      experience: 10,
      rating: 4.8,
      reviewCount: 127,
      hourlyRate: 500000,
      avatar: "/avatars/ahmad.jpg",
      location: "Jakarta Selatan",
      phone: "+62 812-3456-7890",
      email: "ahmad.wijaya@fintar.com",
      bio: "CFP dengan pengalaman 10+ tahun membantu individu dan keluarga merencanakan keuangan yang sehat dan berkelanjutan.",
      certifications: ["CFP", "CFA", "QWP"],
      availability: "Available Today",
      languages: ["Indonesian", "English"],
    },
    {
      id: "2",
      name: "Sarah Lestari",
      title: "Investment Specialist",
      specialization: ["Investment", "Tax Planning", "Wealth Management"],
      experience: 7,
      rating: 4.6,
      reviewCount: 89,
      hourlyRate: 400000,
      avatar: "/avatars/sarah.jpg",
      location: "Jakarta Pusat",
      phone: "+62 812-9876-5432",
      email: "sarah.lestari@fintar.com",
      bio: "Investment specialist yang berfokus pada strategi investasi untuk generasi milenial dan Gen Z.",
      certifications: ["CFA", "FRM"],
      availability: "Available Tomorrow",
      languages: ["Indonesian", "English", "Mandarin"],
    },
    {
      id: "3",
      name: "Dimas Pratama",
      title: "Insurance & Protection Expert",
      specialization: ["Insurance", "Risk Management", "Estate Planning"],
      experience: 8,
      rating: 4.7,
      reviewCount: 156,
      hourlyRate: 350000,
      avatar: "/avatars/dimas.jpg",
      location: "Bandung",
      phone: "+62 813-1111-2222",
      email: "dimas.pratama@fintar.com",
      bio: "Ahli asuransi dan manajemen risiko dengan fokus pada perlindungan keuangan keluarga.",
      certifications: ["AAIJ", "CLU", "ChFC"],
      availability: "Available This Week",
      languages: ["Indonesian"],
    },
  ];

  const specializations = [
    "all",
    "Financial Planning",
    "Investment",
    "Insurance",
    "Tax Planning",
    "Retirement Planning",
    "Wealth Management",
    "Risk Management",
  ];

  const filteredConsultants = consultants.filter((consultant) => {
    const matchesSearch =
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      consultant.specialization.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  const sortedConsultants = [...filteredConsultants].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.experience - a.experience;
      case "price-low":
        return a.hourlyRate - b.hourlyRate;
      case "price-high":
        return b.hourlyRate - a.hourlyRate;
      default:
        return 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
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
                  <h3 className="font-semibold">Certified Experts</h3>
                  <p className="text-sm text-blue-100">
                    CFP, CFA qualified advisors
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">1-on-1 Consultation</h3>
                  <p className="text-sm text-blue-100">
                    Personalized financial advice
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Comprehensive Planning</h3>
                  <p className="text-sm text-blue-100">
                    Complete financial roadmap
                  </p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search consultants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Specialization Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec === "all" ? "All Specializations" : spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {sortedConsultants.length} of {consultants.length} consultants
        </div>

        {/* Consultants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedConsultants.map((consultant, index) => (
            <motion.div
              key={consultant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {consultant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {consultant.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {consultant.title}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{consultant.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        ({consultant.reviewCount} reviews)
                      </p>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {consultant.specialization.slice(0, 3).map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>{consultant.experience} years exp.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{consultant.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatCurrency(consultant.hourlyRate)}/hour</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-green-600">
                        {consultant.availability}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {consultant.bio}
                  </p>

                  {/* Certifications */}
                  <div className="flex items-center space-x-2 mt-3">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {consultant.certifications.join(", ")}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 mt-4">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Book Consultation</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedConsultants.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No consultants found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ConsultantsPage;
