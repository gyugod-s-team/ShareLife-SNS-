// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET: 특정 포스트의 댓글 목록 가져오기 (페이지네이션 포함)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get("postId")
  const pageParam = Number(searchParams.get("page") || "1")
  // ROWS_PER_PAGE: 페이지당 댓글 수
  const ROWS_PER_PAGE = 20

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*", { count: "exact" })
    .eq("post_id", postId)
    .order("created_at", { ascending: false })
    .range((pageParam - 1) * ROWS_PER_PAGE, pageParam * ROWS_PER_PAGE - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data: data || [],
    nextPage: data.length === ROWS_PER_PAGE ? pageParam + 1 : null,
  })
}

// 댓글 생성 (POST)
export async function POST(request: NextRequest) {
  const { post_id, user_id, content } = await request.json()

  console.log("postId", post_id)
  console.log("userId", user_id)
  console.log("content", content)

  if (!post_id || !user_id || !content) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { error } = await supabase.from("comments").insert([
    {
      post_id,
      user_id,
      content,
    },
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Comment created successfully" })
}

// 댓글 수정 (PATCH)
export async function PATCH(request: NextRequest) {
  const { commentId, userId, content } = await request.json()

  if (!commentId || !userId || !content) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId)
    .eq("user_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Comment updated successfully" })
}

// 댓글 삭제 (DELETE)
export async function DELETE(request: Request) {
  const { commentId, userId } = await request.json()

  if (!commentId || !userId) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Comment deleted successfully" })
}
