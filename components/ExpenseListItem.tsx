"use client";

import formatDate from "@/utils/formatDate";
import DeleteExpenseButton from "./DeleteExpenseButton";
import { createClient } from "@/utils/supabase/client";

export default async function ExpenseListItem({ expense, groupId }: { expense: Expense; groupId: string }) {
  const supabase = createClient();

  const { data: payer, error } = await supabase.from("users").select().eq("id", expense.payerId);
  if (error) console.log("Unable to fetch group users. Error: " + error);
  if (payer) console.log("payer: " + JSON.stringify(payer));

  return (
    <div key={expense.id} className="border rounded-xl p-5">
      <p>{expense.description}</p>
      <p>Amount: ${expense.amount}</p>
      <p>Paid by: {payer && payer[0].username}</p>
      <p className="py-2 text-sm text-gray-600">{formatDate(expense.createdAt)}</p>
      <DeleteExpenseButton expenseId={expense.id as string} groupId={groupId} />
    </div>
  );
}
