"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const AuthNavbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Fintarlogo.png"
              alt="Fintar Logo"
              width={100}
              height={70}
              className="object-contain"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Profil
            </Link>
            <Link
              href="/help"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Bantuan
            </Link>
          </div>

          {/* Auth Buttons - Show different buttons based on current page */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AuthNavbar;
