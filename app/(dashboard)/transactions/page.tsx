import Link from "next/link";
import { createTransaction, deleteTransaction, updateTransaction } from "@/lib/actions/transactionActions";
import { getTransactionUserId } from "@/lib/transactions";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

type TransactionRow = {
  id: number;
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: Date;
};

function dateForInput(date: Date) {
  const normalized = date instanceof Date ? date : new Date(date);
  return new Date(normalized.getTime() - normalized.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function TransactionsPage() {
  const userId = await getTransactionUserId();
  const result = await pool.query<TransactionRow>(
    `SELECT "id", "jenis", "nominal", "keterangan", "tanggal"
     FROM "Transaction"
     WHERE "userId" = $1
     ORDER BY "tanggal" DESC, "id" DESC`,
    [userId],
  );

  const transactions = result.rows;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Ruang keuangan
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Manajemen transaksi
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Catat pemasukan dan pengeluaran, lalu perbarui riwayatnya kapan saja.
          </p>
        </div>
        <Link className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline" href="/">
          Kembali ke beranda
        </Link>
      </header>

      <section className="mb-8 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950">Tambah transaksi</h2>
          <p className="mt-1 text-sm text-slate-600">Isi detail transaksi yang ingin dicatat.</p>
        </div>
        <form action={createTransaction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Jenis
            <select className="h-11 rounded-xl border border-slate-200 bg-white px-3" name="jenis" required defaultValue="pengeluaran">
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Nominal (Rp)
            <input className="h-11 rounded-xl border border-slate-200 px-3" name="nominal" type="number" min="1" step="1" placeholder="150000" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Tanggal
            <input className="h-11 rounded-xl border border-slate-200 px-3" name="tanggal" type="date" required defaultValue={dateForInput(new Date())} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-1">
            Keterangan
            <input className="h-11 rounded-xl border border-slate-200 px-3" name="keterangan" type="text" placeholder="Contoh: Makan siang" required />
          </label>
          <div className="md:col-span-2 xl:col-span-4">
            <button className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800" type="submit">
              Simpan transaksi
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Riwayat transaksi</h2>
            <p className="mt-1 text-sm text-slate-600">{transactions.length} transaksi tercatat</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Milik akun aktif</span>
        </div>

        {transactions.length === 0 ? (
          <div className="px-5 py-14 text-center sm:px-7">
            <p className="font-medium text-slate-800">Belum ada transaksi</p>
            <p className="mt-1 text-sm text-slate-500">Transaksi pertama yang kamu simpan akan muncul di sini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <article className="grid gap-5 px-5 py-5 sm:px-7 lg:grid-cols-[1fr_auto]" key={transaction.id}>
                <form action={updateTransaction} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1.4fr_1fr_1.2fr_auto] xl:items-end">
                  <input name="transactionId" type="hidden" value={transaction.id} />
                  <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Jenis
                    <select className="h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm font-normal normal-case tracking-normal text-slate-800" name="jenis" defaultValue={transaction.jenis} required>
                      <option value="pemasukan">Pemasukan</option>
                      <option value="pengeluaran">Pengeluaran</option>
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Keterangan
                    <input className="h-10 rounded-lg border border-slate-200 px-2 text-sm font-normal normal-case tracking-normal text-slate-800" name="keterangan" defaultValue={transaction.keterangan} required />
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nominal (Rp)
                    <input className="h-10 rounded-lg border border-slate-200 px-2 text-sm font-normal normal-case tracking-normal text-slate-800" name="nominal" type="number" min="1" step="1" defaultValue={transaction.nominal} required />
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tanggal
                    <input className="h-10 rounded-lg border border-slate-200 px-2 text-sm font-normal normal-case tracking-normal text-slate-800" name="tanggal" type="date" defaultValue={dateForInput(transaction.tanggal)} required />
                  </label>
                  <button className="h-10 rounded-lg border border-emerald-200 px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50" type="submit">
                    Simpan edit
                  </button>
                </form>

                <div className="flex items-center justify-between gap-4 lg:justify-end">
                  <div>
                    <p className={`text-right text-sm font-bold ${transaction.jenis === "pemasukan" ? "text-emerald-700" : "text-rose-700"}`}>
                      {transaction.jenis === "pemasukan" ? "+" : "−"}{formatRupiah(transaction.nominal)}
                    </p>
                    <p className="mt-1 text-right text-xs text-slate-500">
                      {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(transaction.tanggal)}
                    </p>
                  </div>
                  <form action={deleteTransaction}>
                    <input name="transactionId" type="hidden" value={transaction.id} />
                    <button aria-label={`Hapus transaksi ${transaction.keterangan}`} className="h-10 rounded-lg border border-rose-200 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50" type="submit">
                      Hapus
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
