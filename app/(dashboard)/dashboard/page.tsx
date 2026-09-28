import { pool } from "@/lib/db";
import { createTransaction } from "@/lib/actions/transactionActions";
import { getTransactionUserId } from "@/lib/transactions";
import DashboardClient from "@/components/DashboardClient";


export const dynamic = "force-dynamic";



type TransactionRow = {
  id: number;
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: Date;
};



// format rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};



function dateForInput(date: Date) {

  const normalized =
    date instanceof Date
      ? date
      : new Date(date);


  return new Date(
    normalized.getTime() -
      normalized.getTimezoneOffset() * 60_000
  )
    .toISOString()
    .slice(0, 10);

}



export default async function DashboardPage() {


  // ambil user aktif
  const userId = await getTransactionUserId();



  // ambil summary + transaksi
  const [
    totalsResult,
    transactionsResult
  ] = await Promise.all([



    pool.query(
      `
      SELECT

        COALESCE(
          SUM(
            CASE
              WHEN "jenis" = 'pemasukan'
              THEN "nominal"
              ELSE 0
            END
          ),
          0
        ) AS "totalPemasukan",


        COALESCE(
          SUM(
            CASE
              WHEN "jenis" = 'pengeluaran'
              THEN "nominal"
              ELSE 0
            END
          ),
          0
        ) AS "totalPengeluaran"


      FROM "Transaction"

      WHERE "userId" = $1
      `,
      [userId]
    ),




    pool.query<TransactionRow>(
      `
      SELECT

        "id",
        "jenis",
        "nominal",
        "keterangan",
        "tanggal"

      FROM "Transaction"

      WHERE "userId" = $1

      ORDER BY
        "tanggal" DESC,
        "id" DESC

      `,
      [userId]
    )

  ]);





  const totalPemasukan =
    Number(
      totalsResult.rows[0]?.totalPemasukan || 0
    );



  const totalPengeluaran =
    Number(
      totalsResult.rows[0]?.totalPengeluaran || 0
    );



  const saldoSaatIni =
    totalPemasukan - totalPengeluaran;



  const allTransactions =
    transactionsResult.rows;




  return (

    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 space-y-8">


      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Keuangan
        </h1>


        <p className="mt-2 text-gray-600">
          Ringkasan kondisi keuanganmu dan kelola semua transaksi di satu tempat.
        </p>

      </div>





      {/* FORM TAMBAH TRANSAKSI */}

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">


        <div className="mb-5">

          <h2 className="text-lg font-semibold text-slate-950">
            Tambah transaksi
          </h2>


          <p className="mt-1 text-sm text-slate-600">
            Isi detail transaksi baru yang ingin dicatat.
          </p>


        </div>




        <form
          action={createTransaction}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >


          <label className="grid gap-2 text-sm font-medium text-slate-700">

            Jenis

            <select
              className="h-11 rounded-xl border border-slate-200 bg-white px-3"
              name="jenis"
              required
              defaultValue="pengeluaran"
            >

              <option value="pemasukan">
                Pemasukan
              </option>

              <option value="pengeluaran">
                Pengeluaran
              </option>

            </select>


          </label>





          <label className="grid gap-2 text-sm font-medium text-slate-700">

            Nominal (Rp)

            <input
              className="h-11 rounded-xl border border-slate-200 px-3"
              name="nominal"
              type="number"
              min="1"
              required
            />

          </label>





          <label className="grid gap-2 text-sm font-medium text-slate-700">

            Tanggal

            <input
              className="h-11 rounded-xl border border-slate-200 px-3"
              name="tanggal"
              type="date"
              required
              defaultValue={dateForInput(new Date())}
            />

          </label>





          <label className="grid gap-2 text-sm font-medium text-slate-700">

            Keterangan

            <input
              className="h-11 rounded-xl border border-slate-200 px-3"
              name="keterangan"
              type="text"
              placeholder="Contoh: Makan siang"
              required
            />

          </label>





          <div className="md:col-span-2 xl:col-span-4">

            <button
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
              type="submit"
            >

              Simpan transaksi

            </button>

          </div>


        </form>


      </section>





      {/* BAGIAN AJAX TRANSAKSI */}

      <DashboardClient

        initialTransactions={allTransactions}

        summary={{
          saldo: saldoSaatIni,
          totalMasuk: totalPemasukan,
          totalKeluar: totalPengeluaran,
        }}

      />


    </main>

  );

}