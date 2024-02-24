"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteGroupButton({ group, groupUsers }: { group: Group; groupUsers: User[] }) {
  const router = useRouter();

  const supabase = createClient();

  async function handleDelete() {
    const { error: errorGroup } = await supabase.from("groups").delete().eq("id", group.id);
    if (errorGroup) return <p>Unable to delete. Error: {JSON.stringify(errorGroup)}</p>;
    if (!errorGroup) {
      //remove groupId from user's groupIds
      group.userIds.map(async userId => {
        const user = groupUsers.find(user => user.id === userId);
        const groupIdsToUpdate = user?.groupIds && user.groupIds.filter((id: string) => id !== group.id);

        const { data: dataUpdateUserGroup, error: errorUpdateUserGroup } = await supabase.from("users").update({ groupIds: groupIdsToUpdate }).eq("id", userId).select();

        if (errorUpdateUserGroup) {
          console.log("Unable to update user groups. Error: " + JSON.stringify(errorUpdateUserGroup));
          return router.push("/groups/new?message=Could not update group users");
        }
        if (!errorUpdateUserGroup) {
          console.log("dataUpdateUserGroup " + JSON.stringify(dataUpdateUserGroup));
        }
      });

      const { error: errorExpenses } = await supabase.from("expenses").delete().eq("groupId", group.id).select();
      if (errorExpenses) return <p>Unable to delete. Error: {JSON.stringify(errorExpenses)}</p>;
      if (!errorExpenses) {
        router.push("/");
      }
    }
  }

  return (
    <form action={handleDelete}>
      <button className="bg-lime-300 dark:bg-lime-700 px-2 py-1 rounded-xl">delete</button>
    </form>
  );
}
