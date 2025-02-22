"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import ReactQueryDevtoolsWrapper from "./ReactQueryDevtoolsWrapper"

const QueryProvider = ({ children }: React.PropsWithChildren) => {
  const [client] = React.useState(new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <ReactQueryDevtoolsWrapper />
    </QueryClientProvider>
  )
}

export default QueryProvider
