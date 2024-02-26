import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-semibold text-lg mb-4">
            Authentication successful. Go to{" "}
            <Link href="/" className="text-lime-300 border-b border-b-transparent hover:border-b-lime-300">
              home
            </Link>{" "}
            to start tracking your shared expenses.
          </h2>
        </main>
      </div>
    </div>
  );
}
