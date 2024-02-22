"use client";

import { ADD_GROUP } from "@/app/api/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GroupForm({ availableUsers }: { availableUsers: [] }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    groupName: "",
    selectedUsers: [],
    imageUrl: ""
  });

  const submitData = {
    groupName: formData.groupName,
    imageUrl: formData.imageUrl,
    usersId: formData.selectedUsers.map(String)
  };
  const [addGroup] = useMutation(ADD_GROUP, {
    variables: submitData
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.groupName || !formData.selectedUsers) {
      return alert("Please fill in all fields");
    }

    console.log(submitData);
    addGroup({ variables: submitData }).then(() => {
      setFormData({
        groupName: "",
        selectedUsers: [],
        imageUrl: ""
      });
      router.push("/");
    });
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
              availableUsers.map((user: { id: string; username: string }) => (
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
