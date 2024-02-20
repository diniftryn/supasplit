"use client";

import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import ExpenseForm from "@/components/ExpenseForm";

export default async function NewExpense() {
  const { id } = useParams();

  const supabase = createClient();

  function calculateSplitPercentage() {
    const percentage: number[] = [];
    if (data) data[0].users.forEach(() => percentage.push(100 / data[0].users.length));
    return percentage;
  }

  const { data, error } = await supabase.from("groups").select().eq("id", id);

  if (error) return <p>Group with id {id} doesn't exist.</p>;
  if (data.length > 0) return <ExpenseForm participants={data[0].users} groupId={id} percentage={() => calculateSplitPercentage} />;
}
