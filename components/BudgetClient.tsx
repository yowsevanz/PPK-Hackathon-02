"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BudgetForm from "@/components/BudgetForm";
import BudgetIndicator from "@/components/BudgetIndicator";
import BudgetSummary from "@/components/BudgetSummary";
import MonthPicker from "@/components/MonthPicker";
import type { BudgetStatus } from "@/lib/actions/budgetActions";

type BudgetSummaryData = {
  bulan: number;
  tahun: number;
  jumlahAnggaran: number | null;
  totalPengeluaran: number;
  sisaAnggaran: number | null;
  persentaseTerpakai: number | null;
  status: BudgetStatus;
};

type BudgetApiError = { error?: string };

function getApiError(body: unknown, fallback: string) {
  if (typeof body === "object" && body !== null && "error" in body) {
    const message = (body as BudgetApiError).error;
    if (typeof message === "string") return message;
  }
  return fallback;
}

export default function BudgetClient({ initialMonth }: { initialMonth: string }) {
  const [period, setPeriod] = useState(initialMonth);
  const [summary, setSummary] = useState<BudgetSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (!period) return;

    const controller = new AbortController();
    const [year, month] = period.split("-");

    async function loadSummary() {
      try {
        const response = await fetch(`/api/budget?bulan=${Number(month)}&tahun=${Number(year)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const body: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          if (response.status === 401) setSessionExpired(true);
          throw new Error(getApiError(body, "Ringkasan anggaran gagal dimuat."));
        }

        setSummary(body as BudgetSummaryData);
        setSessionExpired(false);
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name === "AbortError") return;
        setSummary(null);
        setError(requestError instanceof Error ? requestError.message : "Ringkasan anggaran gagal dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadSummary();
    return () => controller.abort();
  }, [period]);

  async function saveAmount(amount: number) {
    const [year, month] = period.split("-");
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulan: Number(month), tahun: Number(year), jumlahAnggaran: amount }),
      });
      const body: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) setSessionExpired(true);
        throw new Error(getApiError(body, "Anggaran gagal disimpan."));
      }

      setSummary(body as BudgetSummaryData);
      setSessionExpired(false);
      setSuccess("Anggaran berhasil disimpan.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Anggaran gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  const monthLabel = period
    ? new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" })
        .format(new Date(`${period}-01T00:00:00.000Z`))
    : "";

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Perencanaan keuangan</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Anggaran Bulanan</h1>
          <p className="mt-2 text-slate-600">Atur batas pengeluaran dan pantau pemakaian setiap bulan.</p>
        </div>
        <div className="w-full sm:w-64">
          <MonthPicker
            value={period}
            onChange={(value) => {
              setPeriod(value);
              setSummary(null);
              setLoading(true);
              setError(null);
              setSuccess(null);
              setSessionExpired(false);
            }}
            disabled={saving}
          />
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {error}{" "}
          {sessionExpired && <Link className="font-semibold underline" href="/login">Login kembali</Link>}
        </div>
      )}
      {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{success}</p>}

      {loading && (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500" role="status">
          Memuat anggaran {monthLabel}…
        </p>
      )}

      {!loading && summary && (
        <>
          <BudgetSummary
            jumlahAnggaran={summary.jumlahAnggaran}
            totalPengeluaran={summary.totalPengeluaran}
            sisaAnggaran={summary.sisaAnggaran}
          />
          <BudgetIndicator status={summary.status} persentaseTerpakai={summary.persentaseTerpakai} />
        </>
      )}

      <BudgetForm
        key={`${period}-${summary?.jumlahAnggaran ?? "none"}`}
        period={period}
        jumlahAnggaran={summary?.jumlahAnggaran ?? null}
        saving={saving || loading}
        onSave={saveAmount}
      />
    </div>
  );
}
