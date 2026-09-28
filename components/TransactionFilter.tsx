"use client";


interface Props{

activeFilter:string;

onFilterChange:(filter:string)=>void;

}



export default function TransactionFilter({

activeFilter,

onFilterChange

}:Props){



const filters=[

{
id:"semua",
label:"Semua Transaksi"
},

{
id:"pemasukan",
label:"Pemasukan"
},

{
id:"pengeluaran",
label:"Pengeluaran"
}

];



return(

<div className="inline-flex bg-gray-100 p-1 rounded-lg">


{
filters.map(filter=>(


<button

key={filter.id}

onClick={()=>onFilterChange(filter.id)}

className={`
px-4 py-2 text-sm rounded-md
${
activeFilter===filter.id
?
"bg-white shadow text-gray-900"
:
"text-gray-500"
}
`}

>

{filter.label}

</button>


))
}


</div>

)

}