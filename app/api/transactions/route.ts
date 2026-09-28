import { NextResponse } from "next/server";
import { pool } from "@/lib/db";


export async function GET(request: Request) {

  try {

    // Ambil parameter dari URL
    // Contoh:
    // /api/transactions?jenis=pemasukan
    const { searchParams } = new URL(request.url);

    const jenis = searchParams.get("jenis");


    let query = `
      SELECT
        "id",
        "jenis",
        "nominal",
        "keterangan",
        "tanggal"
      FROM "Transaction"
    `;


    let values: any[] = [];


    // Jika filter bukan "semua"
    if (jenis && jenis !== "semua") {

      query += `
        WHERE "jenis" = $1
      `;

      values.push(jenis);

    }


    query += `
      ORDER BY "tanggal" DESC, "id" DESC
    `;


    const result = await pool.query(
      query,
      values
    );


    return NextResponse.json(
      result.rows,
      {
        status: 200
      }
    );


  } catch (error) {

    console.error("GET transactions error:", error);


    return NextResponse.json(
      {
        error: "Gagal mengambil data transaksi"
      },
      {
        status: 500
      }
    );

  }

}