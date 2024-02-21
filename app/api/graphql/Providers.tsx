"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { ReactNode } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const Providers = ({ children }: { children: ReactNode }) => {
  const client = new ApolloClient({
    uri: supabaseUrl,
    cache: new InMemoryCache()
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
