'use client';

interface SummaryData {
  saldo: number;
  totalMasuk: number;
  totalKeluar: number;
}

export default function DashboardSummaryCards({ data, isLoading }: { data: SummaryData | null, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex gap-4 p-4 text-gray-500">
        <p>Memuat ringkasan dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 border rounded shadow-sm bg-white">
        <h3 className="text-sm text-gray-500">Total Saldo</h3>
        <p className="text-2xl font-bold text-gray-800">Rp {data.saldo.toLocaleString('id-ID')}</p>
      </div>
      <div className="p-4 border rounded shadow-sm bg-white border-l-4 border-l-green-500">
        <h3 className="text-sm text-gray-500">Pemasukan</h3>
        <p className="text-2xl font-bold text-green-600">Rp {data.totalMasuk.toLocaleString('id-ID')}</p>
      </div>
      <div className="p-4 border rounded shadow-sm bg-white border-l-4 border-l-red-500">
        <h3 className="text-sm text-gray-500">Pengeluaran</h3>
        <p className="text-2xl font-bold text-red-600">Rp {data.totalKeluar.toLocaleString('id-ID')}</p>
      </div>
    </div>
  );
}