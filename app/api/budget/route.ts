import { NextResponse } from "next/server";
import { getBudgetSummary, saveBudget } from "@/lib/actions/budgetActions";
import { getTransactionUserId } from "@/lib/transactions";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function isValidMonth(bulan: unknown): bulan is number {
  return (
    typeof bulan === "number" &&
    Number.isSafeInteger(bulan) &&
    bulan >= 1 &&
    bulan <= 12
  );
}

function isValidYear(tahun: unknown): tahun is number {
  return (
    typeof tahun === "number" &&
    Number.isSafeInteger(tahun) &&
    tahun >= 1 &&
    tahun <= 9999
  );
}

function isUnauthorized(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.startsWith("Unauthorized:") || error.message === "User tidak ditemukan.")
  );
}

function handleError(error: unknown) {
  if (isUnauthorized(error)) {
    return json({ error: "Sesi tidak valid. Silakan login kembali." }, 401);
  }

  console.error("Budget API error:", error);
  return json({ error: "Terjadi kesalahan saat memproses anggaran." }, 500);
}

export async function GET(request: Request) {
  try {
    const userId = await getTransactionUserId();
    const { searchParams } = new URL(request.url);
    const bulan = Number(searchParams.get("bulan"));
    const tahun = Number(searchParams.get("tahun"));

    if (!isValidMonth(bulan) || !isValidYear(tahun)) {
      return json({ error: "Bulan dan tahun harus valid." }, 400);
    }

    return json(await getBudgetSummary(userId, bulan, tahun));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getTransactionUserId();
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return json({ error: "Body harus berisi JSON yang valid." }, 400);
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return json({ error: "Data anggaran tidak valid." }, 400);
    }

    const input = body as Record<string, unknown>;
    const { bulan, tahun, jumlahAnggaran } = input;

    if (!isValidMonth(bulan) || !isValidYear(tahun)) {
      return json({ error: "Bulan dan tahun harus valid." }, 400);
    }

    if (
      typeof jumlahAnggaran !== "number" ||
      !Number.isSafeInteger(jumlahAnggaran) ||
      jumlahAnggaran <= 0 ||
      jumlahAnggaran > 2_147_483_647
    ) {
      return json({ error: "Anggaran harus bilangan bulat positif yang valid." }, 400);
    }

    return json(await saveBudget(userId, bulan, tahun, jumlahAnggaran));
  } catch (error) {
    return handleError(error);
  }
}
