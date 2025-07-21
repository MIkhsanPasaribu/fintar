"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  MessageSquare,
  BookOpen,
  Shield,
  Users,
  BarChart3,
  Brain,
  Smartphone,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Award,
  Globe,
  Lock,
  Sparkles,
  PieChart,
  Wallet,
  DollarSign,
  Clock,
  ThumbsUp,
  PiggyBank,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Keuangan Personal",
    description:
      "Kelola pemasukan, pengeluaran, dan target finansial dengan visualisasi yang mudah dipahami",
    color: "text-primary-600 bg-primary-50",
    gradient: "from-primary-600 to-primary-700",
    iconColor: "text-primary-600",
    shadowColor: "shadow-primary-500/20",
  },
  {
    icon: Brain,
    title: "AI Financial Copilot",
    description:
      "Konsultasi 24/7 dengan AI untuk rekomendasi budgeting, tabungan, dan investasi",
    color: "text-blue-600 bg-blue-50",
    gradient: "from-blue-600 to-indigo-700",
    iconColor: "text-blue-600",
    shadowColor: "shadow-blue-500/20",
  },
  {
    icon: BookOpen,
    title: "Edukasi Literasi Keuangan",
    description:
      "Tingkatkan pengetahuan finansial dengan konten microlearning yang disesuaikan AI",
    color: "text-amber-600 bg-amber-50",
    gradient: "from-amber-500 to-amber-600",
    iconColor: "text-amber-600",
    shadowColor: "shadow-amber-500/20",
  },
  {
    icon: Users,
    title: "Konsultasi dengan Ahli",
    description: "Booking dan live chat dengan konsultan keuangan profesional",
    color: "text-emerald-600 bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-700",
    iconColor: "text-emerald-600",
    shadowColor: "shadow-emerald-500/20",
  },
];

