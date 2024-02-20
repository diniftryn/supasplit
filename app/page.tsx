import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import GroupList from "@/components/GroupList";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return !user ? (
    <Header />
  ) : (
    <main>
      <div className="flex justify-between">
        <h2 className="font-bold text-4xl mb-4">All Groups</h2>
        <Link href="/groups/new">
          <button className="bg-purple-300 px-3 py-2 rounded-3xl">+ New Group</button>
        </Link>
      </div>
      <GroupList />
    </main>
  );
}
