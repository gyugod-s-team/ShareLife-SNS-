"use client"
import { useToast } from "@/components/ui/use-toast"
import { LoginSchema, userType } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
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
import { signIn } from "next-auth/react"

const LoginPage = () => {
  const route = useRouter()
  const { toast } = useToast()

  const form = useForm<userType>({
    resolver: zodResolver(LoginSchema),
  })

  const handleLogin = async (data: userType) => {
    const { email, password } = data

    //Zod 유효성 검사
    const result = LoginSchema.safeParse({ email, password })

    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message)
      toast({ title: "로그인 실패", description: errors.join(", ") })
      return
    }

    // const { error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // })

    // if (error) {
    //   if (error.message.includes("Invalid login credentials")) {
    //     toast({
    //       title: "로그인 실패",
    //       description: "이메일 또는 비밀번호가 잘못되었습니다.",
    //     })
    //   } else {
    //     console.log("login error:", error.message)
    //     toast({
    //       title: "로그인 실패",
    //       description: error.message,
    //     })
    //   }
    //   return
    // }
    // toast({
    //   title: "로그인 성공",
    //   description: "로그인에 성공하였습니다.",
    // })
    // route.push("/home")

    // NextAuth의 signIn을 사용하여 로그인 시도
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      toast({
        title: "로그인 실패",
        description: res.error,
      })
    } else {
      toast({
        title: "로그인 성공",
        description: "로그인에 성공하였습니다.",
      })
      route.push("/home")
    }
  }

  const goToRegisterPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    route.push("/register")
  }

  return (
    <div>
      <Head>
        <title>Login to Share Life - Secure Your Account</title>
        <meta
          name="description"
          content="Log in to Share Life to access your account and connect with others."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.sharelife.shop/"></link>
      </Head>
      <Card className="w-[480px]">
        <CardHeader>
          <div className="flex justify-center">
            {/* <Image
              width={300}
              height={100}
              src="/share life.png"
              alt="Logo Image"
            /> */}
            <img
              src="/share life.png"
              alt="Logo Image"
              width="300"
              height="100"
            />
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
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
            <CardFooter className="flex justify-center">
              <Button type="submit">로그인</Button>
              <Button onClick={goToRegisterPage}>회원가입</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      {/* <div>Share Life</div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          id="login-email"
          placeholder="아이디(이메일)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          id="login-password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">로그인</Button>
        <Button onClick={goToRegisterPage}>회원가입</Button>
      </form> */}
    </div>
  )
}

export default LoginPage
