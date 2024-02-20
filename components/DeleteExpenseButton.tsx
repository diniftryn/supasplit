"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteExpenseButton({ expenseId, groupId }: { expenseId: string; groupId: string }) {
  const router = useRouter();

  async function handleDelete() {
    const supabase = createClient();
    const { error: errorExpenses } = await supabase.from("expenses").delete().eq("id", expenseId);
    if (errorExpenses) return <p>Unable to delete. Error: {JSON.stringify(errorExpenses)}</p>;
    if (!errorExpenses) {
      const { error: errorParticipants } = await supabase.from("participants").delete().eq("expense_id", expenseId);
      if (errorParticipants) return <p>Unable to delete. Error: {JSON.stringify(errorExpenses)}</p>;
      if (!errorParticipants) router.push(`/groups/${groupId}`);
    }
  }

  return (
    <form action={handleDelete}>
      <button className="bg-lime-300 dark:bg-lime-700 px-2 py-1 rounded-xl">delete</button>
    </form>
  );
}
