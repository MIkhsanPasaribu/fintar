"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Calculator,
  MessageCircle,
  Zap,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import Footer from "../layout/Footer";

export function ModernHomepage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-blue-600" />,
      title: "AI Financial Co-Pilot 24/7",
      description:
        "Asisten AI cerdas yang siap membantu Anda 24/7 untuk konsultasi keuangan, perencanaan budget, dan strategi investasi dengan teknologi AI terdepan",
      color: "from-blue-500 to-cyan-500",
      status: "AKTIF ✨",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
      title: "Analisis Keuangan AI",
      description:
        "Analisis mendalam data keuangan Anda dengan AI untuk memberikan insight dan rekomendasi yang personal dan akurat",
      color: "from-emerald-500 to-teal-500",
      status: "AKTIF ✨",
    },
    {
      icon: <Calculator className="h-8 w-8 text-purple-600" />,
      title: "Rekomendasi Budget Cerdas",
      description:
        "AI menganalisis pola pengeluaran Anda dan memberikan rekomendasi budget yang optimal untuk mencapai tujuan finansial",
      color: "from-purple-500 to-pink-500",
      status: "AKTIF ✨",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Perencanaan Investasi AI",
      description:
        "Strategi investasi personal berdasarkan profil risiko, tujuan keuangan, dan analisis pasar real-time dengan bantuan AI",
      color: "from-orange-500 to-red-500",
      status: "AKTIF ✨",
    },
  ];

  // const stats = [
  //   { number: "10K+", label: "Pengguna Aktif" },
  //   { number: "500+", label: "Konsultan Ahli" },
  //   { number: "95%", label: "Tingkat Kepuasan" },
  //   { number: "24/7", label: "AI Assistant" },
  // ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image
                src="/Fintarlogo.png"
                alt="Fintar Logo"
                width={100}
                height={70}
                className="object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Fitur
              </a>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Tentang
              </Link>
              <Link
                href="/help"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Bantuan
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Daftar Gratis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Fitur
                </a>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Tentang
                </Link>
                <Link
                  href="/help"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Bantuan
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Daftar Gratis
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 text-sm font-medium">
                    Solusi AI Finansial Terdepan
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Fintar: Solusi
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Finansial AI
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  <span className="font-semibold text-blue-700">
                    Fintar: Solusi Optimalisasi Finansial Pintar Keluarga dan
                    UMKM Berbasis AI
                  </span>
                  <br />
                  Platform keuangan cerdas dengan AI Assistant 24/7, analisis
                  finansial mendalam, dan rekomendasi investasi personal yang
                  akurat.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-3 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      AI Chat Assistant Aktif
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      Analisis AI Real-time
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 bg-purple-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-purple-800 font-medium">
                      Budget AI Recommendations
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-orange-800 font-medium">
                      Investment AI Planning
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 group"
                >
                  Mulai dengan AI Assistant Gratis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Test AI Chat Sekarang
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200/50">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
                  ✨ AI AKTIF
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">
                      Fintar AI Assistant
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-blue-800 font-medium">
                      💡 AI Analisis Real-time
                    </p>
                    <p className="text-blue-700 mt-2">
                      &quot;Berdasarkan data keuangan Anda, saya
                      merekomendasikan alokasi 30% untuk investasi saham blue
                      chip, 25% untuk obligasi, dan 20% untuk dana darurat.
                      Proyeksi return: 12-15% per tahun.&quot;
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-xl px-4 py-2 max-w-xs">
                      Terima kasih! Buatkan rencana investasi untuk 6 bulan ke
                      depan.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Fitur AI <span className="text-blue-600">Terdepan</span> ✨
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform Finansial AI pertama di Indonesia yang menggunakan
              teknologi AI terdepan untuk memberikan analisis keuangan terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative"
              >
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {feature.status}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Siap Mencapai Kebebasan Finansial?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Bergabunglah dengan ribuan pengguna yang telah mempercayakan
              perencanaan keuangan mereka kepada Fintar AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-xl transition-all duration-300 group font-semibold"
              >
                Daftar Gratis Sekarang
                <Zap className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Lihat Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
