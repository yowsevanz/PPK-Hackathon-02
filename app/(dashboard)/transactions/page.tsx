import { cookies } from "next/headers";
import { mockTransactions } from "@/lib/mockData";
import TransactionFilter from "@/components/TransactionFilter";

// Helper untuk format Rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

export default async function TransactionsPage() {
  // 1. Baca preferensi filter dari Cookies (default: 'semua')
  const cookieStore = await cookies();
  const activeFilter = cookieStore.get("transaction_filter")?.value || "semua";

  // 2. Filter data berdasarkan cookie (Nantinya P2 akan mengubah ini menjadi klausa SQL WHERE)
  const filteredTransactions = mockTransactions.filter((trx) => {
    if (activeFilter === "semua") return true;
    return trx.jenis === activeFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daftar Transaksi</h1>
          <p className="mt-2 text-gray-600">Kelola semua pemasukan dan pengeluaranmu.</p>
        </div>
        
        {/* Panggil komponen Client Component dan passing filter saat ini */}
        <TransactionFilter activeFilter={activeFilter} />
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Keterangan</th>
                <th className="px-6 py-4 font-medium">Jenis</th>
                <th className="px-6 py-4 font-medium text-right">Nominal</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada transaksi ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(trx.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {trx.keterangan}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          trx.jenis === "pemasukan"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {trx.jenis.charAt(0).toUpperCase() + trx.jenis.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right ${
                      trx.jenis === "pemasukan" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {trx.jenis === "pemasukan" ? "+" : "-"}{formatRupiah(trx.nominal)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                       {/* Tombol statis, fungsionalitas aslinya (Ubah/Hapus) akan dikerjakan Programmer 2 */}
                      <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}