"use client";

import Image from "next/image";
import Link from "next/link";

// Contoh ikon SVG sederhana untuk sosial media (Anda bisa menggunakan library ikon seperti Heroicons)
const FacebookIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.315 2.014a.828.828 0 01.57 0C15.299 2.287 16.686 3.09 17.68 4.053c.996.962 1.766 2.37 2.024 4.734.04.38.04.76.04 3.213s0 2.833-.04 3.213c-.258 2.364-1.028 3.772-2.024 4.734-.994.963-2.381 1.766-4.785 2.024a.83.83 0 01-.57 0c-2.403-.258-3.79-.966-4.784-2.024-.997-.962-1.767-2.37-2.025-4.734a.884.884 0 01-.04-3.213s0-2.833.04-3.213c.258-2.364 1.028-3.772 2.025-4.734.994-.963 2.381-1.766 4.785-2.024zM12 6.873a5.127 5.127 0 100 10.254 5.127 5.127 0 000-10.254zm0 8.451a3.324 3.324 0 110-6.648 3.324 3.324 0 010 6.648zm5.505-7.834a1.25 1.25 0 100-2.498 1.25 1.25 0 000 2.498z"
      clipRule="evenodd"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t-2 border-green-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Kolom 1: Brand dan Tagline */}
          <div className="mb-6 md:mb-0 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/logojejaksatwa.png" // Sesuaikan path logo Anda
                alt="Logo Jejak Satwa"
                width={60}
                height={60}
                className="rounded-full"
              />
              <span className="text-2xl font-extrabold text-white">
                Jejak Satwa
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Melindungi keanekaragaman hayati Indonesia, satu jejak pada satu
              waktu. Bersama kita lestarikan warisan alam untuk generasi
              mendatang.
            </p>
          </div>

          {/* Kolom 2: Link Jelajahi */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-5 tracking-wider">
              Jelajahi
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#tentang"
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/#peta"
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  Peta Sebaran
                </Link>
              </li>
              <li>
                <Link
                  href="/#statistik"
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  Statistik
                </Link>
              </li>
              <li>
                <Link
                  href="/#aksi"
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  Dukung Aksi
                </Link>
              </li>
              {/* Tambahkan link lain jika ada, misal Blog atau Galeri */}
            </ul>
          </div>

          {/* Kolom 3: Link Informasi & Kontak */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-5 tracking-wider">
              Informasi
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Ikuti Kami & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-5 tracking-wider">
              Tetap Terhubung
            </h3>
            <div className="flex space-x-5 mb-6">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-300 transition-colors duration-300"
                aria-label="Facebook Jejak Satwa"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-300 transition-colors duration-300"
                aria-label="Instagram Jejak Satwa"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-300 transition-colors duration-300"
                aria-label="Twitter Jejak Satwa"
              >
                <TwitterIcon />
              </a>
              {/* Tambahkan ikon sosial media lainnya jika ada */}
            </div>
            <h4 className="text-md font-semibold text-white mb-2">
              Dapatkan Kabar Terbaru
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Langganan untuk berita, artikel, dan info konservasi.
            </p>
            <form
              action="#"
              method="POST"
              className="flex flex-col sm:flex-row gap-2"
            >
              <label htmlFor="email-newsletter" className="sr-only">
                Alamat Email
              </label>
              <input
                type="email"
                name="email-newsletter"
                id="email-newsletter"
                autoComplete="email"
                placeholder="Email Anda"
                className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 border border-gray-700 text-sm placeholder-gray-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-950"
              >
                Langganan
              </button>
            </form>
          </div>
        </div>

        {/* Bagian Hak Cipta */}
        <div className="mt-16 pt-10 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Jejak Satwa Indonesia. Semua Hak
            Cipta Dilindungi.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Dibuat dengan semangat konservasi oleh{" "}
            <Link href="#" className="hover:text-green-400 underline">
              Tim Wawasan Hijau
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
