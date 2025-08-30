"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Sparkles,
  Shield,
  TrendingUp,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Produk",
      links: [
        { label: "AI Co-Pilot", href: "/chat" },
        { label: "Budget Tracker", href: "/dashboard/budget" },
        { label: "Financial Analysis", href: "/financial-analysis" },
        { label: "Investment Planning", href: "/investment-ai" },
      ],
    },
    {
      title: "Layanan",
      links: [
        { label: "Konsultan Ahli", href: "/consultants" },
        { label: "Edukasi Keuangan", href: "/education" },
        { label: "Market Monitoring", href: "/market-monitoring" },
        { label: "Booking Konsultasi", href: "/bookings" },
      ],
    },
    {
      title: "Perusahaan",
      links: [
        { label: "Tentang Kami", href: "/about" },
        { label: "Karir", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press Kit", href: "/press" },
      ],
    },
    {
      title: "Dukungan",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Hubungi Kami", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/fintar", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/fintar", label: "Facebook" },
    {
      icon: Instagram,
      href: "https://instagram.com/fintar",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/fintar",
      label: "LinkedIn",
    },
  ];

  const features = [
    { icon: Shield, text: "Bank-level Security" },
    { icon: Sparkles, text: "AI-Powered Insights" },
    { icon: TrendingUp, text: "Real-time Analytics" },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#1C1F2B] via-[#2A2E3B] to-[#383C4B] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/Fintarlogo.png"
                  alt="Fintar Logo"
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="text-gray-300 mb-6 max-w-sm">
              Platform AI Financial Empowerment untuk membantu individu dan UMKM
              mengelola keuangan, meningkatkan literasi keuangan, dan konsultasi
              bertenaga AI.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm text-gray-300"
                >
                  <feature.icon className="h-4 w-4 text-[#EE9B00]" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#EE9B00]" />
                <span>fintargemastik@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#EE9B00]" />
                <span>+6285271207118</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#EE9B00]" />
                <span>Padang, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-[#EE9B00] transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} Fintar. All rights reserved. Made with ❤️ in
              Indonesia.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#EE9B00] transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-[#EE9B00] transition-colors"
              >
                Privacy
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="hover:text-[#EE9B00] transition-colors"
              >
                Terms
              </Link>
              <span>•</span>
              <Link
                href="/cookies"
                className="hover:text-[#EE9B00] transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
