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
  const { currentUserId } = useAuth()
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
      const response = await fetch(`/api/follows/followers?userId=${userId}`, {
        method: "GET",
      })
      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      const data = await response.json()

      setFollowers(
        data?.map((item: FollowQueryResult) => ({
          user_id: item.follower.id || "",
          nickname: item.follower.nickname || "",
          profile_image: item.follower.profile_image || null,
        })) || [],
      )
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      toast({
        title: "팔로워 불러오기 실패",
        description: errorMessage,
      })
      setError(errorMessage)
    }
  }

  const fetchFollowing = async (userId: string) => {
    try {
      const response = await fetch(`/api/follows/following?userId=${userId}`, {
        method: "GET",
      })
      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      const data = await response.json()

      setFollowing(
        data?.map((item: FollowingQueryResult) => ({
          user_id: item.following.id || "",
          nickname: item.following.nickname || "",
          profile_image: item.following.profile_image || null,
        })) || [],
      )
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      toast({
        title: "팔로워 불러오기 실패",
        description: errorMessage,
      })
      setError(errorMessage)
    }
  }

  const fetchFollowCounts = async (userId: string) => {
    try {
      const response = await fetch(`/api/follows/count?userId=${userId}`, {
        method: "GET",
      })
      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      const data = await response.json()

      setFollowCounts({
        followerCount: data.followerCount || 0,
        followingCount: data.followingCount || 0,
      })
    } catch (err) {
      setError("Error fetching follow counts")
      console.error("Error fetching follow counts:", err)
    }
  }

  const toggleFollow = async (targetUserId: string) => {
    try {
      if (isFollowing) {
        await handleUnfollow(targetUserId)
      } else {
        await handleFollow(targetUserId)
      }

      // 팔로우 상태를 토글
      setIsFollowing(!isFollowing)

      // 팔로우 카운트 업데이트
      await fetchFollowCounts(userId)
    } catch (error) {
      toast({
        title: "팔로우 상태 변경 실패",
        description: (error as Error).message,
      })
      console.error("팔로우 상태 변경 실패:", error)
    }
  }

  const handleFollow = async (targetUserId: string) => {
    try {
      const response = await fetch("/api/follows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          follower_id: currentUserId,
          following_id: targetUserId,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }
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
      const response = await fetch("/api/follows", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          follower_id: currentUserId,
          following_id: targetUserId,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }
    } catch (error) {
      toast({
        title: "언팔로우 오류",
        description: (error as Error).message,
      })
      console.error("언팔로우 오류:", error)
    }
  }

  const checkIsFollowing = async () => {
    if (currentUserId) {
      try {
        const response = await fetch("/api/follows/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            follower_id: currentUserId,
            following_id: userId,
          }),
        })

        console.log("checkresponse", response)
        if (!response.ok) {
          const { error } = await response.json()
          throw new Error(error)
        }

        const { isFollowing } = await response.json()
        setIsFollowing(isFollowing)
      } catch (error) {
        console.error("팔로우 상태 확인 실패:", error)
        toast({
          title: "팔로우 상태 확인 실패",
          description: (error as Error).message,
        })
      }
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchFollowers(userId)
      await fetchFollowing(userId)
      await fetchFollowCounts(userId)
      await checkIsFollowing()
    }

    fetchInitialData()

    const channel = supabase
      .channel("follows")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "follows" },
        () => {
          fetchInitialData()
          checkIsFollowing()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, currentUserId])

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
    isFollowing,
  }
}

export default useFollow
