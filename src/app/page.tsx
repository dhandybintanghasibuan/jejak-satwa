"use client";

import React from "react";
import dynamic from "next/dynamic";

// Impor komponen statis
import TentangSection from "@/components/TentangSection";
import HeaderSection from "@/components/HeaderSection";
import AksiSection from "@/components/AksiSection";
import Footer from "@/components/FooterSection";

// Dynamic Imports untuk Komponen Berat (sudah sangat baik!)
const PetaSection = dynamic(() => import("@/components/PetaSection"), {
  ssr: false,
  loading: () => (
    <section className="flex items-center justify-center min-h-[500px] bg-gray-50 py-16">
      <p className="text-xl text-gray-600">Memuat Peta Interaktif...</p>
    </section>
  ),
});

const StatistikSection = dynamic(
  () => import("@/components/StatistikSection"),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center min-h-[400px] bg-gray-50 py-16">
        <p className="text-xl text-gray-600">Memuat Statistik...</p>
      </section>
    ),
  }
);

// --- Komponen Background Animasi ---
// Dipisah agar lebih rapi dan bisa digunakan kembali jika perlu
const AnimatedBackground = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none opacity-80">
    {/* Container untuk SVG */}
    <svg
      className="w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ objectFit: "cover" }}
    >
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="25%" stopColor="#059669" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#047857" stopOpacity="0.6" />
          <stop offset="75%" stopColor="#065f46" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#064e3b" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.3" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>
      {/* Path dan Circle SVG (kode tidak diubah) */}
      <path
        d="M5,8 Q25,12 30,25 T45,35 Q65,40 70,55 T85,75 Q95,85 92,95"
        fill="none"
        stroke="url(#flowGradient)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M2,5 Q20,8 28,20 T48,30 Q68,35 75,50 T88,70 Q98,80 95,92"
        fill="none"
        stroke="url(#flowGradient2)"
        strokeWidth="0.8"
        strokeLinecap="round"
        filter="url(#blur)"
      />
      <path
        d="M8,10 Q28,15 35,28 T50,38 Q70,43 77,58 T90,78 Q100,88 97,98"
        fill="none"
        stroke="url(#flowGradient2)"
        strokeWidth="0.6"
        strokeLinecap="round"
        filter="url(#blur)"
      />
      <path
        d="M15,15 Q20,18 25,22"
        fill="none"
        stroke="#10b981"
        strokeWidth="0.3"
        strokeOpacity="0.5"
      />
      <path
        d="M40,30 Q45,33 50,37"
        fill="none"
        stroke="#10b981"
        strokeWidth="0.3"
        strokeOpacity="0.5"
      />
      <path
        d="M65,50 Q70,53 75,57"
        fill="none"
        stroke="#10b981"
        strokeWidth="0.3"
        strokeOpacity="0.5"
      />
      <path
        d="M80,70 Q85,73 90,77"
        fill="none"
        stroke="#10b981"
        strokeWidth="0.3"
        strokeOpacity="0.5"
      />
      <circle cx="15" cy="18" r="0.8" fill="#10b981" opacity="0.6">
        <animate
          attributeName="r"
          values="0.8;1.2;0.8"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0.9;0.6"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="35" cy="30" r="0.8" fill="#059669" opacity="0.6">
        <animate
          attributeName="r"
          values="0.8;1.2;0.8"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0.9;0.6"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="55" cy="45" r="0.8" fill="#047857" opacity="0.6">
        <animate
          attributeName="r"
          values="0.8;1.2;0.8"
          dur="3.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0.9;0.6"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="75" cy="65" r="0.8" fill="#065f46" opacity="0.6">
        <animate
          attributeName="r"
          values="0.8;1.2;0.8"
          dur="4.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0.9;0.6"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="90" cy="85" r="0.8" fill="#064e3b" opacity="0.6">
        <animate
          attributeName="r"
          values="0.8;1.2;0.8"
          dur="3.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0.9;0.6"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    {/* Container untuk Partikel */}
    <div className="particle-flow-1"></div>
    <div className="particle-flow-2"></div>
    <div className="particle-flow-3"></div>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen font-sans relative overflow-x-hidden">
      <AnimatedBackground />

      {/* CSS untuk partikel tetap di sini karena terkait langsung dengan halaman ini */}
      <style jsx global>{`
        @keyframes flowParticle1 {
          0% {
            transform: translate(5vw, 8vh) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            transform: translate(92vw, 95vh) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes flowParticle2 {
          0% {
            transform: translate(2vw, 5vh) scale(0.5);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
            transform: scale(0.9);
          }
          85% {
            opacity: 0.8;
            transform: scale(0.9);
          }
          100% {
            transform: translate(95vw, 92vh) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes flowParticle3 {
          0% {
            transform: translate(8vw, 10vh) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
            transform: scale(0.7);
          }
          80% {
            opacity: 0.6;
            transform: scale(0.7);
          }
          100% {
            transform: translate(97vw, 98vh) scale(0.5);
            opacity: 0;
          }
        }
        .particle-flow-1 {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #10b981, transparent 60%);
          border-radius: 50%;
          animation: flowParticle1 15s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
          filter: blur(1px);
        }
        .particle-flow-2 {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #34d399, transparent 60%);
          border-radius: 50%;
          animation: flowParticle2 18s cubic-bezier(0.25, 0.1, 0.25, 1) infinite
            3s;
          filter: blur(1px);
        }
        .particle-flow-3 {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #6ee7b7, transparent 60%);
          border-radius: 50%;
          animation: flowParticle3 20s cubic-bezier(0.25, 0.1, 0.25, 1) infinite
            6s;
          filter: blur(1px);
        }
      `}</style>

      {/* Konten Utama Halaman */}
      {/* Wadah ini memastikan semua konten berada di atas background animasi */}
      <div className="relative z-[1]">
        {/* Header dibuat sticky dengan latar belakang semi-transparan */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/70">
          <HeaderSection />
        </header>

        {/* Section Konten dengan Latar Belakang Masing-Masing */}
        <section className="bg-white">
          <TentangSection />
        </section>

        {/* Peta tidak perlu bg, karena akan diisi oleh peta itu sendiri */}
        <section>
          <PetaSection />
        </section>

        <section className="bg-white">
          <StatistikSection />
        </section>

        <Footer />
      </div>
    </main>
  );
}
