"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const RegisterPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const router = useRouter()

  // Turnstile 스크립트를 클라이언트에서만 로드
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    // Turnstile 스크립트 로드 후 콜백을 등록
    script.onload = () => {
      ;(window as any).turnstile?.render(".cf-turnstile", {
        sitekey: "0x4AAAAAAAhAX4NKr_No5Ofa",
        callback: (token: string) => setTurnstileToken(token),
      })
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const signupHandler = async () => {
    if (!turnstileToken) {
      setError("Please complete the CAPTCHA verification.")
      return
    }

    const response = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: turnstileToken }),
    })

    const data = await response.json()

    if (!data.success) {
      setError("CAPTCHA verification failed.")
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Signup successful! Please check your email for verification.")
    }
  }

  const navigateToLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push("/login")
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
      <input type="text" id="login-name" placeholder="성명" />
      <input type="text" id="login-nickname" placeholder="닉네임" />
      <input
        type="password"
        id="login-password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div
        className="cf-turnstile"
        data-sitekey="0x4AAAAAAAhAX4NKr_No5Ofa"
      ></div>
      <Button onClick={signupHandler}>가입</Button>
      <Button onClick={navigateToLogin}>계정이 있으신가요? 로그인</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </>
  )
}

export default RegisterPage
