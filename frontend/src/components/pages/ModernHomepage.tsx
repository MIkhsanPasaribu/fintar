"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Badge } from "@/components/ui/badge";
import {
  PiggyBank,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Calculator,
  MessageCircle,
  Play,
  Zap,
  Target,
  Award,
  Globe,
  BarChart3,
  Wallet,
} from "lucide-react";

export function ModernHomepage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-blue-600" />,
      title: "AI Financial Co-Pilot 24/7",
      description:
        "Asisten AI yang membantu perencanaan keuangan, budgeting, dan strategi investasi personal dengan analisis mendalam",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Calculator className="h-8 w-8 text-emerald-600" />,
      title: "Smart Budget Tracker",
      description:
        "Tracking pengeluaran otomatis dengan visualisasi yang mudah dipahami dan rekomendasi penghematan",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Strategi Investasi Personal",
      description:
        "Rekomendasi investasi berdasarkan profil risiko dan tujuan finansial Anda dengan analisis AI",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Marketplace Konsultan",
      description:
        "Akses ke konsultan keuangan tersertifikasi dengan rating dan ulasan dari pengguna lain",
      color: "from-purple-500 to-pink-500",
    },
  ];

  // const stats = [
  //   { number: "10K+", label: "Pengguna Aktif" },
  //   { number: "500+", label: "Konsultan Ahli" },
  //   { number: "95%", label: "Tingkat Kepuasan" },
  //   { number: "24/7", label: "AI Assistant" },
  // ];

  const testimonials = [
    {
      name: "Sarah Wijaya",
      role: "UKM Owner",
      content:
        "Fintar membantu saya mengelola keuangan bisnis dengan lebih baik. AI assistant-nya sangat membantu!",
      rating: 5,
      avatar: "SW",
    },
    {
      name: "Budi Santoso",
      role: "Freelancer",
      content:
        "Fitur budget tracker-nya luar biasa. Sekarang saya bisa mengontrol pengeluaran dengan mudah.",
      rating: 5,
      avatar: "BS",
    },
    {
      name: "Maya Sari",
      role: "Karyawan Swasta",
      content:
        "Konsultasi dengan financial advisor di platform ini sangat membantu rencana investasi saya.",
      rating: 5,
      avatar: "MS",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Fintar
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Fitur
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Harga
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Testimoni
              </a>
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
          </div>
        </div>
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
                    AI-Powered Financial Platform
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Kelola Keuangan
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Dengan AI
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Platform pemberdayaan finansial berbasis AI yang membantu Anda
                  mencapai kebebasan finansial dengan perencanaan yang tepat dan
                  konsultasi ahli.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 group"
                >
                  Mulai Gratis Sekarang
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300">
                  <Play className="mr-2 h-5 w-5" />
                  Lihat Demo
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200/50">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
                  AI Assistant
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">Fintar AI</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700">
                      &quot;Berdasarkan analisis pengeluaran Anda, saya
                      merekomendasikan untuk mengalokasikan 30% untuk investasi
                      saham dan 20% untuk dana darurat.&quot;
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
              Fitur Unggulan <span className="text-blue-600">Fintar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kelola keuangan Anda dengan teknologi AI terdepan dan akses ke
              konsultan ahli
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
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
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

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Apa Kata <span className="text-blue-600">Pengguna</span>
            </h2>
            <p className="text-xl text-gray-600">
              Ribuan pengguna telah merasakan manfaat Fintar
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>
                <blockquote className="text-xl text-gray-700 mb-6 leading-relaxed">
                  &quot;{testimonials[currentTestimonial].content}&quot;
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-blue-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Fintar</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform pemberdayaan finansial berbasis AI untuk mencapai
                kebebasan finansial.
              </p>
              <div className="flex space-x-4">
                <Globe className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <MessageCircle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Assistant
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Budget Tracker
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Investment Planning
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Marketplace
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Karir
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Fintar. All rights reserved. Made with ❤️ for
              Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
