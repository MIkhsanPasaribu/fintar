"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  Brain,
  Target,
  ArrowRight,
  Star,
  BarChart3,
  Wallet,
  Calculator,
  BookOpen,
  MessageSquare,
  Calendar,
  ChevronRight,
  Sparkles,
  Banknote,
  CreditCard,
  LineChart,
  Play,
} from "lucide-react";

const stats = [
  { number: "50K+", label: "Active Users", icon: Users },
  { number: "Rp500M+", label: "Managed Assets", icon: Wallet },
  { number: "98%", label: "Success Rate", icon: TrendingUp },
  { number: "4.9/5", label: "User Rating", icon: Star },
];

const features = [
  {
    icon: Brain,
    title: "AI Financial Assistant",
    description:
      "Smart AI yang memahami kebutuhan finansial personal Anda dengan analisis mendalam",
    color: "primary",
    animation: "slide-in-left",
    delay: "animate-delay-500",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Dashboard canggih dengan visualisasi data keuangan yang interaktif dan real-time",
    color: "accent",
    animation: "slide-in-up",
    delay: "animate-delay-800",
  },
  {
    icon: Shield,
    title: "Bank-level Security",
    description:
      "Keamanan tingkat perbankan dengan enkripsi end-to-end untuk melindungi data Anda",
    color: "secondary",
    animation: "slide-in-right",
    delay: "animate-delay-1200",
  },
  {
    icon: Target,
    title: "Goal Planning",
    description:
      "Perencanaan finansial yang disesuaikan dengan target dan timeline personal Anda",
    color: "primary",
    animation: "scale-in",
    delay: "animate-delay-1400",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description:
      "Dapatkan insight keuangan instan dengan prediksi berbasis machine learning",
    color: "accent",
    animation: "flip-in",
    delay: "animate-delay-1000",
  },
  {
    icon: Calculator,
    title: "Smart Calculator",
    description:
      "Kalkulator finansial cerdas untuk semua kebutuhan perhitungan investasi Anda",
    color: "secondary",
    animation: "bounce-in",
    delay: "animate-delay-600",
  },
];

const services = [
  {
    icon: MessageSquare,
    title: "AI Consultation",
    description: "Konsultasi dengan AI assistant 24/7",
    features: [
      "Personal Finance Analysis",
      "Investment Recommendations",
      "Risk Assessment",
    ],
  },
  {
    icon: BookOpen,
    title: "Financial Education",
    description: "Pembelajaran keuangan interaktif",
    features: [
      "Beginner to Expert Courses",
      "Interactive Simulations",
      "Progress Tracking",
    ],
  },
  {
    icon: Calendar,
    title: "Expert Booking",
    description: "Sesi konsultasi dengan ahli keuangan",
    features: [
      "Certified Financial Advisors",
      "Flexible Scheduling",
      "Personalized Advice",
    ],
  },
];

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

