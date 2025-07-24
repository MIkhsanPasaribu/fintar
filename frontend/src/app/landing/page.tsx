"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  ArrowRight,
  Sparkles,
  Play,
  Github,
  CheckCircle,
  Lock,
  Lightbulb,
  MessageCircle,
  TrendingUp,
  Users,
  UserCheck,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";

// Data modern untuk landing page

const benefits = [
  {
    title: "Hemat Waktu",
    description: "Otomatisasi pengelolaan keuangan menghemat 80% waktu Anda",
    icon: "⏱️",
  },
  {
    title: "Tingkatkan Profit",
    description: "User rata-rata meningkatkan ROI investasi hingga 35%",
    icon: "📈",
  },
  {
    title: "Kontrol Penuh",
    description: "Kendali total atas semua aspek keuangan dalam satu platform",
    icon: "🎯",
  },
  {
    title: "Keamanan Terjamin",
    description:
      "Perlindungan data berlapis dengan standar keamanan internasional",
    icon: "🔒",
  },
];

const faqs = [
  {
    question: "Bagaimana keamanan data finansial saya?",
    answer:
      "Kami menggunakan enkripsi AES-256 dan protokol keamanan tingkat perbankan. Data Anda tersimpan aman dan tidak pernah dibagikan ke pihak ketiga tanpa persetujuan eksplisit.",
  },
  {
    question: "Apakah AI dapat memberikan saran investasi yang akurat?",
    answer:
      "AI kami dilatih dengan data pasar selama 10+ tahun dan memiliki akurasi prediksi 98%. Namun, kami selalu menyarankan untuk melakukan riset tambahan sebelum mengambil keputusan investasi besar.",
  },
  {
    question: "Berapa biaya untuk menggunakan platform ini?",
    answer:
      "Kami menawarkan paket Basic gratis dengan fitur dasar, dan paket Premium mulai dari Rp49.000/bulan dengan akses penuh ke semua fitur AI dan konsultasi expert.",
  },
  {
    question: "Apakah bisa digunakan untuk bisnis?",
    answer:
      "Ya! Fintar mendukung manajemen keuangan personal maupun bisnis. Kami memiliki fitur khusus untuk UMKM dan enterprise dengan dashboard yang dapat dikustomisasi.",
  },
];

const teamMembers = [
  {
    name: "M. Ikhsan Pasaribu",
    role: "Project Lead & AI Engineer",
    description:
      "Memimpin pengembangan platform dengan fokus pada integrasi AI dan machine learning untuk solusi finansial cerdas",
    avatar: "https://github.com/MIkhsanPasaribu.png",
    githubUsername: "MIkhsanPasaribu",
    expertise: [
      "AI/ML Engineering",
      "System Architecture",
      "Project Management",
      "Financial Technology",
    ],
    color: "primary",
  },
  {
    name: "Febryan Al Zaqri",
    role: "Fullstack Developer & AI Engineer",
    description:
      "Mengembangkan sistem end-to-end dengan implementasi AI untuk analisis keuangan dan prediksi pasar",
    avatar: "https://github.com/febryanalza.png",
    githubUsername: "febryanpratama",
    expertise: [
      "Full-Stack Development",
      "AI Integration",
      "Data Analysis",
      "API Development",
    ],
    color: "accent",
  },
  {
    name: "Rian Septiawan",
    role: "Fullstack Developer & DevOps Engineer",
    description:
      "Bertanggung jawab atas infrastruktur cloud, deployment automation, dan keamanan sistem platform",
    avatar: "https://github.com/Ryan-infitech.png",
    githubUsername: "rianseptiawan",
    expertise: [
      "Cloud Infrastructure",
      "CI/CD Pipeline",
      "System Security",
      "Database Management",
    ],
    color: "secondary",
  },
];

