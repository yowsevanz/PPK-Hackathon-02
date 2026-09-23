import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <section className="w-full max-w-3xl rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Expense tracker
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Catat uangmu dengan lebih tenang.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
          Kelola pemasukan dan pengeluaran dalam satu riwayat transaksi yang mudah diperbarui.
        </p>
        <Link
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
          href="/transactions"
        >
          Buka manajemen transaksi
        </Link>
      </section>
    </main>
  );
}
