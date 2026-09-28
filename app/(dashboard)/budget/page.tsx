import BudgetClient from "@/components/BudgetClient";

export const dynamic = "force-dynamic";

export default function BudgetPage() {
  const now = new Date();
  const initialMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

  return <BudgetClient initialMonth={initialMonth} />;
}
