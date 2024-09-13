import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import useAuth from "./useAuth"
import { Database } from "@/types/supabase"

type User = {
  id: string
  nickname: string
  profile_image?: string
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

const useFollow = () => {
  const { currentUserId } = useAuth()
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [followCounts, setFollowCounts] = useState<FollowCounts>({
    followerCount: 0,
    followingCount: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const fetchFollowers = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("follows")
        .select(
          `
        follower:follower_id(id, nickname, profile_image),
        following_id
      `,
        )
        .eq("following_id", userId)
        .returns<FollowQueryResult[]>()

      console.log("Data:", data)
      console.log("Error:", error)

      if (error) throw error

      setFollowers(
        data?.map((item) => ({
          id: item.follower.id,
          nickname: item.follower.nickname,
          profile_image: item.follower.profile_image || undefined,
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
        .eq("follower_id", userId)
        .returns<FollowingQueryResult[]>()

      console.log("FollowingData:", data)

      if (error) throw error

      setFollowing(
        data?.map((item) => ({
          id: item.following.id,
          nickname: item.following.nickname,
          profile_image: item.following.profile_image || undefined,
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
        .eq("following_id", userId)

      if (followerError) throw followerError

      // 팔로잉 수
      const { count: followingCount, error: followingError } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("follower_id", userId)

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

  const toggleFollow = async (userId: string) => {
    if (!currentUserId) return

    let isFollowing: boolean

    try {
      isFollowing = following.some((user) => user.id === userId)

      // 팔로우 상태를 즉시 업데이트
      setFollowing((prevFollowing) => {
        if (isFollowing) {
          return prevFollowing.filter((user) => user.id !== userId)
        } else {
          return [
            ...prevFollowing,
            { id: userId, nickname: "", profile_image: "" },
          ]
        }
      })

      // 데이터베이스에서 팔로우 추가 또는 삭제
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", userId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("follows")
          .insert([{ follower_id: currentUserId, following_id: userId }])

        if (error) throw error
      }

      // 팔로우 카운트를 업데이트
      await fetchFollowCounts(currentUserId)
    } catch (err) {
      console.error("Error toggling follow:", err)
    }
  }

  useEffect(() => {
    if (!currentUserId) return

    const fetchInitialData = async () => {
      // Fetch data for the current user
      await fetchFollowers(currentUserId)
      await fetchFollowCounts(currentUserId)
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
  }, [currentUserId])

  const isFollowingUser = (userId: string) =>
    following.some((user) => user.id === userId)

  return {
    toggleFollow,
    isFollowingUser,
    fetchFollowers,
    fetchFollowing,
    followCounts,
    error,
    followers,
    following,
  }
}

export default useFollow
