import { supabase } from "@/lib/auth/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // 팔로워 수 가져오기
  const { count: followerCount, error: followerError } = await supabase
    .from("follows")
    .select("*", { count: "exact" })
    .eq("follower_id", userId)

  if (followerError) {
    return NextResponse.json({ error: followerError.message }, { status: 500 })
  }

  // 팔로잉 수 가져오기
  const { count: followingCount, error: followingError } = await supabase
    .from("follows")
    .select("*", { count: "exact" })
    .eq("following_id", userId)

  if (followingError) {
    return NextResponse.json({ error: followingError.message }, { status: 500 })
  }

  return NextResponse.json({ followerCount, followingCount })
}
