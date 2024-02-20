import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function GroupList() {
  const supabase = createClient();
  const { data, error } = await supabase.from("groups").select();

  if (error) return <p>Something went wrong.</p>;
  if (data.length < 1) return <p>You have no groups yet.</p>;
  if (data.length > 0)
    return (
      <div className="grid grid-cols-2 gap-5">
        {data.map(group => (
          <div key={group.id} className="border rounded-xl p-5 flex justify-between items-center">
            <div>
              <p>{group.name}</p>
              <p>{group.users}</p>
              <Link href={`/groups/${group.id}`}>
                <button className="bg-lime-300 px-2 py-1 rounded-xl">view</button>
              </Link>
            </div>
            <div>
              <Image src={group.imageUrl} width={100} height={150} alt={group.name} className="rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
}
