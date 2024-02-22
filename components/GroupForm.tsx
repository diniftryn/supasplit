"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function GroupForm() {
  const router = useRouter();

  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    groupName: "",
    selectedUsers: [],
    imageUrl: ""
  });

  const supabase = createClient();

  async function getUsers() {
    const { data, error } = await supabase.from("users").select();
    if (error) return <p>Something went wrong.</p>;
    if (data) setAvailableUsers(data);
  }

  useEffect(() => {
    getUsers();
  }, []);

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
      selectedUsers: prevData.selectedUsers.includes(Number(value)) ? prevData.selectedUsers.filter((userId: any) => userId !== Number(value)) : [...prevData.selectedUsers, Number(value)]
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);

    const submitData = { name: formData.groupName, users: formData.selectedUsers, imageUrl: formData.imageUrl };
    const { data: dataExpense, error: errorExpense } = await supabase.from("groups").insert(submitData).select();
    if (errorExpense) console.log("Unable to add. Error: " + errorExpense);
    console.log("dataExpense " + JSON.stringify(dataExpense));
    if (!errorExpense) {
      alert("Group was successfully added!");
      router.push("/");
    }
  };

  return (
    <div>
      <h2 className="header-title mb-10">Create Group</h2>

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

        <button type="submit" className="py-2 px-5 bg-lime-300 dark:bg-lime-700 rounded-3xl">
          Create Group
        </button>
      </form>
    </div>
  );
}
