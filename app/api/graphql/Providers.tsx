"use client";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";

// const endpoint = process.env.VERCEL_URL;
const endpoint = "http://localhost:3000/";

export const Providers = ({ children }: { children: ReactNode }) => {
  const client = new ApolloClient({
    uri: endpoint + "api/graphql",
    cache: new InMemoryCache()
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
