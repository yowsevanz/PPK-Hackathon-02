import { mockTransactions } from "@/lib/mockData";

// Helper untuk format Rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

export default function DashboardPage() {
  // 1. Logika Agregasi (Nantinya diganti dengan SQL SUM Query)
  const totalPemasukan = mockTransactions
    .filter((t) => t.jenis === "pemasukan")
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalPengeluaran = mockTransactions
    .filter((t) => t.jenis === "pengeluaran")
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const saldoSaatIni = totalPemasukan - totalPengeluaran;

  // 2. Ambil 5 transaksi terbaru (Di SQL: ORDER BY tanggal DESC LIMIT 5)
  // Karena mock data terurut dari tanggal terlama, kita reverse lalu ambil 5
  const transaksiTerbaru = [...mockTransactions].reverse().slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Ringkasan kondisi keuanganmu saat ini.</p>
      </div>

      {/* Grid Card Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Saldo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Saldo Saat Ini</p>
          <p className="text-2xl font-bold text-gray-900">{formatRupiah(saldoSaatIni)}</p>
        </div>

        {/* Card Pemasukan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Pemasukan</p>
          <p className="text-2xl font-bold text-emerald-600">+{formatRupiah(totalPemasukan)}</p>
        </div>

        {/* Card Pengeluaran */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-rose-600">-{formatRupiah(totalPengeluaran)}</p>
        </div>
      </div>

      {/* Tabel Transaksi Terbaru */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Transaksi Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Keterangan</th>
                <th className="px-6 py-4 font-medium">Jenis</th>
                <th className="px-6 py-4 font-medium text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transaksiTerbaru.map((trx) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}