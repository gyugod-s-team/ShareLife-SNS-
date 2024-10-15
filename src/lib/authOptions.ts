import { supabase } from "@/lib/supabase"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import EmailProvider from "next-auth/providers/email"

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

        return { id: data.user.id, email: data.user.email }
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: "smtp.gmail.com", // Gmail SMTP 서버
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER, // Gmail 계정 이메일
    //       pass: process.env.EMAIL_SERVER_PASSWORD, // Gmail 계정 비밀번호
    //     },
    //   },
    //   from: process.env.EMAIL_FROM, // 발신 이메일
    // }),
  ],
  pages: {
    signIn: "/login",
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
