"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Chart from "chart.js/auto";

export default function StatistikSection() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKmlAndRenderChart = async () => {
      try {
        const res = await fetch("/data/TITIK KOORDINAT SATWA.kml");
        const text = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");

        const placemarks = Array.from(xmlDoc.getElementsByTagName("Placemark"));
        console.log("Placemarks ditemukan:", placemarks.length);

        const categoryCounts: Record<string, number> = {
          Mamalia: 0,
          Burung: 0,
          Reptil: 0,
          Lainnya: 0,
        };

        placemarks.forEach((placemark) => {
          const descriptionEl =
            placemark.getElementsByTagName("description")[0];
          if (descriptionEl) {
            const desc = descriptionEl.textContent?.toLowerCase() || "";
            if (desc.includes("mamalia")) categoryCounts.Mamalia += 1;
            else if (desc.includes("burung")) categoryCounts.Burung += 1;
            else if (desc.includes("reptil")) categoryCounts.Reptil += 1;
            else categoryCounts.Lainnya += 1;
          }
        });

        console.log("Hasil kategori:", categoryCounts);

        const ctx = chartRef.current?.getContext("2d");
        if (ctx && !chartInstance.current) {
          chartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: Object.keys(categoryCounts),
              datasets: [
                {
                  label: "Jumlah Kasus",
                  data: Object.values(categoryCounts),
                  backgroundColor: ["#16a34a", "#10b981", "#6ee7b7", "#d1fae5"],
                  borderRadius: 6,
                  barThickness: 50,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: "#1f2937",
                  titleColor: "#ffffff",
                  bodyColor: "#d1d5db",
                  borderWidth: 1,
                  borderColor: "#10b981",
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#374151",
                    font: {
                      weight: "bold",
                    },
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "#4b5563",
                  },
                  grid: {
                    color: "#e5e7eb",
                  },
                },
              },
            },
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat dan memproses file KML:", err);
      }
    };

    fetchKmlAndRenderChart();

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, []);

  return (
    <section
      id="statistik"
      className="relative min-h-screen pt-24 scroll-mt-24 bg-white text-gray-800 overflow-hidden border-t border-gray-200"
    >
      {/* Background blur */}
      <div className="absolute top-[-60px] left-[-60px] w-96 h-96 bg-green-200 opacity-20 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-green-100 opacity-20 rounded-full blur-[120px] z-0" />

      <div className="z-10 max-w-5xl mx-auto w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold text-green-700">
            Statistik Perdagangan Ilegal
          </h2>
          <p className="text-sm text-gray-500 italic mt-2">
            * Berdasarkan data pelacakan konservasi satwa langka (KML)
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          {loading ? (
            <p className="text-center text-gray-500">Memuat grafik...</p>
          ) : (
            <canvas ref={chartRef} className="w-full h-[400px]" />
          )}
        </motion.div>
      </div>
    </section>
  );
}
