import Link from "next/link";
import { createTransaction } from "@/lib/actions/transactionActions";
import { getTransactionUserId } from "@/lib/transactions";
import { pool } from "@/lib/db";
import TransactionClient from "@/components/TransactionClient";


export const dynamic = "force-dynamic";


export type TransactionRow = {
  id: number;
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: Date;
};


function dateForInput(date: Date) {
  const normalized = date instanceof Date ? date : new Date(date);

  return new Date(
    normalized.getTime() - normalized.getTimezoneOffset() * 60_000
  )
    .toISOString()
    .slice(0, 10);
}


export default async function TransactionsPage() {

  // 1. Ambil user yang sedang login
  const userId = await getTransactionUserId();


  // 2. Ambil semua transaksi user
  const result = await pool.query<TransactionRow>(
    `
    SELECT 
      "id",
      "jenis",
      "nominal",
      "keterangan",
      "tanggal"
    FROM "Transaction"
    WHERE "userId" = $1
    ORDER BY "tanggal" DESC, "id" DESC
    `,
    [userId]
  );


  const transactions = result.rows;


  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 space-y-6">

      <div className="flex flex-wrap justify-between items-end gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Daftar Transaksi
          </h1>

          <p className="mt-2 text-gray-600">
            Kelola semua pemasukan dan pengeluaranmu.
          </p>

          <Link
            href="/"
            className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline mt-3 inline-block"
          >
            ← Kembali ke beranda
          </Link>

        </div>

      </div>


      {/* Semua interaksi AJAX masuk sini */}
      <TransactionClient
        initialTransactions={transactions}
      />


    </main>
  );
}