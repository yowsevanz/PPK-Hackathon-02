import { NextResponse } from 'next/server';
// import prisma dari konfigurasi database Anda, contoh: import prisma from '@/lib/prisma';
// import { getSession } from '@/lib/auth'; // Sesuaikan dengan fungsi utilitas sesi yang sudah ada di User Story 1

export async function GET(request: Request) {
  try {
    // 1. Verifikasi Sesi
    // const session = await getSession();
    // if (!session || !session.user_id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // 2. Ambil data dari tabel Transaction (Mock menggunakan Prisma)
    /*
    const transactions = await prisma.transaction.findMany({
      where: { user_id: session.user_id }
    });

    let totalMasuk = 0;
    let totalKeluar = 0;

    transactions.forEach(t => {
      if (t.jenis === 'Pemasukan') totalMasuk += t.nominal;
      if (t.jenis === 'Pengeluaran') totalKeluar += t.nominal;
    });
    */

    // Mock response (Ganti dengan logika Prisma di atas setelah integrasi)
    const totalMasuk = 5000000;
    const totalKeluar = 2000000;
    const saldo = totalMasuk - totalKeluar;

    return NextResponse.json({ saldo, totalMasuk, totalKeluar }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data ringkasan' }, { status: 500 });
  }
}