"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ExpenseForm({ participants, groupId, percentage }: { participants: any; groupId: any; percentage: any[] }) {
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

    const submitExpense = { description, amount, date: new Date(), payer_id: payerId, group_id: groupId };
    console.log(submitExpense);
    const { data: dataExpense, error: errorExpense } = await supabase.from("expenses").insert(submitExpense).select();
    if (errorExpense) console.log("Unable to add. Error: " + errorExpense);
    console.log("dataExpense " + JSON.stringify(dataExpense));

    if (dataExpense) {
      let submitParticipants = [];
      for (let i = 0; i < participants.length; i++) {
        submitParticipants.push({ expense_id: dataExpense[0].id, user_id: participants[i], share_amount: splitAmounts[i] });
      }
      const { data: dataParticipant, error: errorParticipant } = await supabase.from("participants").insert(submitParticipants).select();
      if (errorParticipant) console.log("Unable to add. Error: " + errorParticipant);
      if (dataParticipant) {
        console.log(JSON.stringify(dataParticipant) + " successfully added");
        router.push(`/groups/${groupId}`);
      }
    }
  }

  return (
    <div className="w-[50vw]">
      <h2 className="header-title mb-10">Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-y-3">
          <label htmlFor="groupId">group_id</label>
          <input type="text" id="groupId" name="groupId" value={groupId} readOnly />

          <label htmlFor="description">Expense Description:</label>
          <input type="text" id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} required />

          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" name="amount" value={amount} onChange={e => calculateSplitAmounts(parseInt(e.target.value), splitMethod, splitPercentage)} required />

          <label htmlFor="payer_id">Payer:</label>
          <select id="payerId" name="payer_id" value={payerId} onChange={e => setPayerId(e.target.value)} required>
            <option>Select Payer</option>
            {participants.map(user => (
              <option value={user}>{user}</option>
            ))}
          </select>

          <label>Split Method:</label>
          <div>
            <input type="radio" id="splitEqually" name="splitMethod" value="equally" checked={splitMethod === "equally"} onChange={() => calculateSplitAmounts(amount, "equally", [33.3, 33.3, 33.3])} />
            <label htmlFor="splitEqually">Split Equally</label>

            <input type="radio" id="customSplit" name="splitMethod" value="custom" checked={splitMethod === "custom"} onChange={() => calculateSplitAmounts(amount, "custom", [0, 0, 0])} />
            <label htmlFor="customSplit">Custom Split</label>

            <div>
              {participants.map((user, index) => (
                <div key={index} className="grid grid-cols-3">
                  <label htmlFor="customAmount1">{user}</label>
                  <input type="number" id="customAmount1" name="splitAmounts" value={splitPercentage[index]} onChange={e => handleSplitPercentageChange(e, index)} />
                  <input type="number" id="customAmount1" name="splitAmounts" value={splitAmounts[index]} readOnly />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="py-2 px-5 bg-lime-300 rounded-3xl">
          Submit
        </button>
      </form>
    </div>
  );
}
