"use client";

import { useState, type FormEvent } from "react";

type BudgetFormProps = {
  period: string;
  jumlahAnggaran: number | null;
  saving: boolean;
  onSave: (amount: number) => Promise<void>;
};

export default function BudgetForm({ period, jumlahAnggaran, saving, onSave }: BudgetFormProps) {
  const [amount, setAmount] = useState(jumlahAnggaran === null ? "" : String(jumlahAnggaran));
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = Number(amount);

    if (!Number.isSafeInteger(parsedAmount) || parsedAmount <= 0 || parsedAmount > 2_147_483_647) {
      setError("Masukkan nominal bulat positif, maksimal Rp2.147.483.647.");
      return;
    }

    setError(null);
    await onSave(parsedAmount);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">
          {jumlahAnggaran === null ? "Tetapkan anggaran" : "Ubah anggaran"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">Batas pengeluaran untuk bulan yang dipilih.</p>
      </div>
      <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
        <label className="grid flex-1 gap-2 text-sm font-medium text-slate-700">
          Nominal anggaran (Rp)
          <input
            className="h-11 rounded-xl border border-slate-200 px-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            type="number"
            inputMode="numeric"
            min="1"
            max="2147483647"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Contoh: 3000000"
            disabled={saving}
            required
          />
        </label>
        <button
          className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={saving || !period}
        >
          {saving ? "Menyimpan…" : jumlahAnggaran === null ? "Simpan anggaran" : "Simpan perubahan"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-rose-700" role="alert">{error}</p>}
    </section>
  );
}
