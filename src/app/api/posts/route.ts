// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/auth/supabase"

// GET: 게시물 목록 가져오기 (userId가 없을 경우 모든 게시글)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pageParam = parseInt(searchParams.get("page") || "1")
  const userId = searchParams.get("userId")
  const ROWS_PER_PAGE = 10

  // 기본 쿼리 설정
  let query = supabase
    .from("posts")
    .select("*, users(user_id, nickname, profile_image)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((pageParam - 1) * ROWS_PER_PAGE, pageParam * ROWS_PER_PAGE - 1)

  // userId가 있을 경우에만 필터 추가
  if (userId && userId !== "undefined") {
    // userId가 있는 경우 필터 추가
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    const errorMessage: string = error.message || "Failed to fetch posts"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }

  return NextResponse.json(data || []) // data가 null일 경우 빈 배열 반환
}

export async function POST(request: NextRequest) {
  const { title, content, image_url, user_id } = await request.json()
  console.log("Received data:", { title, content, image_url, user_id })

  if (!title || !content || !user_id) {
    return NextResponse.json(
      { error: "필수 정보가 누락되었습니다." },
      { status: 400 },
    )
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, user_id, image_url }])
    .select()

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "게시글이 작성되었습니다.", data })
}

export async function PUT(request: NextRequest) {
  const { id, title, content, image_url } = await request.json()

  if (!id || !title || !content) {
    return NextResponse.json(
      { error: "필수 정보가 누락되었습니다." },
      { status: 400 },
    )
  }

  const { error } = await supabase
    .from("posts")
    .update({ title, content, image_url })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { message: "게시글이 수정되었습니다." },
    { status: 200 },
  )
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()

  if (!id) {
    return NextResponse.json(
      { error: "게시글 ID가 필요합니다." },
      { status: 400 },
    )
  }

  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { message: "게시글이 삭제되었습니다." },
    { status: 200 },
  )
}
