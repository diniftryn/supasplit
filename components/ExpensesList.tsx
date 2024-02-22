"use client";

import { useQuery } from "@apollo/client";
import DeleteExpenseButton from "./DeleteExpenseButton";
import { GET_GROUP } from "@/app/api/graphql/queries";

export default function ExpensesList({ groupId }: { groupId: any }) {
  let group = { groupName: "" };
  let expenses = [];
  const { loading, error, data } = useQuery(GET_GROUP, { variables: { id: parseInt(groupId) } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something Went Wrong. Error: {error.message}</p>;
  if (data) {
    group = data.group;
    expenses = data.group.expenses;
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <p>{group.groupName}</p>
      {expenses.length < 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <div>
          {expenses.map((expense: any) => (
            <div key={expense.id} className="border rounded-xl p-5">
              <p>{expense.description}</p>
              <p>{expense.amount}</p>
              <p>{expense.createdAt}</p>
              <p>Paid by: {expense.payerId}</p>
              <DeleteExpenseButton expenseId={expense.id} groupId={groupId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
