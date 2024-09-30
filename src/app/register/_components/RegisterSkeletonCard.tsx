import React from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Card, CardHeader, CardFooter } from "@/components/ui/card"

const RegisterSkeletonCard = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-800">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-xl bg-white">
        <CardHeader className="text-center">
          <Skeleton height={100} width={250} className="mx-auto mb-4" />
        </CardHeader>
        <div className="space-y-4">
          <Skeleton height={50} className="rounded-lg" />
          <Skeleton height={50} className="rounded-lg" />
          <Skeleton height={50} className="rounded-lg" />
          <Skeleton height={50} className="rounded-lg" />
        </div>
        <CardFooter className="flex justify-between space-x-2 mt-8">
          <Skeleton height={50} width="48%" className="rounded-lg" />
          <Skeleton height={50} width="48%" className="rounded-lg" />
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterSkeletonCard
