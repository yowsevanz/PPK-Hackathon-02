"use client";


import type { TransactionRow } from "@/app/(dashboard)/transactions/page";


interface Props {

  transactions: TransactionRow[];

  onDelete: (id:number)=>void;

  onEdit: (transaction:TransactionRow)=>void;

}




export default function TransactionTable({

  transactions,

  onDelete,

  onEdit,

}:Props){



return (

<div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">


<div className="overflow-x-auto">


<table className="w-full text-left">


<thead>


<tr className="border-b border-slate-100 bg-slate-50">


<th className="px-6 py-4 text-sm font-medium text-slate-500">
Tanggal
</th>


<th className="px-6 py-4 text-sm font-medium text-slate-500">
Jenis
</th>


<th className="px-6 py-4 text-sm font-medium text-slate-500">
Keterangan
</th>


<th className="px-6 py-4 text-sm font-medium text-slate-500">
Nominal
</th>


<th className="px-6 py-4 text-sm font-medium text-slate-500">
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
className="px-6 py-8 text-center text-slate-500"
>

Belum ada transaksi

</td>

</tr>


):(


transactions.map((trx)=>{


const isIncome =
trx.jenis.toLowerCase()==="pemasukan";


return (

<tr
key={trx.id}
className="border-b border-slate-100"
>


<td className="px-6 py-4 text-sm text-gray-900">

{
new Date(trx.tanggal)
.toLocaleDateString("id-ID")
}

</td>



<td className="px-6 py-4">


<span
className={`
rounded-full px-3 py-1 text-xs font-medium
${
isIncome
?
"bg-emerald-50 text-emerald-700 border border-emerald-200"
:
"bg-rose-50 text-rose-700 border border-rose-200"
}
`}
>

{trx.jenis}

</span>


</td>




<td className="px-6 py-4 text-sm text-gray-900">

{trx.keterangan}

</td>




<td className="px-6 py-4 font-semibold">


<span
className={
isIncome
?
"text-emerald-600"
:
"text-rose-600"
}
>

{isIncome ? "+" : "-"}
Rp {trx.nominal.toLocaleString("id-ID")}

</span>


</td>





<td className="px-6 py-4">


<div className="flex gap-3">


<button

onClick={() => onEdit(trx)}

className="text-sm font-medium text-blue-600 hover:underline"

>

Edit

</button>




<button

onClick={() => onDelete(trx.id)}

className="text-sm font-medium text-red-600 hover:underline"

>

Hapus

</button>


</div>


</td>



</tr>

)


})

)


}


</tbody>


</table>


</div>


</div>

);


}