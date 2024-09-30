//src/app/api/follows/followers/route.ts
import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("follows")
    .select(
      `
      follower:follower_id(user_id, nickname, profile_image),
      following_id
    `,
    )
    .eq("following_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "No data found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
