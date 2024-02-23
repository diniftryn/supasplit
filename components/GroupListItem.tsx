import Image from "next/image";
import Link from "next/link";
import DeleteGroupButton from "./DeleteGroupButton";
import { createClient } from "@/utils/supabase/server";

export default async function GroupListItem({ group }: { group: Group }) {
  const supabase = createClient();

  const { data: groupUsers, error } = await supabase.from("users").select().in("id", group.userIds);
  if (error) console.log("Unable to fetch group users. Error: " + error);
  if (groupUsers) console.log("groupUsers: " + JSON.stringify(groupUsers));

  return (
    <div key={group.id} className="border rounded-xl p-5 flex justify-between items-center gap-x-2">
      <div className="grid gap-y-1">
        <p>{group.name}</p>
        <p className="flex gap-x-1">
          <span>with</span>
          {groupUsers && groupUsers.map(user => <span>{user.username}</span>)}
        </p>
        <div className="flex gap-x-2 pt-3">
          <Link href={`/groups/${group.id}`}>
            <button className="bg-blue-300 dark:bg-blue-700 px-2 py-1 rounded-xl">view</button>
          </Link>
          <DeleteGroupButton groupId={group.id as string} />
        </div>
      </div>

      <div>
        <Image src={group.imageUrl} width={120} height={120} alt={group.name} className="rounded-full" />
      </div>
    </div>
  );
}
