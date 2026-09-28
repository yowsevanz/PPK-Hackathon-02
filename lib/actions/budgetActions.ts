import "server-only";

import { prisma } from "@/lib/db";

export type BudgetStatus =
  | "belum_ditetapkan"
  | "aman"
  | "mendekati_batas"
  | "habis"
  | "melebihi_anggaran";

export type BudgetSummary = {
  bulan: number;
  tahun: number;
  jumlahAnggaran: number | null;
  totalPengeluaran: number;
  sisaAnggaran: number | null;
  persentaseTerpakai: number | null;
  status: BudgetStatus;
};

function getMonthBounds(bulan: number, tahun: number) {
  const mulai = new Date(0);
  mulai.setUTCFullYear(tahun, bulan - 1, 1);
  mulai.setUTCHours(0, 0, 0, 0);

  const akhir = new Date(0);
  akhir.setUTCFullYear(tahun, bulan, 1);
  akhir.setUTCHours(0, 0, 0, 0);

  return { mulai, akhir };
}

function getStatus(totalPengeluaran: number, jumlahAnggaran: number | null): BudgetStatus {
  if (jumlahAnggaran === null) return "belum_ditetapkan";
  if (totalPengeluaran > jumlahAnggaran) return "melebihi_anggaran";
  if (totalPengeluaran === jumlahAnggaran) return "habis";
  if (totalPengeluaran / jumlahAnggaran >= 0.8) return "mendekati_batas";
  return "aman";
}

export async function getBudgetSummary(userId: number, bulan: number, tahun: number): Promise<BudgetSummary> {
  const { mulai, akhir } = getMonthBounds(bulan, tahun);

  const [budget, pengeluaran] = await Promise.all([
    prisma.budget.findUnique({
      where: { userId_bulan_tahun: { userId, bulan, tahun } },
      select: { jumlahAnggaran: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        jenis: "pengeluaran",
        tanggal: { gte: mulai, lt: akhir },
      },
      _sum: { nominal: true },
    }),
  ]);

  const jumlahAnggaran = budget?.jumlahAnggaran ?? null;
  const totalPengeluaran = pengeluaran._sum.nominal ?? 0;

  return {
    bulan,
    tahun,
    jumlahAnggaran,
    totalPengeluaran,
    sisaAnggaran: jumlahAnggaran === null ? null : jumlahAnggaran - totalPengeluaran,
    persentaseTerpakai:
      jumlahAnggaran === null ? null : (totalPengeluaran / jumlahAnggaran) * 100,
    status: getStatus(totalPengeluaran, jumlahAnggaran),
  };
}

export async function saveBudget(
  userId: number,
  bulan: number,
  tahun: number,
  jumlahAnggaran: number,
) {
  await prisma.budget.upsert({
    where: { userId_bulan_tahun: { userId, bulan, tahun } },
    create: { userId, bulan, tahun, jumlahAnggaran },
    update: { jumlahAnggaran },
  });

  return getBudgetSummary(userId, bulan, tahun);
}
