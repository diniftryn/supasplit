"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ExpenseForm() {
  const supabase = createClient();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [payerId, setPayerId] = useState("");
  const [participants, setParticipants] = useState(["1", "2", "3"]);
  const [splitPercentage, setSplitPercentage] = useState<number[]>([33.3, 33.3, 33.3]);
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

    const submitExpense = { description, amount, date: new Date(), payer_id: payerId };
    console.log(submitExpense);
    const { data: dataExpense, error: errorExpense } = await supabase.from("expenses").insert(submitExpense).select();
    if (errorExpense) console.log("Unable to add. Error: " + errorExpense);
    console.log("dataExpense " + JSON.stringify(dataExpense));

    if (dataExpense) {
      let submitParticipants = [];
      for (let i = 0; i < participants.length; i++) {
        submitParticipants.push({ expense_id: dataExpense[0].id, user_id: participants[i], share_amount: splitAmounts[i] });
      }
      const { data: dataParticipant, error: errorParticipant } = await supabase.from("participants").insert(submitParticipants);
      if (dataParticipant) console.log(JSON.stringify(dataParticipant) + " successfully added");
      if (errorParticipant) console.log("Unable to add. Error: " + errorParticipant);
    }
  }

  return (
    <div className="w-[50vw]">
      <h2>Add Expense</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2">
        {/* Expense Details */}
        <label htmlFor="description">Expense Description:</label>
        <input type="text" id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} required />

        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" name="amount" value={amount} onChange={e => calculateSplitAmounts(parseInt(e.target.value), splitMethod, splitPercentage)} required />

        {/* Payer Information */}
        <label htmlFor="payer_id">Payer:</label>
        <select id="payerId" name="payer_id" value={payerId} onChange={e => setPayerId(e.target.value)} required>
          <option>Select Payer</option>
          <option value="1">Alice</option>
          <option value="2">Bob</option>
          <option value="3">Charlie</option>
          {/* Add more options as needed */}
        </select>

        {/* Split Method */}
        <label>Split Method:</label>
        <div>
          <input type="radio" id="splitEqually" name="splitMethod" value="equally" checked={splitMethod === "equally"} onChange={() => calculateSplitAmounts(amount, "equally", [33.3, 33.3, 33.3])} />
          <label htmlFor="splitEqually">Split Equally</label>

          <input type="radio" id="customSplit" name="splitMethod" value="custom" checked={splitMethod === "custom"} onChange={() => calculateSplitAmounts(amount, "custom", [0, 0, 0])} />
          <label htmlFor="customSplit">Custom Split</label>

          <div className="grid grid-cols-3">
            <label htmlFor="customAmount1">Alice:</label>
            <input type="number" id="customAmount1" name="splitAmounts" value={splitPercentage[0]} onChange={e => handleSplitPercentageChange(e, 0)} />
            <input type="number" id="customAmount1" name="splitAmounts" value={splitAmounts[0]} readOnly />

            <label htmlFor="customAmount1">Bob:</label>
            <input type="number" id="customAmount2" name="splitAmounts" value={splitPercentage[1]} onChange={e => handleSplitPercentageChange(e, 1)} />
            <input type="number" id="customAmount2" name="splitAmounts" value={splitAmounts[1]} readOnly />

            <label htmlFor="customAmount1">Charlie:</label>
            <input type="number" id="customAmount3" name="splitAmounts" value={splitPercentage[2]} onChange={e => handleSplitPercentageChange(e, 2)} />
            <input type="number" id="customAmount3" name="splitAmounts" value={splitAmounts[2]} readOnly />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
