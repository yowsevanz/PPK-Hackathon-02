"use client";
import Link from "next/link"
import { useState } from "react";
import TransactionFilter from "./TransactionFilter";
import TransactionTable from "./TransactionTable";


type TransactionRow = {
  id:number;
  jenis:"pemasukan"|"pengeluaran";
  nominal:number;
  keterangan:string;
  tanggal:Date;
};



export default function TransactionClient({

initialTransactions

}:{

initialTransactions:TransactionRow[]

}){


const [transactions,setTransactions]
=
useState(initialTransactions);



const [activeFilter,setActiveFilter]
=
useState("semua");



const [editingTransaction,setEditingTransaction]
=
useState<TransactionRow|null>(null);





// FILTER AJAX

const handleFilterChange = async(
filter:string
)=>{


setActiveFilter(filter);



const response =
await fetch(
`/api/transactions?jenis=${filter}`
);



const data =
await response.json();



setTransactions(data);


};






// DELETE AJAX

const handleDelete = async(id:number)=>{


const confirmDelete =
confirm(
"Yakin ingin menghapus transaksi?"
);


if(!confirmDelete)return;



await fetch(
`/api/transactions/${id}`,
{
method:"DELETE"
}
);



setTransactions(
transactions.filter(
trx=>trx.id!==id
)
);


};






// EDIT

const handleEdit = (
trx:TransactionRow
)=>{

setEditingTransaction(trx);

};






// UPDATE AJAX

const handleUpdate = async()=>{


if(!editingTransaction)return;



const response =
await fetch(
`/api/transactions/${editingTransaction.id}`,
{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify(editingTransaction)

}

);



const updated =
await response.json();



setTransactions(
transactions.map(
trx=>
trx.id===updated.id
?
updated
:
trx
)
);



setEditingTransaction(null);


};






return (

<div className="space-y-6">


{/* HEADER + FILTER */}

<div className="flex flex-wrap justify-between items-end gap-4">


<div>

<h1 className="text-3xl font-bold text-gray-900">
Daftar Transaksi
</h1>


<p className="mt-2 text-gray-600">
Lihat semua pengeluaran dan pemasukanmu di sini.
</p>
<Link className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline mt-3 inline-block" href="/">
            &larr; Kembali ke beranda
</Link>


</div>



<TransactionFilter

activeFilter={activeFilter}

onFilterChange={handleFilterChange}

/>


</div>





{/* FORM EDIT */}

{
editingTransaction && (

<div className="bg-white border rounded-xl shadow-sm p-5 space-y-3">


<h2 className="font-bold text-lg">
Edit Transaksi
</h2>


<input

className="border p-2 w-full"

value={editingTransaction.keterangan}

onChange={(e)=>
setEditingTransaction({

...editingTransaction,

keterangan:e.target.value

})
}

/>



<input

type="number"

className="border p-2 w-full"

value={editingTransaction.nominal}

onChange={(e)=>
setEditingTransaction({

...editingTransaction,

nominal:Number(e.target.value)

})
}

/>



<button

onClick={handleUpdate}

className="bg-emerald-600 text-white px-4 py-2 rounded"

>

Simpan

</button>



</div>

)
}





<TransactionTable

transactions={transactions}

onDelete={handleDelete}

onEdit={handleEdit}

/>



</div>

)

}