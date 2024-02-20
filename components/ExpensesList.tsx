"use client";

import { createClient } from "@/utils/supabase/client";
import DeleteExpenseButton from "./DeleteExpenseButton";

export default async function ExpensesList({ groupId }: { groupId: any }) {
  const supabase = createClient();
  const { data, error } = await supabase.from("expenses").select().eq("group_id", groupId);

  if (error) return <p>Something went wrong.</p>;
  if (data.length < 1) return <p>No expenses</p>;
  if (data.length > 0)
    return (
      <div className="grid md:grid-cols-2 gap-5">
        {data.map(expense => (
          <div key={expense.id} className="border rounded-xl p-5">
            <p>{expense.description}</p>
            <p>{expense.amount}</p>
            <p>{expense.date}</p>
            <p>Paid by: {expense.payer_id}</p>
            <DeleteExpenseButton expenseId={expense.id} groupId={groupId} />
          </div>
        ))}
      </div>
    );
}
