"use client";

interface Props {
  activeFilter: string;
  onFilterChange: (filter:string)=>void;
}

export default function TransactionFilter({
  activeFilter,
  onFilterChange
}: Props) {


  const handleFilterChange = (newFilter:string)=>{

    document.cookie =
    `transaction_filter=${newFilter}; path=/; max-age=31536000`;

    onFilterChange(newFilter);

  };


  const filters = [
    { id:"semua", label:"Semua Transaksi" },
    { id:"pemasukan", label:"Pemasukan" },
    { id:"pengeluaran", label:"Pengeluaran" },
  ];


  return (

    <div className="inline-flex bg-gray-100 p-1 rounded-lg">

      {filters.map((filter)=>{

        const isActive =
        activeFilter === filter.id;


        return (

          <button
            key={filter.id}
            onClick={()=>
              handleFilterChange(filter.id)
            }
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              isActive
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
            }`}
          >

          {filter.label}

          </button>

        )

      })}

    </div>

  );
}