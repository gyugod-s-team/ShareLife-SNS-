"use client"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterSchema, RegisterType } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import React from "react"
import { useForm } from "react-hook-form"
import useAuth from "@/hooks/useAuth"
import useUserStore from "@/store/useUserStore"
import CommonInputField from "@/components/common/CommonInputField"
import RegisterSkeletonCard from "./RegisterSkeletonCard"

const RegisterPage: React.FC = () => {
  const { loading, handleSignUp, goToLoginPage } = useAuth()
  const { email } = useUserStore()

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  })

  if (loading) {
    return <RegisterSkeletonCard />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-800">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-xl bg-white">
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
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="space-y-4"
          >
            <CommonInputField form={form} name="email">
              {({ ...field }) => (
                <Input
                  {...field} // field 객체의 속성을 Input에 전달해야 react-hook-form에서 제어가 가능
                  type="email"
                  placeholder="이메일"
                  defaultValue={email}
                />
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

            <CommonInputField form={form} name="name">
              {({ ...field }) => (
                <Input {...field} type="text" placeholder="이름" />
              )}
            </CommonInputField>

            <CommonInputField form={form} name="nickname">
              {({ ...field }) => (
                <Input {...field} type="text" placeholder="닉네임" />
              )}
            </CommonInputField>

            <CardFooter className="flex justify-between space-x-2">
              <Button
                type="submit"
                className="flex-1 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg transition-colors hover:bg-blue-700"
              >
                가입
              </Button>
              <Button
                variant="secondary"
                onClick={goToLoginPage}
                className="flex-1 py-3 text-lg font-semibold bg-gray-300 text-black rounded-lg transition-colors hover:bg-gray-400 hover:text-white"
              >
                계정이 있으신가요? 로그인
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default RegisterPage
