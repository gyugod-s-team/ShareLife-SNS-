"use client"
import { LoginSchema, userType } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Head from "next/head"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import LoginSkeletonCard from "./_components/LoginSkeletonCard"

const LoginPage = () => {
  const { handleLogin, goToRegisterPage, loading } = useAuth()

  const form = useForm<userType>({
    resolver: zodResolver(LoginSchema),
  })

  if (loading) {
    return <LoginSkeletonCard />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-800">
      <Head>
        <title>Login to Share Life - Secure Your Account</title>
        <meta
          name="description"
          content="Log in to Share Life to access your account and connect with others."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.sharelife.shop/"></link>
      </Head>

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
