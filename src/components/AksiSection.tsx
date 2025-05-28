"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function AksiSection() {
  return (
    <section
      id="aksi"
      className="relative min-h-screen pt-24 scroll-mt-24 bg-white text-gray-800 overflow-hidden border-t border-gray-200"
    >
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-green-100 opacity-30 rounded-full blur-[120px] top-[-80px] left-[-80px] z-0" />
      <div className="absolute w-[300px] h-[300px] bg-yellow-100 opacity-20 rounded-full blur-[100px] bottom-[-60px] right-[-80px] z-0" />

      {/* Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Ambil <span className="text-green-600">Peran</span> dalam <br />
            Melindungi <span className="text-yellow-500">Satwa</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            Bersama kita bisa hentikan{" "}
            <span className="font-semibold underline decoration-green-400">
              perdagangan ilegal
            </span>{" "}
            dan jaga ekosistem Indonesia untuk generasi mendatang.
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold rounded-full shadow-lg transition"
          >
            <ShieldCheck size={20} />
            Dukung Sekarang
            <ArrowRight size={16} />
          </motion.button>

          {/* Partnership Logo */}
          <div className="mt-10 flex items-center gap-2">
            <span className="text-sm text-gray-500">Bekerja Sama dengan : </span>
            <img
              src="/images/kitabisa.png/"
              alt="Kitabisa Logo"
              className="h-50"
            />
          </div>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <img
            src="/illustrations/save-wildlife.svg"
            alt="Ilustrasi Perlindungan Satwa"
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}