"use client";

const { createClient } = require("@supabase/supabase-js");
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function GroupForm({ availableUsers }: { availableUsers: User[] }) {
  const router = useRouter();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const [formData, setFormData] = useState({
    groupName: "",
    selectedUsers: [],
    imageUrl: ""
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUserSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({
      ...prevData,
      selectedUsers: prevData.selectedUsers.includes(Number(value)) ? prevData.selectedUsers.filter((userId: any) => userId !== Number(value)) : [...prevData.selectedUsers, Number(value)]
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);

    const submitData = { name: formData.groupName, imageUrl: formData.imageUrl, userIds: formData.selectedUsers };
    const { data: dataCreateGroup, error: errorCreateGroup } = await supabase.from("groups").insert(submitData).select();
    if (errorCreateGroup) {
      console.log("Unable to add. Error: " + errorCreateGroup);
      return router.push("/groups/new?message=Could not create group");
    }
    if (!errorCreateGroup) {
      formData.selectedUsers.map(async userId => {
        const user = availableUsers.find(user => user.id === userId);
        const groupIdsToUpdate = user?.groupIds ? [...user.groupIds, dataCreateGroup[0].id] : [dataCreateGroup[0].id];

        const { data: dataUpdateUserGroup, error: errorUpdateUserGroup } = await supabase.from("users").update({ groupIds: groupIdsToUpdate }).eq("id", userId).select();

        if (errorUpdateUserGroup) {
          console.log("Unable to update group users. Error: " + JSON.stringify(errorUpdateUserGroup));
          return router.push("/groups/new?message=Could not update group users");
        }
        if (!errorUpdateUserGroup) {
          console.log("dataUpdateUserGroup " + JSON.stringify(dataUpdateUserGroup));
        }
      });
      alert("Group was successfully added!");
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-y-3 pb-5">
        <label htmlFor="groupName">Group Name:</label>
        <input type="text" id="groupName" name="groupName" value={formData.groupName} onChange={handleChange} required />

        <label htmlFor="groupImage">Group Image:</label>
        <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />

        <label>Users:</label>
        <div>
          {availableUsers.length > 0 ? (
            availableUsers.map(user => (
              <div key={user.id}>
                <input type="checkbox" id={`user${user.id}`} name="selectedUsers" value={user.id} checked={formData.selectedUsers.includes(user.id as never)} onChange={handleUserSelection} />
                <label htmlFor={`user${user.id}`} className="ml-2">
                  {user.username}
                </label>
              </div>
            ))
          ) : (
            <p>No users</p>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-5">
        <button type="submit" className="py-2 px-5 bg-lime-300 dark:bg-lime-700 rounded-3xl">
          Create Group
        </button>
      </div>
    </form>
  );
}