export default function DarkLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-primary-base text-font-primary overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-darker via-primary-dark to-bg-surface"></div>
        <div
          className="absolute w-96 h-96 bg-teal-dark/10 rounded-full blur-3xl cursor-glow"
          data-x={mousePosition.x}
          data-y={mousePosition.y}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-light/10 rounded-full blur-2xl animate-floating-delayed"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 glass-effect border-b border-primary-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-dark to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold gradient-text">Fintar</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="nav-link hover:text-primary-600 transition-all duration-300"
              >
                Features
              </Link>
              <Link
                href="#services"
                className="nav-link hover:text-primary-600 transition-all duration-300"
              >
                Services
              </Link>
              <Link
                href="#about"
                className="nav-link hover:text-primary-600 transition-all duration-300"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="nav-link hover:text-primary-600 transition-all duration-300"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-font-light hover:text-primary-600 hover:bg-primary-500/10"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-primary-500 hover:bg-primary-700 text-white shadow-neon-primary hover:shadow-primary-glow transform hover:scale-105 transition-all duration-300">
                  Mulai Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 px-4 py-2 bg-primary-500/20 text-primary-600 border-primary-500/30 animate-pulse-soft">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI Technology
            </Badge>

            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 leading-tight transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <span className="gradient-text">Revolusi</span> Keuangan
              <br />
              <span className="text-font-light">Digital Indonesia</span>
            </h1>

            <p
              className={`text-xl md:text-2xl text-font-secondary max-w-4xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Platform financial technology terdepan dengan{" "}
              <span className="text-primary-600 font-semibold">
                AI Assistant
              </span>{" "}
              yang membantu mengoptimalkan keuangan personal dan bisnis Anda
              secara otomatis
            </p>

            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 transition-all duration-1000 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="btn-primary px-8 py-4 text-lg font-semibold"
                >
                  <Play className="mr-3 h-5 w-5" />
                  Mulai Sekarang Gratis
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg border-primary-500 text-primary-600 hover:bg-primary-500/10"
                >
                  <LineChart className="mr-3 h-5 w-5" />
                  Lihat Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center animate-fade-in-scale animate-delay-${
                    (index + 1) * 200
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-font-light mb-1">
                    {stat.number}
                  </div>
                  <div className="text-font-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-font-light mb-6">
              Fitur <span className="gradient-text">Revolusioner</span>
            </h2>
            <p className="text-xl text-font-secondary max-w-3xl mx-auto">
              Teknologi terdepan untuk mengelola keuangan dengan lebih cerdas
              dan efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`card-hover glass-effect border-primary-500/20 ${feature.animation} ${feature.delay} cursor-pointer group`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                      feature.color === "primary"
                        ? "bg-primary-500/20 text-primary-600"
                        : feature.color === "accent"
                          ? "bg-accent-500/20 text-accent-600"
                          : "bg-secondary-500/20 text-secondary-600"
                    } ${
                      activeFeature === index
                        ? "neon-glow animate-pulse-soft"
                        : ""
                    } group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-font-light text-xl group-hover:text-primary-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-font-secondary group-hover:text-font-light transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-font-light mb-6">
              Layanan <span className="gradient-text">Terpadu</span>
            </h2>
            <p className="text-xl text-font-secondary max-w-3xl mx-auto">
              Solusi finansial komprehensif dalam satu platform terintegrasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="glass-effect border-primary-500/20 card-hover"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <CardTitle className="text-font-light text-xl">
                    {service.title}
                  </CardTitle>
                  <p className="text-font-secondary">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-font-secondary"
                      >
                        <ChevronRight className="h-4 w-4 text-primary-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard">
                    <Button className="w-full mt-6 bg-primary-500 hover:bg-primary-700 text-white">
                      Mulai Sekarang
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-font-light mb-6">
              Mengapa <span className="gradient-text">Fintar</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`text-center animate-slide-in-up animate-delay-${
                  (index + 1) * 200
                }`}
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-font-light mb-3">
                  {benefit.title}
                </h3>
                <p className="text-font-secondary">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-font-light mb-6">
              Pertanyaan <span className="gradient-text">Umum</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="glass-effect border-primary-500/20 cursor-pointer transition-all duration-300 hover:border-primary-500/40"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-font-light">
                      {faq.question}
                    </h3>
                    <ChevronRight
                      className={`h-5 w-5 text-primary-600 transition-transform duration-300 ${
                        openFaq === index ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </CardHeader>
                {openFaq === index && (
                  <CardContent className="pt-0">
                    <p className="text-font-secondary">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section id="team" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-font-light mb-6">
              Tim <span className="gradient-text">Developer</span>
            </h2>
            <p className="text-xl text-font-secondary max-w-3xl mx-auto">
              Bertemu dengan tim ahli yang membangun platform keuangan digital
              terdepan di Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="glass-effect border-primary-500/20 card-hover relative text-center"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <Image
                      src={member.avatar}
                      alt={`${member.name} profile`}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover shadow-lg neon-glow ring-2 ring-primary-500/30 hover:ring-primary-500/60 transition-all duration-300"
                      onError={(e) => {
                        // Fallback to GitHub avatar if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `https://github.com/${member.githubUsername}.png?size=200`;
                      }}
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>

                  <CardTitle className="text-font-light text-xl mb-2">
                    {member.name}
                  </CardTitle>
                  <p className="text-orange-500 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-font-secondary mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-font-light font-medium mb-3">
                      Keahlian:
                    </h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          className="bg-primary-light/20 text-teal-light border-primary-light/30 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-font-secondary mb-6">
              Tim berpengalaman dengan dedikasi tinggi untuk menghadirkan solusi
              finansial terbaik
            </p>
            <div className="flex justify-center items-center space-x-8 text-font-muted">
              <span className="flex items-center">
                <Brain className="w-4 h-4 mr-2 text-orange-500" />
                5+ Years Experience
              </span>
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-teal-light" />
                Innovation Focused
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-primary-light" />
                Collaborative Team
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="glass-effect border-primary-500/30 neon-glow">
            <CardContent className="py-16">
              <h2 className="text-4xl md:text-5xl font-bold text-font-light mb-6">
                Siap Mengubah <span className="gradient-text">Masa Depan</span>{" "}
                Keuangan Anda?
              </h2>
              <p className="text-xl text-font-secondary mb-8 max-w-2xl mx-auto">
                Bergabung dengan ribuan pengguna yang telah merasakan
                transformasi keuangan dengan Fintar
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="btn-primary px-8 py-4 text-lg font-semibold"
                  >
                    <Banknote className="mr-3 h-5 w-5" />
                    Mulai Gratis Sekarang
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg border-primary-500 text-primary-600 hover:bg-primary-500/10"
                  >
                    <CreditCard className="mr-3 h-5 w-5" />
                    Sudah Punya Akun?
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary-500/20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold gradient-text">Fintar</span>
            </div>
            <p className="text-font-secondary mb-6">
              Revolusi keuangan digital Indonesia dengan teknologi AI terdepan
            </p>
            <div className="flex justify-center space-x-8 text-font-muted">
              <Link
                href="/privacy"
                className="hover:text-primary-600 transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary-600 transition-colors duration-300"
              >
                Terms
              </Link>
              <Link
                href="/support"
                className="hover:text-primary-600 transition-colors duration-300"
              >
                Support
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-primary-500/20">
              <p className="text-font-muted">
                © 2024 Fintar. All rights reserved. Made with ❤️ in Indonesia
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
