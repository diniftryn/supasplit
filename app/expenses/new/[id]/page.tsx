"use client";

import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import ExpenseForm from "@/components/ExpenseForm";

export default async function NewExpense() {
  const { id } = useParams();

  let group = { id: "", name: "", imageUrl: "", userIds: [], expenseIds: [] };
  let splitPercentage: number[] = [];
  let users = [];

  const supabase = createClient();

  const { data, error } = await supabase.from("groups").select().eq("id", id);

  if (data) {
    group = data[0];
    console.log(group);
    splitPercentage = Array(group.userIds.length).fill(100 / group.userIds.length);
    console.log(splitPercentage);

    const { data: groupUsers, error } = await supabase.from("users").select().in("id", group.userIds);
    if (error) console.log("Unable to fetch group users. Error: " + error);
    if (groupUsers) {
      console.log("groupUsers: " + JSON.stringify(groupUsers));
      users = groupUsers;
    }
  }
  if (error) return <p>Group with id {id} doesn't exist.</p>;
  if (data.length > 0) return <ExpenseForm participants={users} group={group} percentage={splitPercentage} />;
}
