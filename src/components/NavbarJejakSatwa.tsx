"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- Komponen Ikon (dipisah agar lebih rapi) ---
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const IconHamburger = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efek untuk deteksi scroll (sudah bagus!)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // [PERBAIKAN 1] Efek untuk mengunci scroll body saat menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup function jika komponen di-unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { href: "/#tentang", label: "Tentang" },
    { href: "/#peta-interaktif", label: "Peta Interaktif" },
    { href: "/#statistik", label: "Statistik" },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg py-3"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo & Title */}
        <Link
          href="/"
          className="flex items-center space-x-3 group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image
            src="/images/logojejaksatwa.png" // Pastikan path logo benar
            alt="Logo Jejak Satwa"
            width={isScrolled ? 45 : 60}
            height={isScrolled ? 45 : 60}
            className="rounded-full transition-all duration-300 ease-in-out"
            priority
          />
          <span
            className={`text-lg md:text-xl font-extrabold tracking-tight transition-colors duration-300 ${
              isScrolled ? "text-green-700" : "text-green-600"
            } group-hover:text-green-800`}
          >
            Jejak Satwa
          </span>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center space-x-7">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative group text-sm font-medium text-gray-600 hover:text-green-700 transition-colors duration-200 pb-1"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Tombol Menu Mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen} // [PERBAIKAN 2] Atribut aksesibilitas
            className="p-2 rounded-md text-gray-600 hover:text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
          >
            {isMobileMenuOpen ? <IconClose /> : <IconHamburger />}{" "}
            {/* [PERBAIKAN 3] Menggunakan komponen ikon */}
          </button>
        </div>
      </div>
    </header>
  );
}
