import "server-only";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function getTransactionUserId() {
  // 1. Ambil token dari cookie (isinya sekarang string token acak, misal: "a9f8b...")
  const sessionToken = (await cookies()).get("session_user_id")?.value;
  
  if (!sessionToken) {
    throw new Error("Unauthorized: Sesi tidak ditemukan.");
  }

  // 2. Cek ke database: "Token ini milik siapa di tabel Session?"
  const sessionResult = await pool.query<{ userId: number }>(
    'SELECT "userId" FROM "Session" WHERE "token" = $1',
    [sessionToken],
  );

  // Jika token tidak terdaftar di database (artinya token palsu / hasil utak-atik inspect)
  if (sessionResult.rowCount !== 1) {
    throw new Error("Unauthorized: Sesi tidak valid.");
  }

  const userId = sessionResult.rows[0].userId;

  // 3. Validasi tambahan: Pastikan user tersebut benar-benar ada di tabel User
  const userResult = await pool.query<{ id: number }>(
    'SELECT "id" FROM "User" WHERE "id" = $1',
    [userId],
  );

  if (userResult.rowCount !== 1) {
    throw new Error("User tidak ditemukan.");
  }

  // 4. Kembalikan ID user yang sah yang terikat dengan token tersebut
  return userId;
}