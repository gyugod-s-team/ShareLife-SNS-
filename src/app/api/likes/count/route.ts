import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

// GET: 모든 게시물의 좋아요 수 가져오기
export async function GET(request: NextRequest) {
  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("id")

  if (postError) {
    const errorMessage: string = postError.message || "Failed to fetch posts"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }

  const likeCountsPromises = posts.map(async (post) => {
    const { count, error: countError } = await supabase
      .from("likes")
      .select("*", { count: "exact" })
      .eq("post_id", post.id)

    if (countError) {
      console.error("Error fetching like count for post:", countError)
      return { postId: post.id, count: 0 }
    }
    return { postId: post.id, count: count || 0 }
  })

  const likeCountsResults = await Promise.all(likeCountsPromises)
  return NextResponse.json(likeCountsResults)
}
