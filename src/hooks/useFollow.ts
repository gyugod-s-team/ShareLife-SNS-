import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import useAuth from "./useAuth"

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

type FollowResponse = {
  id: string
  nickname: string | null
  profile_image: string | null
}

const useFollow = (userId: string) => {
  const { currentUserId } = useAuth()
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [followCounts, setFollowCounts] = useState<FollowCounts>({
    followerCount: 0,
    followingCount: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false) // 버튼 비활성화 상태

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

      if (error) throw error

      setFollowers(
        data?.map((item) => ({
          id: item.follower.id,
          nickname: item.follower.nickname || "", // nickname이 null일 때 빈 문자열로 처리
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
          following:following_id(id, nickname, profile_image),
          follower_id
        `,
        )
        .eq("follower_id", userId)
        .returns<FollowingQueryResult[]>()

      if (error) throw error

      setFollowing(
        data?.map((item) => ({
          id: item.following.id,
          nickname: item.following.nickname || "", // nickname이 null일 때 빈 문자열로 처리
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

  const toggleFollow = async (targetUserId: string) => {
    if (!currentUserId || isProcessing) return

    setIsProcessing(true)

    try {
      const isFollowing = following.some((user) => user.id === targetUserId)

      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", targetUserId)

        if (error) throw error

        setFollowing((prevFollowing) =>
          prevFollowing.filter((user) => user.id !== targetUserId),
        )

        setFollowCounts((prevCounts) => ({
          ...prevCounts,
          followingCount: prevCounts.followingCount - 1,
        }))
      } else {
        const { data, error } = await supabase
          .from("follows")
          .insert([{ follower_id: currentUserId, following_id: targetUserId }])
          .single()

        if (error) throw error

        console.log("Data from Supabase:", data)

        const newFollowing: User = {
          id: targetUserId,
          nickname: (data as FollowResponse)?.nickname || "", // 데이터가 null일 경우를 처리
          profile_image: (data as FollowResponse)?.profile_image || undefined,
        }

        setFollowing((prevFollowing) => [...prevFollowing, newFollowing])

        setFollowCounts((prevCounts) => ({
          ...prevCounts,
          followingCount: prevCounts.followingCount + 1,
        }))
      }

      // 팔로우 수 업데이트
      await fetchFollowCounts(userId)
    } catch (error) {
      console.error("Error in toggleFollow:", error)
      toast({
        title: "팔로우 실패",
        description: (error as Error).message,
      })
      setError((error as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (!userId) return

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
    following.some((user) => user.id === targetUserId)

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
