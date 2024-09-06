import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET as string

export async function middleware(request: NextRequest) {
  console.log("middleware")
  const token = await getToken({ req: request, secret })

  // 인증된 사용자만 접근할 수 있는 페이지 경로
  const protectedPaths = ["/", "/home", "/profile"]

  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    if (!token) {
      console.log("token no found")
      // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/home/:path*", "/profile/:path*"],
}
