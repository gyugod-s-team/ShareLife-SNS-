'use client'
import { Button } from '@/components/ui/button'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import React from 'react'

const LoginPage = () => {
  const router = useRouter()
  // const loginHandler = (e) => {
  //   e.preventDefault()
  //   alert('hi')
  // }
  const registerHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push('/register')
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
        {/* 추후 실제 도메인 넣어줘야함 */}
        <link rel="canonical" href="https://yourdomain.com/login"></link>
      </Head>
      <div>Share Life</div>
      <form>
        <input type="email" id="login-email" placeholder="아이디(이메일)" />
        <input type="password" id="login-password" placeholder="비밀번호" />
        <Button onClick={() => alert('hi')}>로그인</Button>
        <Button onClick={registerHandler}>회원가입</Button>
      </form>
    </div>
  )
}

export default LoginPage
