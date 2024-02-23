"use client";

import { createClient } from "@/utils/supabase/client";

export default async function UserBalances({ groupId }: { groupId: any }) {
  const supabase = createClient();
  let owedAmounts = {};

  const { data: group, error: errorGroup } = await supabase.from("groups").select().eq("id", groupId);
  const { data: expenses, error: errorExpenses } = await supabase.from("expenses").select();
  const { data: participants, error: errorParticipants } = await supabase.from("participants").select();
  const { data: payments, error: errorPayments } = await supabase.from("payments").select();

  if (errorGroup || errorExpenses || errorParticipants || errorPayments) return <p>Unable to fetch User Balances.</p>;
  if (!errorExpenses && !errorParticipants && !errorPayments) {
    owedAmounts = calculateOwedAmounts(expenses, participants, payments, group);
  }

  const { data: users, error: errorUsers } = await supabase.from("users").select().in("id", group[0].userIds);
  console.log(JSON.stringify(users));

  return (
    <div>
      {group &&
        group[0].userIds.map((userId: any) => (
          <p>
            {userId}
            {owedAmounts[userId] < 0 ? " is owed " : " owes "} {owedAmounts[userId]}
          </p>
        ))}
    </div>
  );
}

function calculateOwedAmounts(expenses: any, participants: any, payments: any, group: any) {
  const userBalances: any = {};

  group &&
    group[0].userIds.forEach((user: any) => {
      userBalances[user] = 0;
      console.log("step 1 group memebers initialize userBalance: " + userBalances);
    });

  participants.forEach((participant: { userId: string | number; shareAmount: number }) => {
    userBalances[participant.userId] += participant.shareAmount;
    console.log("step 2 participants: " + userBalances);
  });

  expenses.forEach((expense: { payerId: any; amount: number }) => {
    userBalances[expense.payerId] -= expense.amount;
    console.log("step 3 expenses: " + userBalances);
  });

  payments.forEach((payment: { payerId: string | number; amount: number; payeeId: string | number }) => {
    userBalances[payment.payerId] -= payment.amount;
    userBalances[payment.payeeId] += payment.amount;
    console.log("step 4 payments: " + userBalances);
  });

  return userBalances;
}
