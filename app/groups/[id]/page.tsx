"use client";

import ExpensesList from "@/components/ExpensesList";
import UserBalances from "@/components/UserBalances";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

export default function GroupIndex() {
  const { id } = useParams();

  return (
    <main>
      <div className="flex justify-between">
        <h2 className="font-bold text-4xl mb-4">All Expenses</h2>
        <Link href={`/expenses/new/${id}`}>
          <button className="bg-purple-300 px-3 py-2 rounded-3xl">+ New Expense</button>
        </Link>
      </div>
      <ExpensesList groupId={id} />
      {/* <UserBalances /> */}
    </main>
  );
}
