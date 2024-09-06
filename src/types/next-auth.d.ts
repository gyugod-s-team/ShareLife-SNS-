import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      // 다른 사용자 정의 속성 추가 가능
    } & DefaultSession["user"]
  }

  interface JWT {
    id?: string
    email?: string
  }
}
