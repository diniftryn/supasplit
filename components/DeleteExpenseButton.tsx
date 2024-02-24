"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteExpenseButton({ expenseId, groupId }: { expenseId: string; groupId: string }) {
  const router = useRouter();

  const supabase = createClient();

  async function handleDelete() {
    const { error: errorExpenses } = await supabase.from("expenses").delete().eq("id", expenseId);
    if (errorExpenses) return <p>Unable to delete. Error: {JSON.stringify(errorExpenses)}</p>;
    if (!errorExpenses) {
      const { error: errorParticipants } = await supabase.from("participants").delete().eq("expenseId", expenseId);
      if (errorParticipants) return <p>Unable to delete. Error: {JSON.stringify(errorExpenses)}</p>;
      if (!errorParticipants) {
        console.log("participants successfully deleted");

        const { data: group } = await supabase.from("groups").select().eq("id", groupId);
        const expenseIdsToUpdate = group && group[0].expenseIds && group[0].expenseIds.filter((id: string) => id !== expenseId);

        const { data: dataUpdateGroupExpenses, error: errorUpdateGroupExpenses } = await supabase.from("groups").update({ expenseIds: expenseIdsToUpdate }).eq("id", groupId).select();

        if (errorUpdateGroupExpenses) {
          console.log("Unable to update group users. Error: " + JSON.stringify(errorUpdateGroupExpenses));
          // return router.push("/groups/new?message=Could not update group expenses");
        }
        if (!errorUpdateGroupExpenses) {
          console.log("dataUpdateGroupExpenses " + JSON.stringify(dataUpdateGroupExpenses));
          // router.push(`/groups/${groupId}`);
        }
      }
    }
  }

  return (
    <form action={handleDelete}>
      <button className="bg-lime-300 dark:bg-lime-700 px-2 py-1 rounded-xl">delete</button>
    </form>
  );
}
