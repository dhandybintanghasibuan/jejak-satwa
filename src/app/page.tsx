"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TentangSection from "@/components/TentangSection";
import HeaderSection from "@/components/HeaderSection";
import PetaSection from "@/components/PetaSection";
import StatistikSection from "@/components/StatistikSection";
import AksiSection from "@/components/AksiSection";
import Footer from "@/components/FooterSection";

// Perbaikan ikon default Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function Home() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ["2019", "2020", "2021", "2022", "2023"],
          datasets: [
            {
              label: "Kasus Perdagangan Satwa",
              data: [23, 30, 45, 50, 70],
              backgroundColor: "rgba(22, 163, 74, 0.7)",
              borderColor: "#16a34a",
              borderWidth: 2,
              borderRadius: 5,
              hoverBackgroundColor: "#15803d",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "rgba(255,255,255,0.1)" },
              ticks: { color: "#e5e7eb" },
            },
            x: {
              grid: { display: false },
              ticks: { color: "#e5e7eb" },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#e5e7eb",
                font: { size: 14 },
              },
            },
          },
        },
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <main className="min-h-screen font-sans bg-white text-gray-800 relative overflow-hidden">
      {/* Grafik Garis Melengkung Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ height: "600vh" }}
        >
          <defs>
            {/* Gradient untuk garis utama */}
            <linearGradient
              id="flowGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="25%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#047857" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#065f46" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.6" />
            </linearGradient>

            {/* Gradient untuk garis pendukung */}
            <linearGradient
              id="flowGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.3" />
            </linearGradient>

            {/* Filter untuk efek blur */}
            <filter id="blur">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>

          {/* Garis Utama - Alur Sungai */}
          <path
            d="M5,8 Q25,12 30,25 T45,35 Q65,40 70,55 T85,75 Q95,85 92,95"
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Garis Pendukung 1 */}
          <path
            d="M2,5 Q20,8 28,20 T48,30 Q68,35 75,50 T88,70 Q98,80 95,92"
            fill="none"
            stroke="url(#flowGradient2)"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.6"
            filter="url(#blur)"
          />

          {/* Garis Pendukung 2 */}
          <path
            d="M8,10 Q28,15 35,28 T50,38 Q70,43 77,58 T90,78 Q100,88 97,98"
            fill="none"
            stroke="url(#flowGradient2)"
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity="0.4"
            filter="url(#blur)"
          />

          {/* Cabang-cabang kecil */}
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

          {/* Titik-titik ecosystem nodes */}
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
      </div>

      {/* Partikel mengalir */}
      <div className="fixed inset-0 pointer-events-none z-1">
        <div className="particle-flow-1"></div>
        <div className="particle-flow-2"></div>
        <div className="particle-flow-3"></div>
      </div>

      <style jsx>{`
        @keyframes flowParticle1 {
          0% {
            transform: translate(5vw, 8vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(92vw, 95vh);
            opacity: 0;
          }
        }

        @keyframes flowParticle2 {
          0% {
            transform: translate(2vw, 5vh);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translate(95vw, 92vh);
            opacity: 0;
          }
        }

        @keyframes flowParticle3 {
          0% {
            transform: translate(8vw, 10vh);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translate(97vw, 98vh);
            opacity: 0;
          }
        }

        .particle-flow-1 {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #10b981, transparent);
          border-radius: 50%;
          animation: flowParticle1 15s linear infinite;
        }

        .particle-flow-2 {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #34d399, transparent);
          border-radius: 50%;
          animation: flowParticle2 18s linear infinite 3s;
        }

        .particle-flow-3 {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #6ee7b7, transparent);
          border-radius: 50%;
          animation: flowParticle3 20s linear infinite 6s;
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-gray-200 relative z-10">
        <HeaderSection />
      </div>

      {/* Tentang */}
      <div className="border-b border-gray-200 relative z-10">
        <TentangSection />
      </div>

      {/* Peta */}
      <div className="border-b border-gray-200 relative z-10">
        <PetaSection />
      </div>

      {/* Statistik */}
      <div className="border-b border-gray-200 relative z-10">
        <StatistikSection />
      </div>

      {/* Aksi */}
      <div className="border-b border-gray-200 relative z-10">
        <AksiSection />
      </div>
      {/* Footer */}
      <div className="border-b border-gray-200 relative z-10">
        <Footer/>
      </div>
    </main>
  );
}
