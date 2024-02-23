import { createClient } from "@/utils/supabase/server";
import GroupListItem from "./GroupListItem";

export default async function GroupList() {
  const supabase = createClient();
  const { data, error } = await supabase.from("groups").select();

  if (error) return <p>Something went wrong.</p>;
  if (data.length < 1) return <p>You have no groups yet.</p>;
  if (data.length > 0)
    return (
      <div className="grid md:grid-cols-2 gap-5">
        {data.map(group => (
          <GroupListItem key={group.id} group={group} />
        ))}
      </div>
    );
}
