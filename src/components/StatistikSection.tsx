"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Chart, { ChartOptions, TooltipItem, FontSpec } from "chart.js/auto";

// Fungsi helper untuk opsi chart dasar agar konsisten
const getBaseChartOptions = (
  axisTickColor = "#6b7280",
  gridLineColor = "#e5e7eb"
): ChartOptions<"bar"> => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: "easeInOutQuart",
  },
  plugins: {
    legend: {
      // AWAL OBJEK LEGEND
      display: true,
      position: "top",
      labels: {
        // AWAL OBJEK LABELS DI DALAM LEGEND
        color: "#4b5563",
        font: {
          size: 13,
        },
        padding: 20, // PADDING ADA DI SINI, INI BENAR
      }, // AKHIR OBJEK LABELS
      // TIDAK ADA padding: 20, LAGI DI SINI (langsung di bawah legend)
    }, // AKHIR OBJEK LEGEND
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      cornerRadius: 6,
      padding: 12, // Padding untuk tooltip, ini juga benar
      caretSize: 6,
      boxPadding: 4,
      callbacks: {
        label: function (context: TooltipItem<"bar">) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: axisTickColor,
        font: {
          size: 12,
          weight: 500,
        } as FontSpec,
        padding: 10,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: gridLineColor,
        lineWidth: 1,
        drawOnChartArea: true,
      },
      border: {
        display: false,
      },
      ticks: {
        color: axisTickColor,
        font: {
          size: 12,
        } as FontSpec,
        padding: 10,
      },
    },
  },
  layout: {
    padding: {
      top: 5,
    },
  },
});

// ... (Sisa kode komponen Anda tetap sama seperti yang Anda berikan) ...

