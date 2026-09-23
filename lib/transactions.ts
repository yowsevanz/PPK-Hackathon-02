import "server-only";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function getTransactionUserId() {
  const sessionUserId = (await cookies()).get("session_user_id")?.value;
  if (!sessionUserId || !/^\d+$/.test(sessionUserId)) {
    throw new Error("Unauthorized");
  }

  const userId = Number(sessionUserId);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("Unauthorized");
  }

  const result = await pool.query<{ id: number }>(
    'SELECT "id" FROM "User" WHERE "id" = $1',
    [userId],
  );

  if (result.rowCount !== 1) {
    throw new Error("The development transaction user (id=1) does not exist.");
  }

  return userId;
}
