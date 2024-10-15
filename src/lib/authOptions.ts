import { supabase } from "@/lib/supabase"
import { AuthOptions } from "next-auth"
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

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("Supabase sign-in error:", error)
          throw new Error(error.message) // 사용자에게 에러 메시지 전달
        }

        if (!data.user) {
          console.error("No user found.")
          return null
        }

        const { user_metadata } = data.user

        return {
          id: data.user.id,
          email: data.user.email || null,
          nickname: user_metadata.nickname,
          profile_image: user_metadata.profile_image,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1시간 (60분 * 60초)
    updateAge: 30 * 60, // 30분 (30분 * 60초)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.nickname = user.nickname
        token.profile_image = user.profile_image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          nickname: token.nickname as string,
          profile_image: token.profile_image as string,
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
