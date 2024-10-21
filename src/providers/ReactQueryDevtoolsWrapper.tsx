"use client"

import React, { Suspense } from "react"

// React.lazy를 사용해 ReactQueryDevtools를 지연 로딩
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
)

const ReactQueryDevtoolsWrapper = () => {
  return (
    <Suspense fallback={null}>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtoolsProduction initialIsOpen={false} />
      )}
    </Suspense>
  )
}

export default ReactQueryDevtoolsWrapper
