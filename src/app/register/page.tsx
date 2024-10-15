"use client"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterSchema, userType } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Head from "next/head"
import Image from "next/image"
import React from "react"
import { useForm } from "react-hook-form"
import useAuth from "@/hooks/useAuth"
import RegisterSkeletonCard from "./_components/RegisterSkeletonCard"

const RegisterPage: React.FC = () => {
  const { loading, handleSignUp, goToLoginPage } = useAuth()

  const form = useForm<userType>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  })

  if (loading) {
    return <RegisterSkeletonCard />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-800">
      <Head>
        <title>Signup to Share Life - Make Your Account</title>
        <meta
          name="description"
          content="Sign Up to Share Life to access your account and connect with others."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.sharelife.shop/"></link>
      </Head>
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="이메일"
                      {...field}
                      className="p-4 text-lg rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호"
                      {...field}
                      className="p-4 text-lg rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="이름"
                      {...field}
                      className="p-4 text-lg rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="닉네임"
                      {...field}
                      className="p-4 text-lg rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
