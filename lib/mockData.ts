export type Transaction = {
  id: string;
  user_id: string;
  jenis: 'pemasukan' | 'pengeluaran';
  nominal: number;
  keterangan: string;
  tanggal: string;
};

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    user_id: "user-1",
    jenis: "pemasukan",
    nominal: 15000000,
    keterangan: "Gaji Bulan Ini",
    tanggal: "2026-09-01",
  },
  {
    id: "2",
    user_id: "user-1",
    jenis: "pengeluaran",
    nominal: 450000,
    keterangan: "Makan di Restoran Mewah",
    tanggal: "2026-09-03",
  },
  {
    id: "3",
    user_id: "user-1",
    jenis: "pengeluaran",
    nominal: 150000,
    keterangan: "Kopi Hedon",
    tanggal: "2026-09-05",
  },
  {
    id: "4",
    user_id: "user-1",
    jenis: "pengeluaran",
    nominal: 2000000,
    keterangan: "Beli Sepatu Sneaker",
    tanggal: "2026-09-10",
  },
  {
    id: "5",
    user_id: "user-1",
    jenis: "pemasukan",
    nominal: 500000,
    keterangan: "Cashback Belanja",
    tanggal: "2026-09-15",
  },
  {
    id: "6",
    user_id: "user-1",
    jenis: "pengeluaran",
    nominal: 300000,
    keterangan: "Langganan Streaming",
    tanggal: "2026-09-20",
  },
];