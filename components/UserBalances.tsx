"use client";

import { createClient } from "@/utils/supabase/client";
import { useCallback, useState } from "react";

export default function UserBalances({ groupId }: { groupId: any }) {
  const supabase = createClient();
  let owedAmounts = {};
  const [group, setGroup] = useState({});

  useCallback(() => {
    async function getData() {
      const { data: group, error: errorGroup } = await supabase.from("groups").select().eq("id", groupId);
      const { data: expenses, error: errorExpenses } = await supabase.from("expenses").select();
      const { data: participants, error: errorParticipants } = await supabase.from("participants").select();
      const { data: payments, error: errorPayments } = await supabase.from("payments").select();

      if (errorGroup || errorExpenses || errorParticipants || errorPayments) return <p>Unable to fetch User Balances.</p>;
      if (!errorExpenses && !errorParticipants && !errorPayments) {
        owedAmounts = calculateOwedAmounts(expenses, participants, payments);
      }
      if (group) setGroup(group);
    }

    getData();
  }, []);

  return (
    <div>
      {group &&
        group.users.map((user: any) => (
          <p>
            {user} {owedAmounts[user] < 0 ? " is owed " : " owes "} {owedAmounts[user]}
          </p>
        ))}
    </div>
  );
}

function calculateOwedAmounts(expenses: any, participants: any, payments: any) {
  const userBalances: any = {};

  group &&
    group[0].users.forEach((user: any) => {
      userBalances[user] = 0;
      console.log("step 1 group memebers initialize userBalance: " + userBalances);
    });

  participants.forEach((participant: { user_id: string | number; share_amount: number }) => {
    userBalances[participant.user_id] += participant.share_amount;
    console.log("step 2 participants: " + userBalances);
  });

  expenses.forEach((expense: { payer_id: any; amount: number }) => {
    userBalances[expense.payer_id] -= expense.amount;
    console.log("step 3 expenses: " + userBalances);
  });

  payments.forEach((payment: { payer_id: string | number; amount: number; payee_id: string | number }) => {
    userBalances[payment.payer_id] -= payment.amount;
    userBalances[payment.payee_id] += payment.amount;
    console.log("step 4 payments: " + userBalances);
  });

  return userBalances;
}
