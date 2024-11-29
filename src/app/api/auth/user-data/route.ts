import { supabase } from "@/lib/auth/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  console.log(userId, "userId")
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Supabase에서 사용자 데이터 가져오기
  const { data, error } = await supabase
    .from("users")
    .select("nickname, profile_image")
    .eq("user_id", userId)
    .single()

  // Supabase에서 발생한 에러 처리
  if (error) {
    // Error 타입으로 명시적으로 처리
    const errorMessage: string = error.message || "Failed to fetch user data"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }

  // 데이터가 없는 경우 처리
  if (!data) {
    return NextResponse.json({ error: "No user data found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
