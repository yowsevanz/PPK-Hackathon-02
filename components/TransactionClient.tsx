"use client";

import { useState } from "react";
import TransactionFilter from "@/components/TransactionFilter";
import TransactionTable from "@/components/TransactionTable";


type TransactionRow = {
  id: number;
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: string;
};



export default function TransactionClient({
  initialTransactions,
}: {
  initialTransactions: TransactionRow[];
}) {


  const [transactions, setTransactions] =
    useState(initialTransactions);


  const [activeFilter, setActiveFilter] =
    useState("semua");


  // menyimpan transaksi yang sedang diedit
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionRow | null>(null);



  // ==========================
  // FILTER AJAX
  // ==========================
  const handleFilterChange = async (filter: string) => {

    setActiveFilter(filter);


    const response = await fetch(
      `/api/transactions?jenis=${filter}`
    );


    const data = await response.json();


    setTransactions(data);

  };



  // ==========================
  // DELETE AJAX
  // ==========================
  const handleDelete = async (id: number) => {


    const confirmDelete =
      confirm("Yakin ingin menghapus transaksi ini?");


    if (!confirmDelete) return;



    await fetch(
      `/api/transactions/${id}`,
      {
        method: "DELETE",
      }
    );



    // hapus dari tampilan tanpa reload
    setTransactions(
      transactions.filter(
        (trx) => trx.id !== id
      )
    );

  };



  // ==========================
  // BUKA FORM EDIT
  // ==========================
  const handleEdit = (
    transaction: TransactionRow
  ) => {

    setEditingTransaction(transaction);

  };



  // ==========================
  // UPDATE AJAX
  // ==========================
  const handleUpdate = async (
    updatedTransaction: TransactionRow
  ) => {


    const response = await fetch(
      `/api/transactions/${updatedTransaction.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      }
    );


    const updatedData =
      await response.json();



    setTransactions(
      transactions.map((trx) =>
        trx.id === updatedData.id
          ? updatedData
          : trx
      )
    );



    setEditingTransaction(null);

  };



  return (
    <>


      <TransactionFilter
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />



      {/* FORM EDIT */}
      {
        editingTransaction && (

          <div className="mt-5 border rounded-lg p-5 space-y-3">


            <h2 className="font-bold text-lg">
              Edit Transaksi
            </h2>



            <input
              className="border p-2 w-full"
              value={editingTransaction.keterangan}
              onChange={(e) =>
                setEditingTransaction({
                  ...editingTransaction,
                  keterangan: e.target.value,
                })
              }
            />



            <input
              className="border p-2 w-full"
              type="number"
              value={editingTransaction.nominal}
              onChange={(e) =>
                setEditingTransaction({
                  ...editingTransaction,
                  nominal: Number(e.target.value),
                })
              }
            />



            <div className="flex gap-2">

              <button
                onClick={() =>
                  handleUpdate(editingTransaction)
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>



              <button
                onClick={() =>
                  setEditingTransaction(null)
                }
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Batal
              </button>

            </div>


          </div>

        )
      }




      <TransactionTable
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />


    </>
  );
}