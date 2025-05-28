"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeaderSection() {
  const segments = [
    { text: "Bersama", className: "text-green-700 font-bold" },
    { text: " Kita Bisa", className: "" },
    { text: "\nSelamatkan ", className: "font-bold" },
    { text: "Satwa", className: "text-green-700 font-bold" },
    { text: "\nLangka", className: "text-green-700 font-bold" },
  ];

  const fullText = segments.map((s) => s.text).join("");
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 90);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const renderColoredText = () => {
    let display = [];
    let currentIndex = 0;

    for (const segment of segments) {
      const segmentText = segment.text;
      const typedSegment = typedText.slice(
        currentIndex,
        currentIndex + segmentText.length
      );

      if (typedSegment) {
        display.push(
          <span key={currentIndex} className={segment.className}>
            {typedSegment}
          </span>
        );
      }

      currentIndex += segmentText.length;
    }

    return display;
  };

  return (
    <section className="relative min-h-screen flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-16 bg-white overflow-hidden border-b border-gray-200 z-10">
      {/* Corak dekoratif */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-green-100 rounded-full mix-blend-multiply blur-[120px] opacity-30 z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-green-200 rounded-full mix-blend-multiply blur-[100px] opacity-25 z-0"></div>
      <div className="absolute top-1/2 left-[-60px] w-72 h-72 bg-emerald-100 rounded-full blur-[90px] opacity-20 rotate-12 z-0"></div>
      <div className="absolute top-[30%] right-[-50px] w-64 h-64 bg-green-300 rounded-full blur-[80px] opacity-20 z-0"></div>

      {/* SVG dekoratif */}
      <div className="absolute top-24 left-6 w-32 h-32 opacity-20 z-5">
        <div className="ecosystem-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            className="w-full h-full"
          >
            <path
              d="M32 4C18 10 4 26 4 40c0 8 8 16 16 16s16-8 16-16c0-6 4-12 12-16 4-2 8-6 8-12C56 8 48 0 32 4z"
              fill="#22c55e"
            />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-20 right-20 w-24 h-24 opacity-20 rotate-45 z-5">
        <div className="ecosystem-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            className="w-full h-full"
          >
            <path
              d="M32 4C18 10 4 26 4 40c0 8 8 16 16 16s16-8 16-16c0-6 4-12 12-16 4-2 8-6 8-12C56 8 48 0 32 4z"
              fill="#16a34a"
            />
          </svg>
        </div>
      </div>

      {/* Teks animasi mengetik */}
      <div className="z-10 w-full md:w-1/2 text-center md:text-left mt-[-60px] md:mt-[-80px]">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 whitespace-pre-line text-gray-800">
          {renderColoredText()}
          {index < fullText.length && <span className="animate-pulse">|</span>}
        </h1>
        <p className="text-gray-700 mb-4 text-lg leading-relaxed">
          Di balik keindahan alam Indonesia, banyak spesies satwa langka kini
          berada di ambang kepunahan. Mereka menghadapi ancaman serius dari
          perdagangan ilegal, kerusakan habitat, dan eksploitasi manusia.
        </p>
        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
          Mari kita mulai perubahan hari ini. Satu langkah kecil Anda bisa
          menjadi penyelamat bagi keberlangsungan hidup mereka. Satwa bukan
          hanya warisan alam, tetapi penjaga ekosistem yang vital bagi bumi.
        </p>
        <a
          href="#tentang"
          className="inline-flex items-center gap-3 bg-green-600 text-white px-6 py-3 text-lg font-semibold rounded-full shadow-xl hover:bg-green-700 hover:shadow-2xl transition transform hover:scale-105"
        >
          🌿 Pelajari Lebih Lanjut
        </a>
      </div>

      {/* Gambar */}
      <div className="z-10 w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
        <div className="relative w-[480px] h-[480px] md:w-[520px] md:h-[520px]">
          <Image
            src="/images/satwagrafis.png"
            alt="Grafis Satwa"
            fill
            className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>
    </section>
  );
}