export default function StatistikSection() {
  const satwaChartRef = useRef<HTMLCanvasElement | null>(null);
  const hutanChartRef = useRef<HTMLCanvasElement | null>(null);
  const satwaChartInstance = useRef<Chart | null>(null);
  const hutanChartInstance = useRef<Chart | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [satwaDisplayData, setSatwaDisplayData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);
  const [hutanDisplayData, setHutanDisplayData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);

  const [noSatwaData, setNoSatwaData] = useState(false);
  const [noHutanData, setNoHutanData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setNoSatwaData(false);
      setNoHutanData(false);
      setSatwaDisplayData(null);
      setHutanDisplayData(null);

      try {
        const satwaRes = await fetch("/data/satwa_cleaned.json");
        if (!satwaRes.ok)
          throw new Error(
            `Gagal mengambil data satwa (status: ${satwaRes.status})`
          );
        const rawSatwaData = await satwaRes.json();

        const satwaLabels: string[] = [];
        const satwaValues: number[] = [];
        if (Array.isArray(rawSatwaData)) {
          rawSatwaData.forEach((item: any) => {
            const nama = item["Satwa"];
            const jumlah = parseInt(item["Jumlah"] || "0");
            if (
              nama &&
              typeof nama === "string" &&
              nama.trim() !== "" &&
              !isNaN(jumlah) &&
              jumlah > 0
            ) {
              satwaLabels.push(nama);
              satwaValues.push(jumlah);
            }
          });
        } else {
          console.error("Data satwa bukan array.");
        }

        if (satwaLabels.length === 0) setNoSatwaData(true);
        else setSatwaDisplayData({ labels: satwaLabels, values: satwaValues });

        const hutanRes = await fetch("/data/hutan_cleaned.json");
        if (!hutanRes.ok)
          throw new Error(
            `Gagal mengambil data hutan (status: ${hutanRes.status})`
          );
        const rawHutanData = await hutanRes.json();

        const hutanLabels: string[] = [];
        const hutanValues: number[] = [];
        if (Array.isArray(rawHutanData)) {
          rawHutanData.forEach((item: any) => {
            const kabupaten = item["Kabupaten"];
            const luas = parseFloat(item["Tutupan Hutan 2024 (Ha)"] || "0");
            if (
              kabupaten &&
              typeof kabupaten === "string" &&
              kabupaten.trim() !== "" &&
              !isNaN(luas) &&
              luas > 0
            ) {
              hutanLabels.push(kabupaten);
              hutanValues.push(luas);
            }
          });
        } else {
          console.error("Data hutan bukan array.");
        }

        if (hutanLabels.length === 0) setNoHutanData(true);
        else setHutanDisplayData({ labels: hutanLabels, values: hutanValues });
      } catch (err: any) {
        console.error("StatistikSection: Error pengambilan data:", err);
        setError(err.message || "Terjadi kesalahan memuat data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      !error &&
      satwaDisplayData?.labels?.length &&
      satwaChartRef.current
    ) {
      const satwaCtx = satwaChartRef.current.getContext("2d");
      if (satwaCtx) {
        if (satwaChartInstance.current) satwaChartInstance.current.destroy();

        const options = getBaseChartOptions("#374151", "#e5e7eb");

        satwaChartInstance.current = new Chart(satwaCtx, {
          type: "bar",
          data: {
            labels: satwaDisplayData.labels,
            datasets: [
              {
                label: "Jumlah Satwa Dicuri",
                data: satwaDisplayData.values,
                backgroundColor: [
                  "#16a34a",
                  "#10b981",
                  "#6ee7b7",
                  "#a7f3d0",
                  "#d1fae5",
                ],
                borderColor: [
                  "#059669",
                  "#047857",
                  "#065f46",
                  "#064e3b",
                  "#022c22",
                ],
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 50,
                hoverBackgroundColor: "#065f46",
              },
            ],
          },
          options: options,
        });
      }
    } else {
      if (satwaChartInstance.current) {
        satwaChartInstance.current.destroy();
        satwaChartInstance.current = null;
      }
    }
    return () => {
      if (satwaChartInstance.current) {
        satwaChartInstance.current.destroy();
        satwaChartInstance.current = null;
      }
    };
  }, [satwaDisplayData, loading, error]);

  useEffect(() => {
    if (
      !loading &&
      !error &&
      hutanDisplayData?.labels?.length &&
      hutanChartRef.current
    ) {
      const hutanCtx = hutanChartRef.current.getContext("2d");
      if (hutanCtx) {
        if (hutanChartInstance.current) hutanChartInstance.current.destroy();

        const options = getBaseChartOptions("#1e3a8a", "#dbeafe");

        hutanChartInstance.current = new Chart(hutanCtx, {
          type: "bar",
          data: {
            labels: hutanDisplayData.labels,
            datasets: [
              {
                label: "Luas Tutupan Hutan 2024 (Ha)",
                data: hutanDisplayData.values,
                backgroundColor: [
                  "#2563eb",
                  "#3b82f6",
                  "#60a5fa",
                  "#93c5fd",
                  "#bfdbfe",
                ],
                borderColor: [
                  "#1d4ed8",
                  "#1e40af",
                  "#1e3a8a",
                  "#1c3d5d",
                  "#1e293b",
                ],
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 50,
                hoverBackgroundColor: "#1e3a8a",
              },
            ],
          },
          options: options,
        });
      }
    } else {
      if (hutanChartInstance.current) {
        hutanChartInstance.current.destroy();
        hutanChartInstance.current = null;
      }
    }
    return () => {
      if (hutanChartInstance.current) {
        hutanChartInstance.current.destroy();
        hutanChartInstance.current = null;
      }
    };
  }, [hutanDisplayData, loading, error]);

  // ... Sisa JSX Anda (return statement) ...
  return (
    <section
      id="statistik"
      className="relative min-h-screen pt-20 md:pt-24 scroll-mt-20 md:scroll-mt-24 bg-slate-50 text-gray-800 overflow-hidden border-t border-gray-200/80"
    >
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 md:w-96 md:h-96 bg-green-500/10 opacity-80 rounded-full blur-[100px] md:blur-[120px] z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-72 h-72 md:w-96 md:h-96 bg-blue-500/10 opacity-80 rounded-full blur-[100px] md:blur-[130px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-green-700">
            Statistik Sumber Daya Alam
          </h2>
          <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-md sm:text-lg text-gray-500">
            Data visual mengenai satwa dan tutupan hutan
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">Memuat data statistik...</p>
            <div className="mt-4 inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )}
        {error && (
          <div className="text-center py-16 bg-red-50 p-8 rounded-lg max-w-lg mx-auto shadow-md">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Gagal Memuat Data
            </h3>
            <p className="text-md text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 sm:p-8 flex flex-col"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-green-600 mb-6 text-center">
                Grafik Data Satwa
              </h3>
              <div className="flex-grow w-full h-[380px] sm:h-[420px] md:h-[450px] relative">
                {noSatwaData ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <svg
                      className="w-14 h-14 text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125z"
                      />{" "}
                    </svg>
                    <p>Tidak ada data satwa yang valid untuk ditampilkan.</p>
                  </div>
                ) : satwaDisplayData?.labels?.length ? (
                  <canvas ref={satwaChartRef} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <svg
                      className="w-14 h-14 text-gray-400 mb-3 animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />{" "}
                    </svg>
                    <p>Data satwa tidak tersedia.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 sm:p-8 flex flex-col"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-6 text-center">
                Grafik Data Hutan
              </h3>
              <div className="flex-grow w-full h-[380px] sm:h-[420px] md:h-[450px] relative">
                {noHutanData ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <svg
                      className="w-14 h-14 text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125z"
                      />{" "}
                    </svg>
                    <p>Tidak ada data hutan yang valid untuk ditampilkan.</p>
                  </div>
                ) : hutanDisplayData?.labels?.length ? (
                  <canvas ref={hutanChartRef} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <svg
                      className="w-14 h-14 text-gray-400 mb-3 animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />{" "}
                    </svg>
                    <p>Data hutan tidak tersedia.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
