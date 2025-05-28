"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // Impor untuk animasi menu mobile

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk menu mobile

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    // Panggil handleScroll sekali saat mount untuk set state awal jika halaman sudah di-scroll
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: "/#tentang", label: "Tentang" }, // Ganti 'Explore' jika lebih sesuai
    { href: "/#peta-interaktif", label: "Peta Interaktif" }, // Updated href and label
    { href: "/#statistik", label: "Statistik" },
    { href: "/#aksi", label: "Aksi" },
  ];

  // Varian animasi untuk menu mobile
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
          ? "bg-white/90 backdrop-blur-lg shadow-lg py-3" // Efek lebih modern saat scroll
          : "bg-white py-4" // Sedikit lebih tinggi saat tidak di-scroll
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
            width={isScrolled ? 45 : 60} // Ukuran disesuaikan
            height={isScrolled ? 45 : 60}
            className="rounded-full transition-all duration-300 ease-in-out"
            priority // Prioritaskan pemuatan logo
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
            className="p-2 rounded-md text-gray-600 hover:text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
          >
            {isMobileMenuOpen ? (
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
            ) : (
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
            )}
          </button>
        </div>
      </div>

      {/* Kontainer Menu Mobile dengan Animasi */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100"
          >
            <nav className="flex flex-col space-y-1 px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.label}`}
                  href={item.href}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  onClick={toggleMobileMenu} // Tutup menu setelah link diklik
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
