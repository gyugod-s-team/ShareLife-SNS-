import { supabase } from "@/lib/auth/supabase"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userId = params.id

  // 팔로우 및 팔로잉 수 조회
  const { data: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact" })
    .eq("following_id", userId)
  const { data: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact" })
    .eq("follower_id", userId)

  // 팔로우 및 팔로잉 목록 조회
  const { data: followersList } = await supabase
    .from("follows")
    .select("follower_id, users(nickname, profile_image)")
    .eq("following_id", userId)
    .single()
  const { data: followingList } = await supabase
    .from("follows")
    .select("following_id, users(nickname, profile_image)")
    .eq("follower_id", userId)
    .single()

  return NextResponse.json({
    followersCount: followersCount?.length,
    followingCount: followingCount?.length,
    followersList,
    followingList,
  })
}
