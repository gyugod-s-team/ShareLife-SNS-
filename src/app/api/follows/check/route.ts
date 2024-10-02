import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { follower_id, following_id } = await request.json()

  if (!follower_id || !following_id) {
    return NextResponse.json(
      { error: "Both follower_id and following_id are required" },
      { status: 400 },
    )
  }

  try {
    const { data, error } = await supabase
      .from("follows")
      .select("*")
      .match({ follower_id, following_id })
      .maybeSingle()

    if (error) {
      console.error("Supabase error:", error)
      throw error // 에러를 던져서 catch 블록으로 이동
    }

    return NextResponse.json({ isFollowing: !!data })
  } catch (error) {
    console.error("Error occurred:", error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
