"use client";

import { createClient } from "@/utils/supabase/client";

export default async function GroupDetails({ groupId }: { groupId: any }) {
  const supabase = createClient();

  const { data: group } = await supabase.from("groups").select().eq("id", groupId);
  if (group) {
    const { data: groupUsers, error } = await supabase.from("users").select().in("id", group.userIds);
    if (error) console.log("Unable to fetch group users. Error: " + error);

    return (
      <div>
        <h2 className="font-bold text-4xl mb-3 md:mb-0">{group.name}</h2>
        <p>
          {groupUsers?.map(user => (
            <span>{user.username}</span>
          ))}
        </p>
      </div>
    );
  }
}
