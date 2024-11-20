import { supabase } from "@/lib/auth/supabase"
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
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id, following_id })

    if (error) throw error

    return NextResponse.json({ message: "Follow successful" })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { follower_id, following_id } = await request.json()

  if (!follower_id || !following_id) {
    return NextResponse.json(
      { error: "Both follower_id and following_id are required" },
      { status: 400 },
    )
  }

  try {
    const { error } = await supabase
      .from("follows")
      .delete()
      .match({ follower_id, following_id })

    if (error) throw error

    return NextResponse.json({ message: "Unfollow successful" })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
