//src/app/api/follows/following/route.ts
import { supabase } from "@/lib/auth/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("follows")
    .select(
      `
      following:following_id(user_id, nickname, profile_image),
      follower_id
    `,
    )
    .eq("follower_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "No data found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
