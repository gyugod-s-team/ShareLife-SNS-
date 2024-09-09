import { supabase } from "@/lib/supabase"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error("Credentials are missing.")
          return null
        }

        const { email, password } = credentials

        //Supabase 사용하여 이메일 및 비밀번호로 로그인 시도
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        // Supabase에서 에러 발생 시 오류 처리
        if (error) {
          console.error("Supabase sign-in error:", error)
          return null // null을 반환하여 인증 실패로 처리
        }

        // 사용자가 없는 경우
        if (!data.user) {
          console.error("No user found.")
          return null // null을 반환하여 인증 실패로 처리
        }

        // 사용자 객체를 반환하여 세션에 저장
        return { id: data.user.id, email: data.user.email }
      },
    }),
  ],
  pages: {
    signIn: "/login", // 사용자 정의 로그인 페이지
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions as AuthOptions)
export { handler as GET, handler as POST }
