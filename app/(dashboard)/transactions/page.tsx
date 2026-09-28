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



export default async function TransactionsPage() {


  // ambil user yang sedang login
  const userId = await getTransactionUserId();



  // ambil transaksi user dari database
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

    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">

      <TransactionClient
        initialTransactions={transactions}
      />

    </main>

  );
}