"use client"
import { LoginSchema, LoginType } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import useUserStore from "@/store/useUserStore"
import CommonInputField from "@/components/common/CommonInputField"
import LoginSkeletonCard from "./LoginSkeletonCard"

const LoginPage = () => {
  const { handleLogin, goToRegisterPage, loading } = useAuth()
  const { email } = useUserStore()

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: email,
    },
  })

  if (loading) {
    return <LoginSkeletonCard />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-800">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-xl bg-white">
        <CardHeader className="text-center">
          <Image
            width={250}
            height={100}
            src="/share life.png"
            alt="Logo Image"
            className="mx-auto mb-4"
            loading="lazy"
          />
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
            <CommonInputField form={form} name="email">
              {({ ...field }) => (
                <Input {...field} type="email" placeholder="이메일" />
              )}
            </CommonInputField>

            <CommonInputField form={form} name="password">
              {({ ...field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="비밀번호"
                  autoComplete="new-password"
                />
              )}
            </CommonInputField>

            <CardFooter className="flex justify-between space-x-2">
              <Button
                type="submit"
                className="flex-1 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg transition-colors hover:bg-blue-700"
              >
                로그인
              </Button>
              <Button
                variant="secondary"
                onClick={goToRegisterPage}
                className="flex-1 py-3 text-lg font-semibold bg-gray-300 text-black rounded-lg transition-colors hover:bg-gray-400 hover:text-white"
              >
                회원가입
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
