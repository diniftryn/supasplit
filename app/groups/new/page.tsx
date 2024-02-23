"use client";

import GroupForm from "@/components/GroupForm";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

export default function NewGroup() {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  const supabase = createClient();

  async function getUsers() {
    const { data, error } = await supabase.from("users").select();
    if (error) return <p>Something went wrong.</p>;
    if (data) setAvailableUsers(data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h2 className="header-title mb-10">Create Group</h2>

      <GroupForm availableUsers={availableUsers} />
    </div>
  );
}
