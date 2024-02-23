"use client";

import { createClient } from "@/utils/supabase/client";
import ExpenseListItem from "./ExpenseListItem";

export default async function ExpensesList({ groupId }: { groupId: any }) {
  const supabase = createClient();

  const { data, error } = await supabase.from("expenses").select().eq("groupId", groupId);
  if (error) return <p>Something went wrong.</p>;
  if (data.length < 1) return <p>No expenses</p>;
  if (data.length > 0)
    return (
      <div className="grid md:grid-cols-2 gap-5">
        {data.map(expense => (
          <ExpenseListItem expense={expense} groupId={groupId} />
        ))}
      </div>
    );
}
