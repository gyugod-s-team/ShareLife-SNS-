'use client'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import React, { use, useState } from 'react'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const signupHandler = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Signup successful! Please check your email for verification.')
    }
  }

  const router = useRouter()

  const navigateToLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push('/login')
  }

  return (
    <>
      <div>Share Life</div>
      <input
        type="email"
        id="login-email"
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input type="" id="" placeholder="성명" />
      <input type="" id="" placeholder="닉네임" />
      <input
        type="password"
        id="login-password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={signupHandler}>가입</Button>
      <Button onClick={navigateToLogin}>계정이 있으신가요? 로그인</Button>
    </>
  )
}

export default RegisterPage