const benefits = [
  { icon: Shield, text: "Keamanan data terjamin dengan enkripsi tingkat bank" },
  { icon: Smartphone, text: "Akses mudah dari desktop dan mobile" },
  { icon: TrendingUp, text: "Rekomendasi personal berbasis AI" },
  { icon: MessageSquare, text: "Dukungan 24/7 dari AI Assistant" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                <DollarSign className="text-white h-5 w-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-font-primary">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Fin</span>tar
              </span>
            </div>
            
            {/* Navigation links - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-font-primary hover:text-primary-600 font-medium transition-colors">
                Fitur
              </Link>
              <Link href="#pricing" className="text-font-primary hover:text-primary-600 font-medium transition-colors">
                Harga
              </Link>
              <Link href="#testimonials" className="text-font-primary hover:text-primary-600 font-medium transition-colors">
                Testimoni
              </Link>
              <Link href="#faq" className="text-font-primary hover:text-primary-600 font-medium transition-colors">
                FAQ
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium hover:bg-primary-50">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-shadow">
                  <span>Daftar Gratis</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/90 to-primary-50/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0F172A_0%,_transparent_60%)] opacity-[0.04]"></div>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 shadow-lg"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-10">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-primary-50 px-4 py-2 mb-4 border border-primary-100 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-600">Inovasi Finansial #1 di Indonesia</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-font-primary leading-tight">
                Wujudkan
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  {" "}
                  Kebebasan Finansial{" "}
                </span>
                <br className="hidden md:block" />
                dengan AI
              </h1>
              
              <p className="text-xl text-font-secondary max-w-3xl mx-auto leading-relaxed">
                Platform pemberdayaan finansial berbasis AI yang membantu
                individu dan UMKM mengelola keuangan, meningkatkan literasi
                finansial, dan meraih tujuan keuangan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-4 shadow-xl shadow-primary-600/30 hover:shadow-primary-600/40 transition-all duration-300 font-medium">
                  <span>Mulai Gratis Sekarang</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 hover:bg-neutral-50 transition-all duration-300 font-medium">
                <PieChart className="mr-2 h-5 w-5" />
                <span>Lihat Demo</span>
              </Button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <span>✨ Gratis untuk individu</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <Lock className="h-5 w-5 text-primary-600" />
                <span>🔒 Data aman terlindungi</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <Zap className="h-5 w-5 text-primary-600" />
                <span>🚀 Setup dalam 2 menit</span>
              </div>
            </div>
            
            {/* Social proof section */}
            <div className="mt-12 pt-6 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 mb-4">Dipercaya oleh 10,000+ pengguna</p>
              <div className="flex flex-wrap justify-center gap-8 opacity-70">
                {/* Mock company logos */}
                <div className="h-8 w-24 bg-neutral-300 rounded"></div>
                <div className="h-8 w-24 bg-neutral-300 rounded"></div>
                <div className="h-8 w-24 bg-neutral-300 rounded"></div>
                <div className="h-8 w-24 bg-neutral-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-600/10 rounded-full filter blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-primary-50 to-white relative" id="features">
        <div className="absolute right-0 top-0 w-72 h-72 bg-primary-200 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute left-0 bottom-0 w-72 h-72 bg-secondary-200 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1E40AF_0%,_transparent_70%)] opacity-[0.03]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-block rounded-full bg-primary-50 px-4 py-2 mb-4 border border-primary-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">Platform Unggulan</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
              Fitur <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Unggulan</span> untuk Masa Depan Finansial Anda
            </h2>
            
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Semua yang Anda butuhkan untuk menguasai keuangan pribadi dan
              bisnis dalam satu platform terintegrasi dan user-friendly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="overflow-hidden border-none bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group shadow-lg"
              >
                <div className={`h-2 w-full bg-gradient-to-r ${feature.gradient}`}></div>
                <CardHeader className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3.5 rounded-full ${feature.color} ${feature.shadowColor} shadow-lg`}>
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-neutral-900">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex justify-end">
                    <div className="text-primary-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                      <span className="mr-1">Pelajari</span> 
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-primary-50 relative" id="pricing">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1E40AF_0%,_transparent_60%)] opacity-[0.07]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#0E7490_0%,_transparent_60%)] opacity-[0.07]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(30,64,175,0.03)_0,_rgba(30,64,175,0.03)_1px,_transparent_1px,_transparent_20px)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block rounded-full bg-gradient-to-r from-blue-50 to-primary-50 px-6 py-3 mb-4 border border-blue-100 shadow-md">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-primary-600">Harga Transparan</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-primary-700">Pilih Paket yang Tepat untuk Anda</span>
            </h2>
            
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              Solusi fleksibel untuk setiap tahap perjalanan finansial Anda
            </p>
            
            <div className="inline-flex mt-6 p-1 bg-white rounded-full shadow-lg border border-primary-100">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-600 to-blue-600 text-white font-medium transition-all">Bulanan</button>
              <button className="px-8 py-3 rounded-full text-neutral-700 font-medium hover:bg-neutral-50 transition-all">Tahunan (Hemat 20%)</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02] duration-300 flex flex-col">
              <div className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mt-16 -mr-16 opacity-30"></div>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg transform rotate-3 relative">
                  <PieChart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900">Gratis</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-blue-700">Rp0</span>
                  <span className="ml-2 text-blue-500 font-medium">/bulan</span>
                </div>
                <p className="mt-2 text-sm text-blue-600">Untuk penggunaan personal</p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-neutral-700">Dashboard keuangan dasar</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-neutral-700">5 pertanyaan AI/bulan</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-neutral-700">Modul edukasi dasar</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-neutral-700">1 akun bank</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 mt-auto bg-gradient-to-t from-blue-50 to-white pt-6 border-t border-blue-100">
                <Link href="/register">
                  <Button variant="outline" className="w-full font-medium py-6 text-blue-700 border-blue-300 bg-white hover:bg-blue-50 transition-colors">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Daftar Gratis
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-white to-primary-50 rounded-2xl shadow-2xl border-2 border-primary-400 overflow-hidden relative transform transition-all hover:shadow-2xl hover:scale-[1.05] duration-300 flex flex-col">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg border border-primary-500">
                Paling Populer
              </div>
              
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full -mt-16 -mr-16 opacity-30"></div>
              
              <div className="p-8 pt-12 relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 shadow-lg transform rotate-3">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900">Premium</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-primary-700">Rp99.000</span>
                  <span className="ml-2 text-primary-500 font-medium">/bulan</span>
                </div>
                <p className="mt-2 text-sm text-primary-600">Untuk perencanaan keuangan mendalam</p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-neutral-700">Dashboard keuangan lengkap</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-neutral-700">AI tanpa batas</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-neutral-700">Semua modul edukasi</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-neutral-700">5 akun bank</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-neutral-700">1 konsultasi expert/bulan</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-neutral-700">Pelaporan pajak pribadi</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 mt-auto bg-gradient-to-t from-primary-100 to-white pt-6 border-t border-primary-200">
                <Link href="/register">
                  <Button className="w-full font-medium py-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/30 border-0">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Berlangganan Sekarang
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Business Plan */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl border border-amber-100 overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02] duration-300 flex flex-col">
              <div className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full -mt-16 -mr-16 opacity-30"></div>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg transform rotate-3 relative">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900">Bisnis</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-amber-700">Rp249.000</span>
                  <span className="ml-2 text-amber-500 font-medium">/bulan</span>
                </div>
                <p className="mt-2 text-sm text-amber-600">Untuk UMKM & bisnis kecil</p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-neutral-700">Semua fitur Premium</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-neutral-700">Pemisahan keuangan pribadi-bisnis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-neutral-700">Analisis arus kas & profitabilitas</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-neutral-700">10 akun bank</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-neutral-700">5 pengguna</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-neutral-700">Laporan pajak bisnis</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 mt-auto bg-gradient-to-t from-amber-50 to-white pt-6 border-t border-amber-100">
                <Link href="/register">
                  <Button variant="outline" className="w-full font-medium py-6 text-amber-700 border-amber-300 bg-white hover:bg-amber-50 transition-colors">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Coba 14 Hari Gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Enterprise */}
          <div className="mt-16 bg-gradient-to-br from-blue-900 to-primary-900 rounded-3xl p-10 shadow-2xl relative overflow-hidden border border-blue-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_white_0%,_transparent_60%)] opacity-[0.04]"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(255,255,255,0.05)_0,_rgba(255,255,255,0.05)_1px,_transparent_1px,_transparent_10px)]"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between relative z-10">
              <div className="space-y-4 flex items-start">
                <div className="mr-6">
                  <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg border border-white/20">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center space-x-2 px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-3">
                    <Lock className="h-3 w-3 text-blue-300" />
                    <span className="text-xs font-medium text-blue-200">Keamanan & Kustomisasi</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Solusi Enterprise</h3>
                  <p className="text-blue-100 max-w-2xl mt-2">
                    Untuk perusahaan besar yang membutuhkan solusi keuangan skala besar dengan keamanan tinggi, integrasi sistem, dan fitur kustomisasi sesuai kebutuhan.
                  </p>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <Button className="bg-white text-blue-900 hover:bg-white/90 py-6 px-8 font-medium shadow-xl shadow-blue-950/30">
                  <Shield className="mr-2 h-5 w-5" />
                  Hubungi Tim Enterprise
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-neutral-100 to-neutral-50" id="testimonials">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1E40AF_0%,_transparent_60%)] opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,_rgba(30,64,175,0.03)_0,_rgba(30,64,175,0.03)_1px,_transparent_1px,_transparent_30px)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block rounded-full bg-blue-50 px-4 py-2 mb-4 border border-blue-100">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-blue-600">Pengalaman Pengguna</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-neutral-900">
              Kisah Sukses Finansial Pengguna Kami
            </h2>
            
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Lihat bagaimana Fintar telah membantu ribuan orang meningkatkan kesehatan finansial mereka
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-white to-primary-50 rounded-2xl shadow-xl p-8 border border-primary-100 relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl font-serif">&ldquo;</span>
              </div>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-700 leading-relaxed">
                    &ldquo;Fintar membantu saya membuat budget yang realistis dan mengubah kebiasaan belanja saya. Berkat AI Financial Copilot, saya berhasil menghemat 30% penghasilan bulanan.&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-primary-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 mr-4 border-2 border-white shadow-md"></div>
                    <div>
                      <p className="font-medium text-neutral-900">Budi Santoso</p>
                      <p className="text-sm text-neutral-600">Karyawan Swasta, Jakarta</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100 relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl font-serif">&ldquo;</span>
              </div>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-700 leading-relaxed">
                    &ldquo;Sebagai pemilik UMKM, modul edukasi keuangan Fintar sangat membantu saya memahami arus kas dan memisahkan keuangan pribadi dari bisnis. Hasilnya, bisnis saya bertumbuh 40% dalam 6 bulan.&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-blue-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 mr-4 border-2 border-white shadow-md"></div>
                    <div>
                      <p className="font-medium text-neutral-900">Siti Rahma</p>
                      <p className="text-sm text-neutral-600">Pemilik UMKM, Bandung</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl p-8 border border-emerald-100 relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl font-serif">&ldquo;</span>
              </div>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-700 leading-relaxed">
                    &ldquo;Konsultasi dengan pakar keuangan melalui Fintar membuka mata saya tentang investasi. Saya mulai dengan dana kecil dan kini berhasil membangun portofolio yang cukup untuk DP rumah dalam 2 tahun.&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-emerald-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 mr-4 border-2 border-white shadow-md"></div>
                    <div>
                      <p className="font-medium text-neutral-900">Ahmad Faisal</p>
                      <p className="text-sm text-neutral-600">Profesional Muda, Surabaya</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats bar */}
          <div className="mt-20 bg-gradient-to-r from-blue-900 to-primary-900 rounded-2xl shadow-2xl p-8 border border-blue-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_white_0%,_transparent_60%)] opacity-[0.03]"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(255,255,255,0.05)_0,_rgba(255,255,255,0.05)_1px,_transparent_1px,_transparent_10px)]"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative z-10">
              <div className="space-y-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto w-14 h-14 bg-primary-500/20 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary-300" />
                </div>
                <p className="text-4xl font-extrabold text-white">10K+</p>
                <p className="text-primary-200 font-medium">Pengguna Aktif</p>
              </div>
              <div className="space-y-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                  <PiggyBank className="h-6 w-6 text-blue-300" />
                </div>
                <p className="text-4xl font-extrabold text-white">Rp2.5M</p>
                <p className="text-blue-200 font-medium">Dana Terhemat</p>
              </div>
              <div className="space-y-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                  <ThumbsUp className="h-6 w-6 text-emerald-300" />
                </div>
                <p className="text-4xl font-extrabold text-white">96%</p>
                <p className="text-emerald-200 font-medium">Kepuasan Pengguna</p>
              </div>
              <div className="space-y-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-amber-300" />
                </div>
                <p className="text-4xl font-extrabold text-white">24/7</p>
                <p className="text-amber-200 font-medium">Dukungan AI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-neutral-50 to-white relative" id="faq">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#F59E0B_0%,_transparent_70%)] opacity-[0.05]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block rounded-full bg-primary-50 px-4 py-2 mb-4 border border-primary-100">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">Tanya Jawab</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-neutral-900">
              Pertanyaan yang Sering Diajukan
            </h2>
            
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Jawaban untuk pertanyaan umum tentang platform finansial Fintar
            </p>
          </div>
          
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all">
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 shadow-inner border border-primary-200">
                    <span className="text-primary-700 font-semibold">Q</span>
                  </div>
                  Bagaimana cara Fintar melindungi data finansial saya?
                </h3>
                <div className="mt-4 pl-11">
                  <p className="text-neutral-700">
                    Fintar menggunakan enkripsi tingkat bank dan protokol keamanan terkini untuk melindungi data Anda. Kami tidak pernah menjual data pengguna dan mengikuti standar keamanan internasional ISO 27001 untuk memastikan informasi finansial Anda aman setiap saat.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-inner border border-blue-200">
                    <span className="text-blue-700 font-semibold">Q</span>
                  </div>
                  Apakah saya perlu memiliki pengetahuan keuangan untuk menggunakan Fintar?
                </h3>
                <div className="mt-4 pl-11">
                  <p className="text-neutral-700">
                    Tidak sama sekali! Fintar dirancang untuk pengguna dengan segala tingkat literasi finansial. AI Financial Copilot kami akan memandu Anda dengan bahasa sederhana, dan modul edukasi kami membantu meningkatkan pemahaman keuangan Anda secara bertahap.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all">
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 shadow-inner border border-amber-200">
                    <span className="text-amber-700 font-semibold">Q</span>
                  </div>
                  Berapa biaya berlangganan Fintar?
                </h3>
                <div className="mt-4 pl-11">
                  <p className="text-neutral-700">
                    Fintar menawarkan versi gratis dengan fitur dasar untuk individu. Untuk fitur lanjutan, kami memiliki paket Premium mulai dari Rp99.000/bulan dan paket Bisnis mulai dari Rp249.000/bulan. Semua paket mencakup akses ke AI Financial Copilot.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all">
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3 shadow-inner border border-emerald-200">
                    <span className="text-emerald-700 font-semibold">Q</span>
                  </div>
                  Bagaimana cara menghubungkan akun bank ke Fintar?
                </h3>
                <div className="mt-4 pl-11">
                  <p className="text-neutral-700">
                    Fintar terintegrasi dengan 95% bank di Indonesia melalui API aman. Cukup masuk ke dasbor Anda, pilih &ldquo;Tambah Akun&rdquo;, dan ikuti panduan untuk menghubungkan akun bank Anda. Koneksi ini hanya untuk membaca data dan Fintar tidak memiliki akses untuk melakukan transaksi dari akun Anda.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-secondary-200 transition-all">
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mr-3 shadow-inner border border-secondary-200">
                    <span className="text-secondary-700 font-semibold">Q</span>
                  </div>
                  Dapatkah saya menggunakan Fintar untuk bisnis UMKM saya?
                </h3>
                <div className="mt-4 pl-11">
                  <p className="text-neutral-700">
                    Tentu! Fintar memiliki fitur khusus untuk UMKM, termasuk pemisahan keuangan pribadi dan bisnis, pelacakan arus kas, dan analisis profitabilitas. Paket Bisnis kami juga mencakup laporan keuangan otomatis dan persiapan pajak.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-neutral-600 mb-6">Masih memiliki pertanyaan?</p>
            <Button variant="outline" className="font-medium">
              <MessageSquare className="mr-2 h-4 w-4" />
              Hubungi Tim Dukungan
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative overflow-hidden" id="benefits">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-secondary-800"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#065F46_0%,_transparent_50%)] opacity-30"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(255,255,255,0.05)_0,_rgba(255,255,255,0.05)_20px,_transparent_20px,_transparent_40px)]"></div>
        
        {/* Glass card container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/15 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/30">
            <div className="p-12 text-center text-white space-y-12">
              <div>
                <div className="inline-block rounded-full bg-white/10 px-4 py-2 mb-4 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-amber-300" />
                    <span className="text-sm font-medium text-white">Keunggulan Kami</span>
                  </div>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight">Mengapa Memilih Fintar?</h2>
                <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                  Platform finansial yang didesain untuk kebutuhan modern dengan keamanan tingkat bank
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-6 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <div className="p-4 bg-white/10 rounded-full shadow-xl shadow-black/10 group-hover:shadow-black/20 transition-all">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-center font-medium text-lg">{benefit.text}</p>
                    <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center pt-6">
                <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-white/90 font-medium shadow-xl shadow-black/10">
                  <Award className="mr-2 h-5 w-5" />
                  <span>Lihat Semua Keunggulan</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-font-primary relative overflow-hidden">
        {/* Abstract financial graph background */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_#0F172A_0%,_#1E293B_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#065F46_0%,_transparent_50%)] opacity-20"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(30,64,175,0.1)_0,_rgba(30,64,175,0.1)_1px,_transparent_1px,_transparent_10px)]"></div>
        
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-primary-900 to-secondary-900 rounded-3xl p-12 shadow-2xl border border-primary-500/30">
            <div className="space-y-8">
              <div className="inline-block rounded-full bg-white/10 px-4 py-2 mb-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-primary-400" />
                  <span className="text-sm font-medium text-primary-300">Mulai Perjalanan Finansial</span>
                </div>
              </div>
              
              <h2 className="text-4xl font-extrabold text-white tracking-tight">
                Siap Mengambil <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">Kontrol Keuangan</span> Anda?
              </h2>
              
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                Bergabunglah dengan ribuan pengguna yang telah merasakan
                transformasi finansial dengan platform AI Fintar
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0 shadow-xl shadow-amber-900/30 font-medium">
                    <span>Daftar Sekarang - Gratis</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/testimonials">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white/30 hover:bg-white/10 transition-colors font-medium">
                    <Users className="mr-2 h-5 w-5" />
                    <span>Baca Testimoni</span>
                  </Button>
                </Link>
              </div>
              
              {/* Security badges */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <Lock className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-300">Data Terenkripsi</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <Shield className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-300">Keamanan Bank-Level</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <Globe className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-300">Support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-blue-50 to-white py-16 border-t border-blue-100 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#1E40AF_0%,_transparent_70%)] opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(30,64,175,0.01)_0,_rgba(30,64,175,0.01)_2px,_transparent_2px,_transparent_10px)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo and tagline */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                  <DollarSign className="text-white h-6 w-6" />
                </div>
                <span className="text-2xl font-extrabold text-neutral-900">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Fin</span>tar
                </span>
              </div>
              <p className="text-neutral-700">
                Platform pemberdayaan finansial berbasis AI untuk individu dan UMKM
              </p>
              <div className="flex space-x-3">
                <a href="#" className="transition-transform hover:scale-110">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-md border border-blue-100 flex items-center justify-center group hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-primary-600">FB</span>
                  </div>
                </a>
                <a href="#" className="transition-transform hover:scale-110">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-md border border-blue-100 flex items-center justify-center group hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-primary-600">TW</span>
                  </div>
                </a>
                <a href="#" className="transition-transform hover:scale-110">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-md border border-blue-100 flex items-center justify-center group hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-primary-600">IG</span>
                  </div>
                </a>
                <a href="#" className="transition-transform hover:scale-110">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-md border border-blue-100 flex items-center justify-center group hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-primary-600">LI</span>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Quick links */}
            <div>
              <h3 className="font-bold text-lg mb-5 text-neutral-900 border-b border-blue-100 pb-2">Produk</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Dashboard</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> AI Copilot</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Edukasi</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Konsultasi</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-5 text-neutral-900 border-b border-blue-100 pb-2">Perusahaan</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Tentang Kami</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Karir</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Press</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-5 text-neutral-900 border-b border-blue-100 pb-2">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Ketentuan Layanan</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Kebijakan Privasi</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Keamanan</a></li>
                <li><a href="#" className="text-font-primary hover:text-primary-600 transition-colors flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-primary-500" /> Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-blue-100 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-neutral-700 text-sm bg-gradient-to-r from-blue-50 to-primary-50 px-4 py-2 rounded-full inline-block shadow-sm border border-blue-100">
                © 2025 Fintar. Semua hak dilindungi. Platform Pemberdayaan Finansial Berbasis AI.
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-6">
              <a href="#" className="text-primary-600 hover:text-primary-700 text-sm hover:underline font-medium">Ketentuan</a>
              <a href="#" className="text-primary-600 hover:text-primary-700 text-sm hover:underline font-medium">Privasi</a>
              <a href="#" className="text-primary-600 hover:text-primary-700 text-sm hover:underline font-medium">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