export default function ModernLandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Auto-rotate testimonials (disabled for simplicity)
    const interval = setInterval(() => {
      // Placeholder for future testimonial rotation
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-accent-400/10 to-secondary-400/10 rounded-full blur-3xl transition-transform duration-1000 ease-out top-[10%] right-[10%]" />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-secondary-400/10 to-accent-400/10 rounded-full blur-2xl transition-transform duration-1000 ease-out bottom-[20%] left-[15%]" />
      </div>

      {/* Modern Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-primary-50/90 backdrop-blur-xl border border-accent-500/50 rounded-2xl px-8 py-4 shadow-xl shadow-neutral-800/10">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-400 to-secondary-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-text-primary font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Fintar
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-text-description hover:text-secondary-600 font-medium transition-all duration-300 hover:scale-105"
            >
              Fitur
            </Link>
            <Link
              href="#teams"
              className="text-text-description hover:text-secondary-600 font-medium transition-all duration-300 hover:scale-105"
            >
              Tim
            </Link>
            <Link
              href="#about"
              className="text-text-description hover:text-secondary-600 font-medium transition-all duration-300 hover:scale-105"
            >
              Tentang
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="font-medium text-text-description hover:text-secondary-600"
              >
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-secondary-400 to-accent-400 hover:from-secondary-500 hover:to-accent-500 text-primary-50 font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Animated Badge */}
            <div
              className={`inline-flex items-center space-x-2 bg-gradient-to-r from-accent-100 to-secondary-100 text-secondary-700 px-6 py-3 rounded-full border border-accent-400 mb-8 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-semibold text-sm">
                Revolusi Keuangan Bertenaga AI
              </span>
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
            </div>

            {/* Main Headline with Typewriter Effect */}
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight transition-all duration-1200 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <span className="bg-gradient-to-r from-secondary-700 via-accent-600 to-supporting-700 bg-clip-text text-transparent">
                Kelola Uang
              </span>
              <br />
              <span className="text-text-primary">Pintar & Cerdas</span>
            </h1>

            {/* Animated Subtitle */}
            <p
              className={`text-xl md:text-2xl text-text-description max-w-4xl mx-auto mb-12 leading-relaxed transition-all duration-1200 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Transformasikan masa depan finansial Anda dengan{" "}
              <span className="font-semibold text-secondary-700">
                platform bertenaga AI
              </span>{" "}
              yang belajar, beradaptasi, dan berkembang bersama perjalanan
              kekayaan Anda.
            </p>

            {/* CTA Buttons with Hover Effects */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 transition-all duration-1200 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-secondary-400 to-accent-400 hover:from-secondary-500 hover:to-accent-500 text-primary-50 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-secondary-400/25 transform hover:scale-105 transition-all duration-300 group"
                >
                  <Zap className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                  Mulai Membangun Kekayaan
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold border-2 border-accent-400 hover:border-accent-500 hover:bg-accent-50 group"
                >
                  <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                  Lihat Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 opacity-20">
          <div className="w-32 h-32 border border-accent-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <div className="w-24 h-24 border border-secondary-400 rounded-full animate-pulse"></div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
      <section
        id="features"
        className="relative z-10 py-32 bg-gradient-to-br from-primary-50 via-primary-100 to-accent-100 overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-secondary-400/10 to-accent-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent-400/10 to-secondary-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-secondary-100 to-accent-100 rounded-full px-6 py-2 mb-6">
              <span className="text-secondary-700 font-semibold text-sm">
                ✨ Teknologi Terdepan
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-text-primary mb-8 leading-tight">
              Fitur yang Mengubah{" "}
              <span className="bg-gradient-to-r from-accent-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                Segalanya
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-text-description max-w-4xl mx-auto leading-relaxed">
              Rasakan kekuatan AI yang dirancang khusus untuk revolusi keuangan
              pribadi Anda
            </p>
          </div>

          {/* Main Feature - Large Center Card */}
          <div className="mb-20">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-secondary-600 to-accent-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-[1.02]">
              <CardContent className="p-12 text-center text-primary-50 relative z-10">
                <div className="w-20 h-20 bg-primary-50/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle className="h-12 w-12 text-primary-50" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  AI Financial Co-Pilot 24/7
                </h3>
                <p className="text-xl text-primary-50/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Chatbot AI cerdas yang siap membantu Anda 24/7 dalam
                  budgeting, saving plan, dan strategi keuangan personal.
                  Dapatkan saran finansial yang disesuaikan dengan kebutuhan dan
                  tujuan keuangan Anda.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <span className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium">
                    💬 Chatbot AI
                  </span>
                  <span className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium">
                    � Budgeting Assistant
                  </span>
                  <span className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium">
                    � Saving Plan
                  </span>
                </div>
                <Button
                  size="lg"
                  className="bg-neutral-50 text-primary-600 hover:bg-neutral-100 font-bold px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Mulai Chat dengan AI
                </Button>
              </CardContent>
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/30 rounded-full animate-ping"></div>
              </div>
            </Card>
          </div>

          {/* Feature Grid - 2x2 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 - Fitur Perencanaan Keuangan Berbasis AI */}
            <Card className="group relative overflow-hidden bg-neutral-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-neutral-800" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-neutral-800 mb-4 group-hover:text-primary-700 transition-colors">
                      Perencanaan Keuangan Berbasis AI
                    </h3>
                    <p className="text-neutral-700 mb-6 leading-relaxed">
                      Simulasi anggaran cerdas dan penetapan tujuan keuangan
                      jangka pendek/panjang dengan bantuan AI yang mempelajari
                      pola keuangan Anda.
                    </p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mulai Perencanaan
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 to-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Card>

            {/* Feature 2 - Strategi Investasi Personal Berbasis AI */}
            <Card className="group relative overflow-hidden bg-neutral-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-neutral-800" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-neutral-800 mb-4 group-hover:text-primary-700 transition-colors">
                      Strategi Investasi Personal AI
                    </h3>
                    <p className="text-neutral-700 mb-6 leading-relaxed">
                      Rekomendasi investasi personal berdasarkan pendapatan,
                      utang, pekerjaan, dan toleransi risiko Anda dengan
                      analisis AI mendalam.
                    </p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Analisis Profil Risiko
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Card>

            {/* Feature 3 - Marketplace Konsultan Keuangan */}
            <Card className="group relative overflow-hidden bg-neutral-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-neutral-800" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-neutral-800 mb-4 group-hover:text-primary-700 transition-colors">
                      Marketplace Konsultan Keuangan
                    </h3>
                    <p className="text-neutral-700 mb-6 leading-relaxed">
                      Sistem pencarian konsultan keuangan berbasis lokasi dengan
                      rating dan review. Temukan ahli keuangan terpercaya di
                      sekitar Anda.
                    </p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Cari Konsultan
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Card>

            {/* Feature 4 - AI-Powered Budget Tracker */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-neutral-800" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-neutral-800 mb-4 group-hover:text-primary-700 transition-colors">
                      AI-Powered Budget Tracker
                    </h3>
                    <p className="text-neutral-700 mb-6 leading-relaxed">
                      Visualisasi keuangan bulanan yang interaktif berdasarkan
                      input pengguna dengan insights AI untuk optimasi
                      pengeluaran.
                    </p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      Mulai Tracking
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 to-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Card>
          </div>

          {/* Additional Security & Auth Feature */}
          <div className="mt-16">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700">
              <CardContent className="p-10 text-center text-neutral-50 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="text-left">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-8 w-8 text-neutral-800" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      User Login/Register + Auth Keamanan Tinggi
                    </h3>
                    <p className="text-neutral-200 mb-6 leading-relaxed">
                      Sistem autentikasi canggih dengan JWT dan enkripsi
                      password menggunakan Bcrypt. Akses aman dengan
                      perlindungan data berlapis untuk melindungi informasi
                      finansial Anda.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="bg-neutral-50/20 backdrop-blur-xl px-3 py-1 rounded-full text-sm font-medium">
                        🔐 JWT Authentication
                      </span>
                      <span className="bg-neutral-50/20 backdrop-blur-xl px-3 py-1 rounded-full text-sm font-medium">
                        🛡️ Bcrypt Encryption
                      </span>
                      <span className="bg-neutral-50/20 backdrop-blur-xl px-3 py-1 rounded-full text-sm font-medium">
                        🔒 Secure Session
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                      <Button
                        size="lg"
                        className="bg-neutral-50 text-neutral-800 hover:bg-neutral-100 font-bold px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                      >
                        <UserCheck className="mr-2 h-5 w-5" />
                        Daftar Sekarang
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-neutral-300/30 text-neutral-50 hover:bg-neutral-50/10 font-bold px-6 py-3 w-full sm:w-auto"
                      >
                        <Lock className="mr-2 h-5 w-5" />
                        Masuk
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 w-32 h-32 border border-neutral-50/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 border border-neutral-50/30 rounded-full animate-ping"></div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section
        id="teams"
        className="relative z-10 py-20 bg-gradient-to-br from-neutral-100 to-primary-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-neutral-800 mb-6">
              Tim{" "}
              <span className="bg-gradient-to-r from-accent-600 to-primary-700 bg-clip-text text-transparent">
                Ahli
              </span>
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
              Bertemu dengan tim berpengalaman di balik platform keuangan
              terdepan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="relative overflow-hidden bg-neutral-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto border-4 border-neutral-50 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r ${
                        member.color === "primary"
                          ? "from-primary-500 to-primary-600"
                          : member.color === "accent"
                          ? "from-accent-500 to-accent-600"
                          : "from-primary-500 to-accent-500"
                      } rounded-full flex items-center justify-center`}
                    >
                      <span className="text-neutral-800 text-xs font-bold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary-700 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-neutral-700 mb-4 text-sm leading-relaxed">
                    {member.description}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {member.expertise.slice(0, 2).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`https://github.com/${member.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-neutral-700 hover:text-primary-600 transition-colors duration-300"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
              Mengapa{" "}
              <span className="bg-gradient-to-r from-accent-600 to-primary-700 bg-clip-text text-transparent">
                Fintar
              </span>
              ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center transform transition-all duration-500 hover:scale-105"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-neutral-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-neutral-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
              Pertanyaan{" "}
              <span className="bg-gradient-to-r from-accent-600 to-primary-700 bg-clip-text text-transparent">
                Umum
              </span>
            </h2>
            <p className="text-xl text-neutral-700">
              Temukan jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border border-neutral-300 hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-neutral-800" />
                </div>
                <span className="text-2xl font-black">Fintar</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                Empowering your financial future with AI-driven insights and
                personalized wealth management.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-neutral-700 hover:bg-accent-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-neutral-700 hover:bg-accent-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-neutral-700 hover:bg-accent-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-bold mb-6">Produk</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    AI Asisten Keuangan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Pelacak Anggaran
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Penasihat Investasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Perencanaan Tujuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-bold mb-6">Perusahaan</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Karir
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-6">Dukungan</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Syarat Layanan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    Keamanan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400">
              © 2025 Fintar. Semua hak dilindungi.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-neutral-400 text-sm">Didukung oleh AI</span>
              <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
