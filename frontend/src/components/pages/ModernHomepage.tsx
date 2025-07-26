"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Shield,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  BarChart3,
  Wallet,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";

export function ModernHomepage() {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "AI Financial Analysis",
      description:
        "Analisis keuangan berbasis AI yang memberikan insight mendalam tentang kondisi finansial Anda.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Expert Consultants",
      description:
        "Konsultasi dengan ahli keuangan berpengalaman untuk strategi investasi yang tepat.",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Secure Platform",
      description:
        "Platform aman dengan enkripsi tingkat bank untuk melindungi data keuangan Anda.",
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: "Goal Planning",
      description:
        "Perencanaan tujuan keuangan yang terstruktur dan dapat dilacak progresnya.",
    },
  ];

  const stats = [
    {
      label: "Active Users",
      value: "10,000+",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Expert Consultants",
      value: "50+",
      icon: <Star className="h-5 w-5" />,
    },
    {
      label: "Total Investments",
      value: "$2M+",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Success Rate",
      value: "95%",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Fintar</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Wallet className="h-4 w-4 mr-2" />
              AI-Powered Financial Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Financial
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Freedom{" "}
              </span>
              Starts Here
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Platform pemberdayaan finansial berbasis AI yang membantu Anda
              mengelola keuangan, meningkatkan literasi finansial, dan mencapai
              kebebasan finansial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/consultants">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Find Consultants
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features for Your Financial Success
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the tools and services designed to accelerate your journey
            to financial freedom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <PiggyBank className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already building wealth with our
            AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-3 bg-[#FFB800] hover:bg-[#F5A623] text-[#0A1628] font-semibold shadow-lg"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-blue-600 backdrop-blur-sm font-semibold shadow-lg"
              >
                View Dashboard Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Fintar</h3>
            <p className="text-gray-400 mb-6">
              Empowering financial freedom through AI-driven solutions.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2025 Fintar. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
