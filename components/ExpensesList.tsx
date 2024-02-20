import { createClient } from "@/utils/supabase/server";

export default async function ExpensesList() {
  const supabase = createClient();
  const { data, error } = await supabase.from("expenses").select();

  if (error) return <p>Something went wrong.</p>;
  if (data)
    return (
      <div className="grid grid-cols-2 gap-5">
        {data.map(expense => (
          <div key={expense.id} className="border rounded-xl p-5">
            <p>{expense.description}</p>
            <p>{expense.amount}</p>
            <p>{expense.date}</p>
            <p>Paid by: {expense.payer_id}</p>
            <button className="bg-lime-300 px-2 py-1 rounded-xl">delete</button>
          </div>
        ))}
      </div>
    );
}
