"use client";

import { GET_USERS } from "@/app/api/graphql/queries";
import GroupForm from "@/components/GroupForm";
import { useQuery } from "@apollo/client";
import React from "react";

export default function NewGroup() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something Went Wrong. Error: {error.message}</p>;
  if (data) return <GroupForm availableUsers={data.users} />;
}
