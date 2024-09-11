import { useEffect, useState } from "react"
import useAuth from "./useAuth"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

type FollowCounts = {
  followingCount: number
  followerCount: number
}

type User = {
  id: string
  nickname: string
  profile_image: string
}

type FollowData = {
  following_id: string
  following: User
}

type FollowerData = {
  follower_id: string
  follower: User
}

const useFollow = () => {
  const { currentUserId } = useAuth()
  const [following, setFollowing] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [followCounts, setFollowCounts] = useState<FollowCounts>({
    followingCount: 0,
    followerCount: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchFollowing = async (userId: string): Promise<User[]> => {
    if (!userId) return []

    const { data, error } = await supabase
      .from("follows")
      .select(`following_id, following: users(id, nickname, profile_image)`)
      .eq("follower_id", userId)

    if (error) {
      setError("Error fetching following list")
      console.error("Error fetching following list:", error)
      return []
    }

    console.log("fetchFollowing data", data)

    // data를 FollowData 타입으로 명시하여 처리
    return data ? data.map((follow) => follow.following) : []
  }

  const fetchFollowers = async (userId: string) => {
    if (!userId) return []

    const { data, error } = await supabase
      .from("follows")
      .select(`follower_id, follower: users(id, nickname, profile_image)`)
      .eq("following_id", userId)

    if (error) {
      setError("Error fetching followers list")
      console.error("Error fetching followers list:", error)
      return []
    } else {
      return data ? data.map((follow) => follow.follower) : []
    }
  }

  const fetchFollowCounts = async (userId: string) => {
    if (!userId) return

    try {
      const [{ count: followingCount }, { count: followerCount }] =
        await Promise.all([
          supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", userId),
          supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("following_id", userId),
        ])

      setFollowCounts({
        followingCount: followingCount || 0,
        followerCount: followerCount || 0,
      })
    } catch (error) {
      setError("Error fetching follow counts")
      console.error("Error fetching follow counts:", error)
      toast({
        title: "팔로우 카운트 가져오기 실패",
        description: (error as Error).message,
      })
    }
  }

  const toggleFollow = async (userId: string) => {
    if (!currentUserId || currentUserId === userId) return

    const isFollowing = following.some((user) => user.id === userId)

    if (isFollowing) {
      // 언팔로우 처리
      const { error: deleteError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", userId)
      if (deleteError) {
        toast({
          title: "팔로우 취소 중 오류가 발생하였습니다",
          description: deleteError.message,
        })
      } else {
        // UI 업데이트
        setFollowing((prevFollowing) =>
          prevFollowing.filter((user) => user.id !== userId),
        )
        fetchFollowCounts(currentUserId) // update follow counts for current user
      }
    } else {
      //팔로우 처리 전 해당 유저 정보 조회
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("nickname, profile_image")
        .eq("user_id", userId)
        .single()

      if (userError || !user) {
        toast({
          title: "유저 정보를 가져오는데 오류가 발생했습니다.",
          description: userError?.message || "유저 정보를 찾을 수 없습니다.",
        })
        return
      }

      // 팔로우 처리
      const { error: insertError } = await supabase
        .from("follows")
        .insert([{ follower_id: currentUserId, following_id: userId }])

      if (insertError) {
        toast({
          title: "팔로우 추가 중 오류가 발생했습니다.",
          description: insertError.message,
        })
      } else {
        setFollowing((prevFollowing) => [...prevFollowing, user])
        fetchFollowCounts(currentUserId)
        // // UI 업데이트
        // const newUser = { id: userId, nickname: "", profile_image: null } // 사용자 정보를 가져와야 함
        // setFollowing((prevFollowing) => [...prevFollowing, newUser])
        // fetchFollowCounts(currentUserId) // update follow counts for current user
      }
    }
  }

  useEffect(() => {
    if (!currentUserId) return

    const fetchInitialData = async () => {
      try {
        const initialFollowing = await fetchFollowing(currentUserId)
        setFollowing(initialFollowing)
        const initialFollowers = await fetchFollowers(currentUserId)
        setFollowers(initialFollowers)
        await fetchFollowCounts(currentUserId)
      } catch (error) {
        console.error("Error fetching initial data:", error)
        setError("Error fetching initial data")
      }
    }

    fetchInitialData()

    // 실시간 업데이트 구독
    const channel = supabase
      .channel("follows")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "follows" },
        async (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "DELETE"
          ) {
            // 팔로우/언팔로우 발생 시 목록 다시 불러오기
            const updatedFollowing = await fetchFollowing(currentUserId)
            setFollowing(updatedFollowing)
            const updatedFollowers = await fetchFollowers(currentUserId)
            setFollowers(updatedFollowers)
            await fetchFollowCounts(currentUserId)
          }
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [currentUserId])

  const isFollowingUser = (userId: string) =>
    following.some((user) => user.id === userId)
  const isFollowedByUser = (userId: string) =>
    followers.some((user) => user.id === userId)

  return {
    toggleFollow,
    isFollowingUser,
    isFollowedByUser,
    fetchFollowers,
    fetchFollowing,
    fetchFollowCounts,
    followCounts,
    followers,
    following,
    error,
  }
}

export default useFollow
