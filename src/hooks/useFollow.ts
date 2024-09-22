"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import useAuth from "./useAuth"

type User = {
  user_id: string
  nickname: string
  profile_image?: string | null
}

type FollowCounts = {
  followerCount: number
  followingCount: number
}

type FollowQueryResult = {
  follower: {
    id: string
    nickname: string
    profile_image: string | null
  }
  following_id: string
}

type FollowingQueryResult = {
  following: {
    id: string
    nickname: string
    profile_image: string | null
  }
  follower_id: string
}

const useFollow = (userId: string) => {
  const { currentUserId, fetchPostUserData } = useAuth()
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [followCounts, setFollowCounts] = useState<FollowCounts>({
    followerCount: 0,
    followingCount: 0,
  })
  const [isFollowing, setIsFollowing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFollowers = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("follows")
        .select(
          `
          follower:follower_id(user_id, nickname, profile_image),
          following_id
        `,
        )
        .eq("follower_id", userId)
        .returns<FollowQueryResult[]>()

      console.log("fetchFollowers:", data)
      if (error) throw error

      setFollowers(
        data?.map((item) => ({
          user_id: item.follower.id || "", // id가 null일 경우 빈 문자열로 처리
          nickname: item.follower.nickname || "", // nickname이 null일 때 빈 문자열로 처리
          profile_image: item.follower.profile_image || null, // profile_image가 null일 경우 null로 처리
        })) || [],
      )
    } catch (error) {
      toast({
        title: "팔로워 불러오기 실패",
        description: (error as Error).message,
      })
      setError((error as Error).message)
    }
  }

  const fetchFollowing = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("follows")
        .select(
          `
          following:following_id(user_id, nickname, profile_image),
          follower_id
        `,
        )
        .eq("following_id", userId)
        .returns<FollowingQueryResult[]>()

      if (error) throw error
      console.log("fetchFollowingData:", data)

      setFollowing(
        data?.map((item) => ({
          user_id: item.following.id || "", // id가 null일 경우 빈 문자열로 처리
          nickname: item.following.nickname || "", // nickname이 null일 때 빈 문자열로 처리
          profile_image: item.following.profile_image || null, // profile_image가 null일 경우 null로 처리
        })) || [],
      )
    } catch (error) {
      toast({
        title: "팔로잉 불러오기 실패",
        description: (error as Error).message,
      })
      setError((error as Error).message)
    }
  }

  const fetchFollowCounts = async (userId: string) => {
    try {
      // 팔로워 수
      const { count: followerCount, error: followerError } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("follower_id", userId)

      if (followerError) throw followerError

      // 팔로잉 수
      const { count: followingCount, error: followingError } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("following_id", userId)

      if (followingError) throw followingError

      setFollowCounts({
        followerCount: followerCount || 0,
        followingCount: followingCount || 0,
      })
    } catch (err) {
      setError("Error fetching follow counts")
      console.error("Error fetching follow counts:", err)
    }
  }

  const toggleFollow = async (targetUserId: string) => {
    if (isFollowing) {
      await handleUnfollow(targetUserId)
    } else {
      await handleFollow(targetUserId)
    }
  }

  const handleFollow = async (targetUserId: string) => {
    try {
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: currentUserId, following_id: targetUserId })

      if (error) throw error

      setIsFollowing(true)
    } catch (error) {
      toast({
        title: "팔로우 오류",
        description: (error as Error).message,
      })
      console.error("팔로우 오류:", error)
    }
  }

  const handleUnfollow = async (targetUserId: string) => {
    try {
      const { error } = await supabase
        .from("follows")
        .delete()
        .match({ follower_id: currentUserId, following_id: targetUserId })

      if (error) throw error

      setIsFollowing(false)
    } catch (error) {
      toast({
        title: "언팔로우 오류",
        description: (error as Error).message,
      })
      console.error("언팔로우 오류:", error)
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchFollowers(userId)
      await fetchFollowing(userId)
      await fetchFollowCounts(userId)
    }

    fetchInitialData()

    const channel = supabase
      .channel("follows")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "follows" },
        () => fetchInitialData(),
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  const isFollowingUser = (targetUserId: string) =>
    following.some((user) => user.user_id === targetUserId)

  return {
    isFollowingUser,
    fetchFollowers,
    fetchFollowing,
    followCounts,
    error,
    followers,
    following,
    toggleFollow, // toggleFollow 반환
    setIsFollowing,
  }
}

export default useFollow
