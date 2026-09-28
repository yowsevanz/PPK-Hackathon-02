import { NextResponse } from "next/server";
import { pool } from "@/lib/db";


// UPDATE TRANSAKSI
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {

  try {

    const id = params.id;

    const body = await request.json();

    const {
      jenis,
      nominal,
      keterangan,
      tanggal
    } = body;


    const result = await pool.query(
      `
      UPDATE "Transaction"
      SET
        "jenis" = $1,
        "nominal" = $2,
        "keterangan" = $3,
        "tanggal" = $4
      WHERE "id" = $5
      RETURNING *
      `,
      [
        jenis,
        nominal,
        keterangan,
        tanggal,
        id
      ]
    );


    return NextResponse.json(
      result.rows[0],
      {
        status: 200
      }
    );


  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal update transaksi"
      },
      {
        status: 500
      }
    );

  }

}



// DELETE TRANSAKSI
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {

  try {

    const id = params.id;


    await pool.query(
      `
      DELETE FROM "Transaction"
      WHERE "id" = $1
      `,
      [id]
    );


    return NextResponse.json(
      {
        message: "Transaksi berhasil dihapus"
      },
      {
        status: 200
      }
    );


  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal menghapus transaksi"
      },
      {
        status: 500
      }
    );

  }

}