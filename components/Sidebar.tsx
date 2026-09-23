"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/app/actions/authActions";

export default function Sidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "" },
    { name: "Transaksi", path: "/transactions", icon: "" },
  ];

  const handleConfirmLogout = async () => {
    await logoutUser();
  };

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-gray-900 border-r rtl:border-r-0 rtl:border-l border-gray-700 relative">
      <div className="flex items-center mb-8 px-2">
        <h2 className="text-2xl font-bold text-white">ExpenseTracker</h2>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout */}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)} // Membuka modal web saat diklik
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 transition-colors rounded-lg hover:bg-gray-800 hover:text-red-300"
          >
            <span className="text-lg mr-3"></span>
            Logout
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl border border-gray-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-gray-900">Konfirmasi Keluar</h3>
            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin keluar dari aplikasi?
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)} // Tombol Batal: menutup modal
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout} // Tombol Ya: menjalankan logout session
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}