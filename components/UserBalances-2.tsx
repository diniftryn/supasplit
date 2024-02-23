"use client";

import { createClient } from "@/utils/supabase/client";

export default async function UserBalances({ groupId }: { groupId: any }) {
  const result = await calculateNetBalances(groupId);

  return <p>{JSON.stringify(result)}</p>;
}

// Function to calculate net balances
async function calculateNetBalances(groupId: number) {
  const supabase = createClient();
  let expenseIds = [];
  let userIds = [];

  const { data: group, error: groupError } = await supabase.from("groups").select().eq("id", groupId);
  if (groupError) {
    console.error("Error fetching group:", groupError.message);
    return [];
  } else {
    expenseIds = group[0].expenseIds;
    userIds = group[0].userIds;
  }

  const { data: expensesPaid, error: expensesPaidError } = await supabase.from("expenses").select().eq("groupId", groupId);
  if (expensesPaidError) {
    console.error("Error fetching expenses paid:", expensesPaidError.message);
    return [];
  }

  // Fetch individual expenses
  const { data: participants, error: participantsError } = await supabase.from("participants").select().in("expenseId", expenseIds);

  if (participantsError) {
    console.error("Error fetching participants:", participantsError.message);
    return [];
  }

  // Fetch individual payments received
  const { data: paymentsReceived, error: paymentsReceivedError } = await supabase.from("payments").select("payeeId, amount").in("payerId", userIds);

  if (paymentsReceivedError) {
    console.error("Error fetching individual payments received:", paymentsReceivedError.message);
    return [];
  }

  // Fetch individual payments made
  const { data: paymentsMade, error: paymentsMadeError } = await supabase.from("payments").select("payerId, amount").in("payerId", userIds);

  if (paymentsMadeError) {
    console.error("Error fetching individual payments made:", paymentsMadeError.message);
    return [];
  }

  console.log("expensesPaid: " + JSON.stringify(expensesPaid));
  console.log("participants: " + JSON.stringify(participants));
  console.log("paymentsReceived: " + JSON.stringify(paymentsReceived));
  console.log("paymentsMade: " + JSON.stringify(paymentsMade));

  const netBalances = userIds.forEach((id: any) => netBalances.push({ userId: id, net_balance: 0 }));

  netBalances.map((userBalance: any) => {
    expensesPaid.forEach(expense => {
      if (expense.payerId === userBalance.userId) userBalance.net_balance -= expense.amount;
    });
    participants.forEach(participant => {
      if (participant.userId === userBalance.userId) userBalance.net_balance += participant.shareAmount;
    });
    paymentsMade.forEach(payment => {
      if (payment.payerId === userBalance.userId) userBalance.net_balance -= payment.amount;
    });
    paymentsReceived.forEach(payment => {
      if (payment.payeeId === userBalance.userId) userBalance.net_balance += payment.amount;
    });
  });

  // // Organize data into a map for easier access
  // const expensesPaidMap = new Map(expensesPaid.map(expense => [expense.userId, expense.amount]));
  // const participantsMap = new Map(participants.map(participant => [participant.userId, participant]));
  // const paymentsReceivedMap = new Map(paymentsReceived.map(payment => [payment.payeeId, payment.amount]));
  // const paymentsMadeMap = new Map(paymentsMade.map(payment => [payment.payerId, payment.amount]));

  // // Perform calculations and create the final result
  // const netBalances = Array.from(participantsMap.values()).map(participant => {
  //   const totalPaymentsReceived = paymentsReceivedMap.get(participant.userId) || 0;
  //   const totalPaymentsMade = paymentsMadeMap.get(participant.userId) || 0;
  //   const totalExpensesPaid = expensesPaidMap.get(participant.userId) || 0;

  //   return {
  //     userId: participant.userId,
  //     net_balance: participant.amount + totalPaymentsReceived - totalPaymentsMade - totalExpensesPaid
  //   };
  // });

  return netBalances;
}
