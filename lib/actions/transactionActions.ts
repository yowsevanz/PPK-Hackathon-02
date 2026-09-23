"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { getTransactionUserId } from "@/lib/transactions";

type TransactionInput = {
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: string;
};

function readTransactionInput(formData: FormData): TransactionInput {
  const jenis = formData.get("jenis");
  const nominal = Number(formData.get("nominal"));
  const keterangan = String(formData.get("keterangan") ?? "").trim();
  const tanggal = String(formData.get("tanggal") ?? "");

  if (jenis !== "pemasukan" && jenis !== "pengeluaran") {
    throw new Error("Pilih jenis transaksi yang valid.");
  }

  if (!Number.isSafeInteger(nominal) || nominal <= 0 || nominal > 2_147_483_647) {
    throw new Error("Nominal harus berupa bilangan bulat yang lebih besar dari 0.");
  }

  if (keterangan.length === 0) {
    throw new Error("Keterangan wajib diisi.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    throw new Error("Tanggal transaksi tidak valid.");
  }

  const parsedDate = new Date(`${tanggal}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== tanggal) {
    throw new Error("Tanggal transaksi tidak valid.");
  }

  return { jenis, nominal, keterangan, tanggal };
}

function readTransactionId(formData: FormData) {
  const transactionId = Number(formData.get("transactionId"));
  if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
    throw new Error("Transaksi tidak ditemukan.");
  }
  return transactionId;
}

export async function createTransaction(formData: FormData) {
  const userId = await getTransactionUserId();
  const transaction = readTransactionInput(formData);

  await pool.query(
    `INSERT INTO "Transaction" ("userId", "jenis", "nominal", "keterangan", "tanggal")
     VALUES ($1, $2, $3, $4, $5::timestamp)`,
    [userId, transaction.jenis, transaction.nominal, transaction.keterangan, transaction.tanggal],
  );

  revalidatePath("/transactions");
}

export async function updateTransaction(formData: FormData) {
  const userId = await getTransactionUserId();
  const transactionId = readTransactionId(formData);
  const transaction = readTransactionInput(formData);

  const result = await pool.query(
    `UPDATE "Transaction"
     SET "jenis" = $1, "nominal" = $2, "keterangan" = $3, "tanggal" = $4::timestamp
     WHERE "id" = $5 AND "userId" = $6`,
    [transaction.jenis, transaction.nominal, transaction.keterangan, transaction.tanggal, transactionId, userId],
  );

  if (result.rowCount !== 1) {
    throw new Error("Transaksi tidak ditemukan atau bukan milik pengguna ini.");
  }

  revalidatePath("/transactions");
}

export async function deleteTransaction(formData: FormData) {
  const userId = await getTransactionUserId();
  const transactionId = readTransactionId(formData);

  const result = await pool.query(
    'DELETE FROM "Transaction" WHERE "id" = $1 AND "userId" = $2',
    [transactionId, userId],
  );

  if (result.rowCount !== 1) {
    throw new Error("Transaksi tidak ditemukan atau bukan milik pengguna ini.");
  }

  revalidatePath("/transactions");
}
