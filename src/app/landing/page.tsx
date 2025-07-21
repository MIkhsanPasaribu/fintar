"use client";

import React from "react";
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
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Keuangan Personal",
    description:
      "Kelola pemasukan, pengeluaran, dan target finansial dengan visualisasi yang mudah dipahami",
    color: "text-primary-600 bg-primary-100",
  },
  {
    icon: Brain,
    title: "AI Financial Copilot",
    description:
      "Konsultasi 24/7 dengan AI untuk rekomendasi budgeting, tabungan, dan investasi",
    color: "text-secondary-600 bg-secondary-100",
  },
  {
    icon: BookOpen,
    title: "Edukasi Literasi Keuangan",
    description:
      "Tingkatkan pengetahuan finansial dengan konten microlearning yang disesuaikan AI",
    color: "text-accent-600 bg-accent-100",
  },
  {
    icon: Users,
    title: "Konsultasi dengan Ahli",
    description: "Booking dan live chat dengan konsultan keuangan profesional",
    color: "text-orange-600 bg-orange-100",
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-2xl font-bold text-primary-600">
                Fintar
              </span>
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button>Daftar Gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900">
                Wujudkan
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  {" "}
                  Kebebasan Finansial{" "}
                </span>
                dengan AI
              </h1>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Platform pemberdayaan finansial berbasis AI yang membantu
                individu dan UMKM mengelola keuangan, meningkatkan literasi
                finansial, dan meraih tujuan keuangan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-4">
                  Mulai Gratis Sekarang
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Lihat Demo
              </Button>
            </div>

            <p className="text-sm text-neutral-500">
              ✨ Gratis untuk individu • 🔒 Data aman terlindungi • 🚀 Setup
              dalam 2 menit
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-neutral-900">
              Fitur Unggulan untuk Masa Depan Finansial Anda
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk menguasai keuangan pribadi dan
              bisnis dalam satu platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-financial transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white space-y-8">
            <h2 className="text-3xl font-bold">Mengapa Memilih Fintar?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="p-4 bg-white bg-opacity-20 rounded-full">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-center">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Siap Mengambil Kontrol Keuangan Anda?
            </h2>
            <p className="text-xl text-neutral-300">
              Bergabunglah dengan ribuan pengguna yang telah merasakan
              transformasi finansial dengan Fintar
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Daftar Sekarang - Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-2xl font-bold text-primary-600">
                Fintar
              </span>
            </div>
            <p className="text-neutral-600">
              © 2025 Fintar. Semua hak dilindungi. Platform Pemberdayaan
              Finansial Berbasis AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
