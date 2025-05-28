"use client";

import { FaLeaf, FaGlobeAsia, FaPaw } from "react-icons/fa";
import { motion } from "framer-motion";

export default function TentangSection() {
  return (
    <section
      id="tentang"
      className="relative min-h-screen flex items-center bg-white text-gray-800 overflow-hidden border-t border-gray-200"
    >
      {/* Corak Blur Tersebar */}
      <div className="absolute top-[-120px] left-[-80px] w-96 h-96 bg-green-100 rounded-full mix-blend-multiply blur-[120px] opacity-30 z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-green-200 rounded-full mix-blend-multiply blur-[100px] opacity-25 z-0"></div>
      <div className="absolute top-[50%] left-[20%] w-60 h-60 bg-emerald-100 rounded-full blur-[90px] opacity-20 rotate-45 z-0"></div>
      <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-green-300 rounded-full blur-[100px] opacity-20 z-0"></div>
      <div className="absolute bottom-[10%] left-[15%] w-48 h-48 bg-green-100 rounded-full blur-[80px] opacity-25 z-0"></div>


      {/* Konten */}
      <div className="z-10 max-w-6xl mx-auto w-full px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center py-20">
        {/* Teks */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-green-700">
            Mengapa Satwa Langka Penting?
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-4">
            Satwa langka memiliki peran esensial dalam menjaga keseimbangan
            ekosistem dan biodiversitas. Kehadiran mereka menunjang siklus alam,
            mulai dari penyerbukan, penyebaran benih, hingga kontrol populasi
            spesies lain.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            Tanpa upaya konservasi, kita akan kehilangan bagian penting dari
            kehidupan di bumi. Perlindungan satwa langka bukan hanya soal alam,
            tapi soal masa depan manusia.
          </p>

          {/* Statistik */}
          <div className="mt-10 grid grid-cols-2 gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-3xl font-bold text-green-700">400+</p>
              <p className="text-sm font-medium text-gray-600">
                Satwa Terancam Punah
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-3xl font-bold text-green-700">100+</p>
              <p className="text-sm font-medium text-gray-600">
                Spesies Endemik Indonesia
              </p>
            </motion.div>
          </div>
        </div>

        {/* Card Informasi */}
        <div className="flex flex-col gap-6">
          {[
            {
              icon: <FaPaw className="text-green-800 text-xl" />,
              bg: "bg-yellow-200",
              title: "Pelestarian Spesies",
              desc: "Menjaga keberlangsungan hidup satwa dari ancaman kepunahan.",
            },
            {
              icon: <FaGlobeAsia className="text-green-900 text-xl" />,
              bg: "bg-green-300",
              title: "Keseimbangan Ekosistem",
              desc: "Spesies langka berperan dalam menjaga harmoni lingkungan.",
            },
            {
              icon: <FaLeaf className="text-green-800 text-xl" />,
              bg: "bg-red-200",
              title: "Konservasi Alam",
              desc: "Upaya bersama menjaga warisan hayati untuk masa depan.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`flex items-center gap-4 bg-white shadow-md rounded-xl px-6 py-4 border border-green-100 hover:scale-105 hover:shadow-lg transition-transform duration-300`}
            >
              <div className={`${item.bg} p-3 rounded-full`}>{item.icon}</div>
              <div>
                <h4 className="font-bold text-lg text-green-800">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
