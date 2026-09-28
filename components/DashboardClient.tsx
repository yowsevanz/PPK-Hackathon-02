"use client";

import { useState } from "react";
import TransactionFilter from "./TransactionFilter";
import DashboardSummaryCards from "./DashboardSummaryCards";


type TransactionRow = {
  id: number;
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: Date;
};


type SummaryData = {
  saldo: number;
  totalMasuk: number;
  totalKeluar: number;
};



export default function DashboardClient({

    initialTransactions,
    summary,

}: {

  initialTransactions: TransactionRow[];
  summary: SummaryData;

}) {


  const [transactions, setTransactions] =
    useState(initialTransactions);



  const [activeFilter, setActiveFilter] =
    useState("semua");



  const [loading, setLoading] =
    useState(false);





  // ==========================
  // FILTER AJAX
  // ==========================

  const handleFilterChange = async (
    filter: string
  ) => {


    setActiveFilter(filter);

    setLoading(true);



    try {


      const response = await fetch(
        `/api/transactions?jenis=${filter}`,
        {
          cache: "no-store",
        }
      );



      const data =
        await response.json();



      setTransactions(data);



    } catch (error) {


      console.error(
        "Gagal mengambil transaksi",
        error
      );


    } finally {


      setLoading(false);


    }


  };






  return (

    <div className="space-y-8">



      {/* SUMMARY DASHBOARD */}

      <DashboardSummaryCards

        data={summary}

        isLoading={false}

      />






      {/* AREA TRANSAKSI */}

      <div className="space-y-4">



        <div className="flex flex-wrap justify-between items-end gap-4">


          <h2 className="text-xl font-bold text-gray-900">
            Daftar Transaksi
          </h2>




          <TransactionFilter

            activeFilter={activeFilter}

            onFilterChange={handleFilterChange}

          />


        </div>







        {/* TABLE */}


        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">


          <div className="overflow-x-auto">


            <table className="w-full text-left">



              <thead>


                <tr className="bg-gray-50 border-b">


                  <th className="px-6 py-4 text-sm text-gray-500">
                    Tanggal
                  </th>


                  <th className="px-6 py-4 text-sm text-gray-500">
                    Jenis
                  </th>


                  <th className="px-6 py-4 text-sm text-gray-500">
                    Keterangan
                  </th>


                  <th className="px-6 py-4 text-sm text-gray-500">
                    Nominal
                  </th>


                </tr>


              </thead>







              <tbody>



                {
                  loading ? (


                    <tr>

                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500"
                      >

                        Memuat transaksi...

                      </td>


                    </tr>




                  ) : transactions.length === 0 ? (


                    <tr>

                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500"
                      >

                        Tidak ada transaksi

                      </td>


                    </tr>




                  ) : (



                    transactions.map((trx)=>(



                      <tr

                        key={trx.id}

                        className="border-b hover:bg-gray-50"

                      >



                        <td className="px-6 py-4 text-gray-900">


                          {
                            new Date(trx.tanggal)
                              .toLocaleDateString("id-ID")
                          }


                        </td>







                        <td className="px-6 py-4">


                          <span

                            className={`
                              px-3 py-1 rounded-full text-xs font-medium

                              ${
                                trx.jenis === "pemasukan"
                                ?
                                "bg-emerald-100 text-emerald-700"
                                :
                                "bg-rose-100 text-rose-700"
                              }

                            `}

                          >

                            {trx.jenis}


                          </span>


                        </td>








                        <td className="px-6 py-4 text-gray-900">


                          {trx.keterangan}


                        </td>








                        <td

                          className={`

                            px-6 py-4 font-semibold

                            ${
                              trx.jenis === "pemasukan"
                              ?
                              "text-emerald-600"
                              :
                              "text-rose-600"
                            }

                          `}

                        >


                          Rp{" "}

                          {trx.nominal.toLocaleString("id-ID")}



                        </td>





                      </tr>



                    ))

                  )

                }



              </tbody>



            </table>



          </div>



        </div>



      </div>



    </div>


  );


}