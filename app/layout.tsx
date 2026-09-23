import type { Metadata } from "next";
// 1. Import font dari Google
import { Poppins } from "next/font/google";
import "./globals.css"; // Pastikan file css global kamu tetap di-import

// 2. Konfigurasi font
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Pilih ketebalan yang dibutuhkan
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Aplikasi pencatat keuangan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* 3. Terapkan properti className dari font ke dalam body */}
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}