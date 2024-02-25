"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ExpenseForm({ participants, group, percentage }: { participants: User[]; group: Group; percentage: number[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [payerId, setPayerId] = useState("");
  const [splitPercentage, setSplitPercentage] = useState<number[]>(percentage);
  const [splitMethod, setSplitMethod] = useState("equally");
  const [splitAmounts, setSplitAmounts] = useState<number[]>([]);

  function calculateSplitAmounts(amount: number, method: string, percentage: number[]) {
    const splitAmounts = [];

    for (let i = 0; i < participants.length; i++) {
      splitAmounts[i] = (percentage[i] / 100) * amount;
    }
    setAmount(amount);
    setSplitMethod(method);
    setSplitPercentage(percentage);
    setSplitAmounts(splitAmounts);
  }

  function handleSplitPercentageChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    const { value } = event.target;
    const newPercentage = [...splitPercentage];
    newPercentage[index] = parseInt(value);
    setSplitPercentage(newPercentage);
    const newSplitAmounts = [...splitAmounts];
    newSplitAmounts[index] = (parseInt(value) / 100) * amount;
    setSplitAmounts(newSplitAmounts);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const submitExpense = { description, amount, payerId, createdAt: new Date(), groupId: group.id };
    console.log(submitExpense);
    const { data: dataExpense, error: errorExpense } = await supabase.from("expenses").insert(submitExpense).select();
    if (errorExpense) console.log("Unable to add. Error: " + JSON.stringify(errorExpense));
    console.log("dataExpense " + JSON.stringify(dataExpense));

    if (dataExpense) {
      let submitParticipants = [];
      for (let i = 0; i < participants.length; i++) {
        submitParticipants.push({ expenseId: dataExpense[0].id, userId: participants[i].id, shareAmount: splitAmounts[i] });
      }
      const { data: dataParticipant, error: errorParticipant } = await supabase.from("participants").insert(submitParticipants).select();
      if (errorParticipant) console.log("Unable to add. Error: " + errorParticipant);
      if (dataParticipant) {
        console.log(JSON.stringify(dataParticipant) + " successfully added");

        const expenseIdsToUpdate = group.expenseIds ? [...group.expenseIds, dataExpense[0].id] : [dataExpense[0].id];

        const { data: dataUpdateGroupExpenses, error: errorUpdateGroupExpenses } = await supabase.from("groups").update({ expenseIds: expenseIdsToUpdate }).eq("id", group.id).select();

        if (errorUpdateGroupExpenses) {
          console.log("Unable to update group users. Error: " + JSON.stringify(errorUpdateGroupExpenses));
          return router.push("/groups/new?message=Could not update group users");
        }
        if (!errorUpdateGroupExpenses) {
          console.log("dataUpdateGroupExpenses " + JSON.stringify(dataUpdateGroupExpenses));
          router.push(`/groups/${group.id}`);
        }
      }
    }
  }

  return (
    <div>
      <h2 className="header-title mb-10">Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-y-3 pb-5">
          <label htmlFor="description">Expense Description:</label>
          <input type="text" id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} required />

          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" name="amount" value={amount} onChange={e => calculateSplitAmounts(parseInt(e.target.value), splitMethod, splitPercentage)} required />

          <label htmlFor="payerId">Payer:</label>
          <select id="payerId" name="payerId" value={payerId} onChange={e => setPayerId(e.target.value)} required>
            <option>Select Payer</option>
            {participants.map((user: any) => (
              <option value={user.id}>{user.username}</option>
            ))}
          </select>

          <label>Split Method:</label>
          <div>
            <input className="mr-1" type="radio" id="splitEqually" name="splitMethod" value="equally" checked={splitMethod === "equally"} onChange={() => calculateSplitAmounts(amount, "equally", percentage)} />
            <label className="pr-2" htmlFor="splitEqually">
              Split Equally
            </label>

            <input className="mr-1" type="radio" id="customSplit" name="splitMethod" value="custom" checked={splitMethod === "custom"} onChange={() => calculateSplitAmounts(amount, "custom", Array(participants.length).fill(0))} />
            <label htmlFor="customSplit">Custom Split</label>

            <div>
              {participants.map((user: User, index: number) => (
                <div key={index} className="grid grid-cols-3">
                  <label htmlFor="customAmount1">{user.username}</label>
                  <input className="mx-2" type="number" id="customAmount1" name="splitAmounts" value={splitPercentage[index]} onChange={e => handleSplitPercentageChange(e, index)} />
                  <input type="number" id="customAmount1" name="splitAmounts" value={splitAmounts[index]} readOnly />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-5">
          <button type="submit" className="py-2 px-5 bg-lime-300 dark:bg-lime-700 rounded-3xl">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
