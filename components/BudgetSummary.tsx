"use client";

type BudgetSummaryProps = {
  jumlahAnggaran: number | null;
  totalPengeluaran: number;
  sisaAnggaran: number | null;
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const cards = [
  { label: "Anggaran", key: "budget", color: "text-slate-950" },
  { label: "Total pengeluaran", key: "spent", color: "text-rose-600" },
  { label: "Sisa anggaran", key: "remaining", color: "text-emerald-700" },
] as const;

export default function BudgetSummary({ jumlahAnggaran, totalPengeluaran, sisaAnggaran }: BudgetSummaryProps) {
  const values = {
    budget: jumlahAnggaran === null ? "Belum ditetapkan" : formatRupiah(jumlahAnggaran),
    spent: formatRupiah(totalPengeluaran),
    remaining: sisaAnggaran === null ? "—" : formatRupiah(sisaAnggaran),
  };

  return (
    <section aria-label="Ringkasan anggaran" className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <article key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className={`mt-3 break-words text-xl font-bold sm:text-2xl ${card.color}`}>
            {values[card.key]}
          </p>
        </article>
      ))}
    </section>
  );
}
