import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string | null
    nickname: string // nickname 추가
    profile_image: string // profile_image 추가
  }

  interface Session {
    user: User
  }

  interface JWT {
    id?: string
    email?: string
    nickname?: string
    profile_image?: string
  }
}
