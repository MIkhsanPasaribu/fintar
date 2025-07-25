/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Icons (we'll use simple SVG icons for now)
const ChevronDownIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const BrainIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-6 h-6"
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

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "about", "contact"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <BrainIcon />,
      title: "AI Financial Co-Pilot 24/7",
      description:
        "Chatbot AI untuk membantu budgeting, saving plan, dan perencanaan keuangan personal Anda.",
      color: "text-primary-600",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Strategi Investasi Personal",
      description:
        "Rekomendasi investasi berbasis AI sesuai pendapatan, toleransi risiko, dan tujuan keuangan Anda.",
      color: "text-success",
    },
    {
      icon: <UsersIcon />,
      title: "Marketplace Konsultan",
      description:
        "Temukan konsultan keuangan berpengalaman dengan sistem rating dan pencarian berbasis lokasi.",
      color: "text-accent",
    },
    {
      icon: <ShieldIcon />,
      title: "Keamanan Terjamin",
      description:
        "Data keuangan Anda dilindungi dengan enkripsi tingkat bank dan teknologi keamanan terdepan.",
      color: "text-secondary-600",
    },
  ];

  const stats = [
    { number: "50K+", label: "Pengguna Aktif" },
    { number: "₹10M+", label: "Dana Dikelola" },
    { number: "95%", label: "Tingkat Kepuasan" },
    { number: "24/7", label: "Support AI" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-text-primary">
                  Fintar
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#home"
                className={`text-sm font-medium transition-colors ${
                  activeSection === "home"
                    ? "text-primary"
                    : "text-text-description hover:text-primary"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="#features"
                className={`text-sm font-medium transition-colors ${
                  activeSection === "features"
                    ? "text-primary"
                    : "text-text-description hover:text-primary"
                }`}
              >
                Fitur
              </Link>
              <Link
                href="#about"
                className={`text-sm font-medium transition-colors ${
                  activeSection === "about"
                    ? "text-primary"
                    : "text-text-description hover:text-primary"
                }`}
              >
                Tentang
              </Link>
              <Link
                href="#contact"
                className={`text-sm font-medium transition-colors ${
                  activeSection === "contact"
                    ? "text-primary"
                    : "text-text-description hover:text-primary"
                }`}
              >
                Kontak
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="btn btn-ghost text-sm">
                Masuk
              </Link>
              <Link href="/register" className="btn btn-primary text-sm">
                Daftar Gratis
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-text-description hover:text-primary hover:bg-neutral-50 transition-colors"
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-200"
          >
            <div className="px-4 py-2 space-y-1">
              <Link
                href="#home"
                className="block px-3 py-2 text-text-description hover:text-primary hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="#features"
                className="block px-3 py-2 text-text-description hover:text-primary hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Fitur
              </Link>
              <Link
                href="#about"
                className="block px-3 py-2 text-text-description hover:text-primary hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Tentang
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-text-description hover:text-primary hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Kontak
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-neutral-200">
                <Link href="/login" className="btn btn-ghost">
                  Masuk
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-16 pb-20 bg-gradient-to-br from-background to-primary-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-display text-text-primary mb-6">
                Keuangan Pintar dengan
                <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                  {" "}
                  AI
                </span>
              </h1>
              <p className="text-body-large text-text-paragraph mb-8 max-w-lg">
                Platform keuangan bertenaga AI untuk membantu Anda mengelola
                keuangan, meningkatkan literasi keuangan, dan meraih tujuan
                finansial dengan lebih cerdas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="btn btn-primary btn-lg">
                  Mulai Gratis
                  <ArrowRightIcon />
                </Link>
                <Link href="/chat" className="btn btn-outline btn-lg">
                  Coba AI Assistant
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-text-metadata">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary to-secondary-600 rounded-2xl p-8 text-white">
                <div className="absolute top-4 right-4 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <BrainIcon />
                    </div>
                    <div>
                      <div className="font-semibold">
                        AI Financial Assistant
                      </div>
                      <div className="text-sm opacity-80">Online sekarang</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-sm mb-2">
                      💡 Saran untuk Anda hari ini:
                    </p>
                    <p className="text-sm opacity-90">
                      &quot;Berdasarkan pola pengeluaran bulan ini, Anda bisa
                      menghemat Rp 300.000 dengan mengurangi pembelian kopi
                      harian. Mau tips hemat lainnya?&quot;
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-accent text-text-primary py-2 px-4 rounded-lg text-sm font-medium">
                      Ya, beri tips!
                    </button>
                    <button className="bg-white/20 text-white py-2 px-4 rounded-lg text-sm">
                      Nanti
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-heading text-text-primary mb-4"
            >
              Fitur Unggulan Fintar
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-body-large text-text-description max-w-2xl mx-auto"
            >
              Solusi keuangan lengkap yang didukung teknologi AI terdepan untuk
              membantu Anda mencapai kebebasan finansial.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:shadow-hover transition-all duration-300"
              >
                <div className="card-body text-center">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-description text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-heading text-white mb-6"
          >
            Siap Mulai Perjalanan Keuangan Anda?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-body-large text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat
            pengelolaan keuangan cerdas dengan AI. Gratis untuk memulai!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/register"
              className="btn bg-accent text-text-primary hover:bg-accent-400 btn-lg"
            >
              Daftar Sekarang
              <ArrowRightIcon />
            </Link>
            <Link
              href="/chat"
              className="btn bg-white/20 text-white hover:bg-white/30 btn-lg border-white/20"
            >
              Demo AI Assistant
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-400 rounded-lg flex items-center justify-center">
                  <span className="text-text-primary font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold">Fintar</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Platform keuangan bertenaga AI untuk membantu Anda mencapai
                kebebasan finansial dengan cerdas dan efisien.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link
                    href="/chat"
                    className="hover:text-white transition-colors"
                  >
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/consultants"
                    className="hover:text-white transition-colors"
                  >
                    Konsultan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/education"
                    className="hover:text-white transition-colors"
                  >
                    Edukasi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Karir
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="hover:text-white transition-colors"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="hover:text-white transition-colors"
                  >
                    Keamanan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2025 Fintar. Semua hak dilindungi undang-undang.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
