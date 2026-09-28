"use client";
import type { TransactionRow } from "@/app/(dashboard)/transactions/page";


interface Props {
  transactions: TransactionRow[];
  onDelete: (id: number) => void;
  onEdit: (transaction: TransactionRow) => void;
}



export default function TransactionTable({
  transactions,
  onDelete,
  onEdit,
}: Props) {


  return (
    <div className="mt-5 overflow-x-auto">

      <table className="w-full border-collapse rounded-lg overflow-hidden">


        <thead>

          <tr className="bg-gray-100 text-left">


            <th className="p-3">
              Tanggal
            </th>


            <th className="p-3">
              Jenis
            </th>


            <th className="p-3">
              Keterangan
            </th>


            <th className="p-3">
              Nominal
            </th>


            <th className="p-3">
              Aksi
            </th>


          </tr>

        </thead>



        <tbody>


          {
            transactions.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-5 text-center text-gray-500"
                >
                  Belum ada transaksi
                </td>

              </tr>


            ) : (


              transactions.map((trx) => (

                <tr
                  key={trx.id}
                  className="border-b"
                >


                  <td className="p-3">
                    {new Date(trx.tanggal)
                      .toLocaleDateString("id-ID")}
                  </td>



                  <td className="p-3 capitalize">
                    {trx.jenis}
                  </td>



                  <td className="p-3">
                    {trx.keterangan}
                  </td>



                  <td className="p-3">
                    Rp {trx.nominal
                      .toLocaleString("id-ID")}
                  </td>



                  <td className="p-3 flex gap-2">


                    <button
                      onClick={() => onEdit(trx)}
                      className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                    >
                      Edit
                    </button>



                    <button
                      onClick={() => onDelete(trx.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                    >
                      Hapus
                    </button>


                  </td>


                </tr>

              ))

            )
          }


        </tbody>


      </table>


    </div>
  );
}