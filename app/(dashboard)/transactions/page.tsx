import Link from "next/link";
import { cookies } from "next/headers";
import { createTransaction, deleteTransaction, updateTransaction } from "@/lib/actions/transactionActions";
import { getTransactionUserId } from "@/lib/transactions";
import { pool } from "@/lib/db";
import TransactionFilter from "@/components/TransactionFilter";

export const dynamic = "force-dynamic";

type TransactionRow = {
  id: number;
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: Date;
};

// Helper format rupiah dari kodemu
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

function dateForInput(date: Date) {
  const normalized = date instanceof Date ? date : new Date(date);
  return new Date(normalized.getTime() - normalized.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
}

export default async function TransactionsPage() {
  // 1. Ambil data dari database (Logika temanmu)
  const userId = await getTransactionUserId();
  const result = await pool.query<TransactionRow>(
    `SELECT "id", "jenis", "nominal", "keterangan", "tanggal"
     FROM "Transaction"
     WHERE "userId" = $1
     ORDER BY "tanggal" DESC, "id" DESC`,
    [userId],
  );

  const allTransactions = result.rows;

  // 2. Baca preferensi filter dari Cookies (Logika-mu)
  const cookieStore = await cookies();
  const activeFilter = cookieStore.get("transaction_filter")?.value || "semua";

  // 3. Filter data berdasarkan cookie
  const filteredTransactions = allTransactions.filter((trx) => {
    if (activeFilter === "semua") return true;
    return trx.jenis === activeFilter;
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 space-y-6">
      {/* Header & Filter (UI milikmu + Link kembali temanmu) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daftar Transaksi</h1>
          <p className="mt-2 text-gray-600">Kelola semua pemasukan dan pengeluaranmu.</p>
          <Link className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline mt-3 inline-block" href="/">
            &larr; Kembali ke beranda
          </Link>
        </div>
        
        <TransactionFilter activeFilter={activeFilter} />
      </div>

      {/* Form Tambah Transaksi (UI milikmu + Action temanmu) */}
      <section className="mb-8 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950">Tambah transaksi</h2>
          <p className="mt-1 text-sm text-slate-600">Isi detail transaksi yang ingin dicatat.</p>
        </div>
        <form action={createTransaction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Jenis
            <select className="h-11 rounded-xl border border-slate-200 bg-white px-3 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" name="jenis" required defaultValue="pengeluaran">
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Nominal (Rp)
            <input className="h-11 rounded-xl border border-slate-200 px-3 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" name="nominal" type="number" min="1" step="1" placeholder="150000" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Tanggal
            <input className="h-11 rounded-xl border border-slate-200 px-3 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" name="tanggal" type="date" required defaultValue={dateForInput(new Date())} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-1">
            Keterangan
            <input className="h-11 rounded-xl border border-slate-200 px-3 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" name="keterangan" type="text" placeholder="Contoh: Makan siang" required />
          </label>
          <div className="md:col-span-2 xl:col-span-4">
            <button className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800" type="submit">
              Simpan transaksi
            </button>
          </div>
        </form>
      </section>

      {/* Tabel Transaksi (UI Tabel milikmu dengan input inline agar CRUD bekerja) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-40">Tanggal</th>
                <th className="px-6 py-4 font-medium">Keterangan</th>
                <th className="px-6 py-4 font-medium w-36">Jenis</th>
                <th className="px-6 py-4 font-medium text-right w-48">Nominal</th>
                <th className="px-6 py-4 font-medium text-center w-40">Aksi</th>
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
                  <tr key={trx.id} className="hover:bg-gray-50 transition-colors group">
                    {/* Tanggal */}
                    <td className="px-6 py-4 text-sm">
                      <input 
                        form={`update-${trx.id}`} 
                        name="tanggal" 
                        type="date" 
                        defaultValue={dateForInput(trx.tanggal)} 
                        className="bg-transparent border-0 p-1 w-full text-gray-600 focus:ring-1 focus:ring-emerald-500 rounded" 
                        required 
                      />
                    </td>
                    {/* Keterangan */}
                    <td className="px-6 py-4 text-sm font-medium">
                      <input 
                        form={`update-${trx.id}`} 
                        name="keterangan" 
                        type="text" 
                        defaultValue={trx.keterangan} 
                        className="bg-transparent border-0 p-1 w-full text-gray-900 focus:ring-1 focus:ring-emerald-500 rounded" 
                        required 
                      />
                    </td>
                    {/* Jenis (Menggunakan select bergaya badge) */}
                    <td className="px-6 py-4 text-sm">
                      <select 
                        form={`update-${trx.id}`} 
                        name="jenis" 
                        defaultValue={trx.jenis} 
                        className={`appearance-none font-medium px-2 py-1 rounded-full text-xs border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 transition-colors ${
                          trx.jenis === "pemasukan" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`} 
                        required
                      >
                        <option value="pemasukan" className="bg-white text-emerald-700">Pemasukan</option>
                        <option value="pengeluaran" className="bg-white text-rose-700">Pengeluaran</option>
                      </select>
                    </td>
                    {/* Nominal */}
                    <td className="px-6 py-4 text-sm font-semibold">
                      <div className="flex items-center justify-end">
                        <span className={trx.jenis === "pemasukan" ? "text-emerald-600" : "text-rose-600"}>
                          {trx.jenis === "pemasukan" ? "+" : "-"}Rp
                        </span>
                        <input 
                          form={`update-${trx.id}`} 
                          name="nominal" 
                          type="number" 
                          min="1" 
                          step="1" 
                          defaultValue={trx.nominal} 
                          className={`bg-transparent border-0 p-1 w-24 text-right focus:ring-1 focus:ring-emerald-500 rounded ${
                            trx.jenis === "pemasukan" ? "text-emerald-600" : "text-rose-600"
                          }`} 
                          required 
                        />
                      </div>
                    </td>
                    {/* Aksi */}
                    <td className="px-6 py-4 text-sm text-center flex items-center justify-center gap-3 mt-1">
                      {/* Hidden Forms yang terkait dengan input via attribute form="" */}
                      <form id={`update-${trx.id}`} action={updateTransaction} className="hidden">
                        <input type="hidden" name="transactionId" value={trx.id} />
                      </form>
                      <form id={`delete-${trx.id}`} action={deleteTransaction} className="hidden">
                        <input type="hidden" name="transactionId" value={trx.id} />
                      </form>

                      {/* Tombol trigger form */}
                      <button type="submit" form={`update-${trx.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        Simpan
                      </button>
                      <button type="submit" form={`delete-${trx.id}`} className="text-red-600 hover:text-red-800 font-medium">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}