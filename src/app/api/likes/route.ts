// src/app/api/likes/route.ts
import { supabase } from "@/lib/auth/supabase"
import { NextRequest, NextResponse } from "next/server"

// GET: 사용자가 좋아요한 게시물 가져오기
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const { data: likes, error } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", userId)
  console.log(likes, "likes")
  if (error) {
    const errorMessage: string = error.message || "Failed to fetch likes"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }

  return NextResponse.json(likes || [])
}

// POST: 좋아요 추가
export async function POST(request: NextRequest) {
  const { postId, userId } = await request.json()

  if (!postId || !userId) {
    return NextResponse.json(
      { error: "Post ID and User ID are required" },
      { status: 400 },
    )
  }

  const { error } = await supabase
    .from("likes")
    .insert([{ post_id: postId, user_id: userId }])

  if (error) {
    const errorMessage: string = error.message || "Failed to add like"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }

  return NextResponse.json({ message: "Like added" }, { status: 201 })
}

// DELETE: 좋아요 삭제
export async function DELETE(request: NextRequest) {
  const { postId, userId } = await request.json()

  if (!postId || !userId) {
    return NextResponse.json(
      { error: "Post ID and User ID are required" },
      { status: 400 },
    )
  }

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId)

  if (error) {
    const errorMessage: string = error.message || "Failed to delete like"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }

  return NextResponse.json({ message: "Like removed" }, { status: 200 })
}
