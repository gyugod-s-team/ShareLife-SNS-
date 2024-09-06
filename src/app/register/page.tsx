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
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { RegisterSchema, userType } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"

const RegisterPage: React.FC = () => {
  const route = useRouter()

  const { toast } = useToast()

  const form = useForm<userType>({
    resolver: zodResolver(RegisterSchema),
  })

  const handleSignUp = async (data: userType) => {
    const { email, password, name, nickname } = data

    // Zod 유효성 검사
    const result = RegisterSchema.safeParse({ email, password, name, nickname })

    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message)
      toast({ title: "회원가입 실패", description: errors.join(", ") })
      return
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            name,
            nickname,
            profile_image:
              "https://mfovgoluhkgrvrsobpru.supabase.co/storage/v1/object/public/default_profile_image/profileImage.png?t=2024-09-01T11%3A46%3A01.209Z",
          },
        },
      },
    )

    // Supabase signUp 오류 처리 로직
    if (signUpError) {
      console.log("Supabase error:", signUpError)
      toast({
        title: signUpError.message,
        description: "회원가입을 실패하였습니다.",
      })
      return
    }

    // 사용자 정보를 users 테이블에 추가
    const userId = signUpData.user?.id // user ID 가져오기

    const { error: insertError } = await supabase.from("users").insert([
      {
        user_id: userId,
        email,
        name,
        nickname,
        profile_image:
          "https://mfovgoluhkgrvrsobpru.supabase.co/storage/v1/object/public/default_profile_image/profileImage.png?t=2024-09-01T11%3A46%3A01.209Z",
      },
    ])

    if (insertError) {
      console.log("Insert error:", insertError)
      toast({
        title: "사용자 정보 추가 실패",
        description: insertError.message,
      })
      return
    }

    toast({
      title: "회원가입 성공",
      description: "회원가입이 성공적으로 완료되었습니다.",
    })
    route.push("/home")
  }

  const goToLoginPage = () => {
    route.push("/login")
  }

  return (
    <div>
      <Head>
        <title>Signup to Share Life - Make Your Account</title>
        <meta
          name="description"
          content="Sing Up to Share Life to access your account and connect with others."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.sharelife.shop/"></link>
      </Head>
      <Card className="w-[480px]">
        <CardHeader>
          <div className="flex justify-center">
            <Image
              width={300}
              height={100}
              src="/share life.png"
              alt="Logo Image"
            />
          </div>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="이메일" {...field} />
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
                    <Input type="password" placeholder="비밀번호" {...field} />
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
                    <Input placeholder="이름" {...field} />
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
                    <Input placeholder="닉네임" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-center">
              <Button type="submit">가입</Button>
              <Button onClick={goToLoginPage}>계정이 있으신가요? 로그인</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default RegisterPage
