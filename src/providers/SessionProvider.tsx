"use client" // 클라이언트 컴포넌트로 지정

import { SessionProvider as NextAuthProvider } from "next-auth/react"
import { ReactNode } from "react"

interface SessionProviderProps {
  children: ReactNode
}

const SessionProvider = ({ children }: SessionProviderProps) => {
  return <NextAuthProvider>{children}</NextAuthProvider>
}

export default SessionProvider
