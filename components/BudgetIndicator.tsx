"use client";

import type { BudgetStatus } from "@/lib/actions/budgetActions";

type BudgetIndicatorProps = {
  status: BudgetStatus;
  persentaseTerpakai: number | null;
};

const statusPresentation: Record<BudgetStatus, { label: string; description: string; color: string }> = {
  belum_ditetapkan: {
    label: "Anggaran belum ditetapkan",
    description: "Tetapkan batas pengeluaran untuk mulai memantau pemakaian.",
    color: "text-slate-700",
  },
  aman: {
    label: "Aman",
    description: "Pemakaian anggaran masih di bawah 80%.",
    color: "text-emerald-700",
  },
  mendekati_batas: {
    label: "Mendekati batas",
    description: "Pemakaian anggaran sudah mencapai setidaknya 80%.",
    color: "text-amber-700",
  },
  habis: {
    label: "Anggaran habis",
    description: "Total pengeluaran sudah sama dengan anggaran.",
    color: "text-amber-700",
  },
  melebihi_anggaran: {
    label: "Melebihi anggaran",
    description: "Total pengeluaran sudah melewati anggaran.",
    color: "text-rose-700",
  },
};

export default function BudgetIndicator({ status, persentaseTerpakai }: BudgetIndicatorProps) {
  const presentation = statusPresentation[status];
  const progressWidth = persentaseTerpakai === null ? 0 : Math.min(Math.max(persentaseTerpakai, 0), 100);
  const progressColor =
    status === "melebihi_anggaran"
      ? "bg-rose-500"
      : status === "mendekati_batas" || status === "habis"
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <section aria-live="polite" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Status penggunaan</h2>
          <p className={`mt-1 text-sm font-semibold ${presentation.color}`}>{presentation.label}</p>
          <p className="mt-1 text-sm text-slate-500">{presentation.description}</p>
        </div>
        {persentaseTerpakai !== null && (
          <p className="text-lg font-bold text-slate-900">
            {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(persentaseTerpakai)}%
          </p>
        )}
      </div>
      <div
        className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="Persentase anggaran terpakai"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={persentaseTerpakai === null ? 0 : Math.min(Math.max(persentaseTerpakai, 0), 100)}
        aria-valuetext={persentaseTerpakai === null ? "Anggaran belum ditetapkan" : `${persentaseTerpakai}% terpakai`}
      >
        <div className={`h-full rounded-full transition-all ${progressColor}`} style={{ width: `${progressWidth}%` }} />
      </div>
    </section>
  );
}
