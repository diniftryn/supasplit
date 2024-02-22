"use client";

import Image from "next/image";
import Link from "next/link";
import DeleteGroupButton from "./DeleteGroupButton";
import { useQuery } from "@apollo/client";
import { GET_GROUPS } from "@/app/api/graphql/queries";

export default function GroupList() {
  const { loading, error, data } = useQuery(GET_GROUPS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something Went Wrong. Error: {error.message}</p>;

  return (
    <div>
      {data?.groups.length < 0 ? (
        <p>You have no groups yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {data.groups.map((group: any) => (
            <div key={group.id} className="border rounded-xl p-5 flex justify-between items-center">
              <div className="grid gap-y-1">
                <p>
                  {group.groupName}
                  {/* {JSON.stringify(group)} */}
                </p>
                <p>
                  <span>with </span>
                  {group.users.map((user: { username: string }) => {
                    <span>{user.username}</span>;
                  })}
                </p>
                <div className="flex gap-x-2">
                  <Link href={`/groups/${group.id}`}>
                    <button className="bg-blue-300 dark:bg-blue-700 px-2 py-1 rounded-xl">view</button>
                  </Link>
                  <DeleteGroupButton groupId={group.id} />
                </div>
              </div>

              <div>
                <Image src={group.imageUrl} width={100} height={150} alt={group.groupName} className="rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
