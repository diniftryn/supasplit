import ExpensesList from "@/components/ExpensesList";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return !user ? (
    <Header />
  ) : (
    <main className="flex-1 flex flex-col gap-6">
      <div className="flex justify-between">
        <h2 className="font-bold text-4xl mb-4">All Expenses</h2>
        <Link href="/new">
          <button className="bg-purple-300 px-3 py-2 rounded-3xl">+ Add New Expense</button>
        </Link>
      </div>
      <ExpensesList />
    </main>
  );
}
