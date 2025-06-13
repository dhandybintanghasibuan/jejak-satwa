import "@/app/globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/NavbarJejakSatwa"; // pastikan path sesuai

export const metadata: Metadata = {
  title: "Jejak Perlindungan Ekosistem dan Satwa Langka",
  description:
    "Mengungkap perdagangan ilegal satwa liar dan upaya perlindungan ekosistem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-white text-gray-800 font-sans">
        {/* Navbar tetap muncul di semua halaman */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
