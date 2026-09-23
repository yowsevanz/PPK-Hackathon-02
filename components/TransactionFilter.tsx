"use client";

import { useRouter } from "next/navigation";

export default function TransactionFilter({ activeFilter }: { activeFilter: string }) {
  const router = useRouter();

  const handleFilterChange = (newFilter: string) => {
    // 1. Simpan preferensi ke Cookie (berlaku 1 tahun / 31536000 detik)
    document.cookie = `transaction_filter=${newFilter}; path=/; max-age=31536000`;
    
    // 2. Beritahu Next.js untuk me-render ulang Server Component dengan cookie baru
    router.refresh();
  };

  const filters = [
    { id: "semua", label: "Semua Transaksi" },
    { id: "pemasukan", label: "Pemasukan" },
    { id: "pengeluaran", label: "Pengeluaran" },
  ];

  return (
    <div className="inline-flex bg-gray-100 p-1 rounded-lg">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}