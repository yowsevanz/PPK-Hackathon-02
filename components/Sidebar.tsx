"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "" },
    { name: "Transaksi", path: "/transactions", icon: "" },
  ];

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-gray-900 border-r rtl:border-r-0 rtl:border-l border-gray-700">
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

        {/* Placeholder untuk Programmer 1 (Logout) */}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 transition-colors rounded-lg hover:bg-gray-800 hover:text-red-300">
            <span className="text-lg mr-3"></span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}