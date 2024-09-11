import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"

const useFollow = () => {
  const [followCounts, setFollowCounts] = useState<{
    followerCount: number
    followingCount: number
  }>({
    followerCount: 0,
    followingCount: 0,
  })
  const [followingStatus, setFollowingStatus] = useState<Map<string, boolean>>(
    new Map(),
  )

  useEffect(() => {
    // 사용자 ID가 변경될 때마다 팔로우 상태 업데이트
    const fetchFollowingStatus = async (userId: string) => {
      const isFollowing = await checkIsFollowing(userId)
      setFollowingStatus((prev) => new Map(prev).set(userId, isFollowing))
    }

    // 예시로 사용자 ID를 'currentUserId'로 설정했습니다. 실제로는 적절한 값을 사용하세요.
    const currentUserId = "currentUserId" // 실제로는 해당 값을 설정해야 합니다.
    fetchFollowingStatus(currentUserId)
  }, [])

  // 사용자가 특정 사용자와 팔로우 관계인지 확인합니다.
  const checkIsFollowing = async (userId: string) => {
    const { data, error } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", userId)
      .single()

    if (error) {
      console.error("Error checking follow status:", error)
      return false
    }

    return data !== null
  }

  // 사용자가 특정 사용자를 팔로우하거나 언팔로우합니다.
  const toggleFollow = async (userId: string) => {
    const isFollowing = await checkIsFollowing(userId)

    if (isFollowing) {
      // 언팔로우
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", userId)
        .eq("following_id", userId)

      if (error) {
        console.error("Error unfollowing user:", error)
        return
      }

      setFollowingStatus((prev) => new Map(prev).set(userId, false))
    } else {
      // 팔로우
      const { error } = await supabase
        .from("follows")
        .insert([{ follower_id: userId, following_id: userId }])

      if (error) {
        console.error("Error following user:", error)
        return
      }

      setFollowingStatus((prev) => new Map(prev).set(userId, true))
    }

    // 팔로우 카운트 업데이트
    await updateFollowCounts(userId)
  }

  // 사용자의 팔로워 목록을 가져옵니다.
  const fetchFollowers = async (userId: string) => {
    const { data, error } = await supabase
      .from("follows")
      .select("follower_id, users(nickname, profile_image)")
      .eq("following_id", userId)

    if (error) {
      console.error("Error fetching followers:", error)
      return []
    }

    return data.map((item: any) => ({
      id: item.follower_id,
      nickname: item.users.nickname,
      profile_image: item.users.profile_image,
    }))
  }

  // 사용자의 팔로잉 목록을 가져옵니다.
  const fetchFollowing = async (userId: string) => {
    const { data, error } = await supabase
      .from("follows")
      .select("following_id, users(nickname, profile_image)")
      .eq("follower_id", userId)

    if (error) {
      console.error("Error fetching following:", error)
      return []
    }

    return data.map((item: any) => ({
      id: item.following_id,
      nickname: item.users.nickname,
      profile_image: item.users.profile_image,
    }))
  }

  // 팔로우와 팔로워 카운트를 업데이트합니다.
  const updateFollowCounts = async (userId: string) => {
    const { data: followersData, error: followersError } = await supabase
      .from("follows")
      .select("id")
      .eq("following_id", userId)

    if (followersError) {
      console.error("Error fetching follower count:", followersError)
      return
    }

    const { data: followingData, error: followingError } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", userId)

    if (followingError) {
      console.error("Error fetching following count:", followingError)
      return
    }

    setFollowCounts({
      followerCount: followersData.length,
      followingCount: followingData.length,
    })
  }

  // 특정 사용자가 현재 로그인한 사용자와 팔로우 관계인지 확인합니다.
  const isFollowingUser = async (userId: string) => {
    return followingStatus.get(userId) ?? false
  }

  return {
    isFollowingUser,
    toggleFollow,
    followCounts,
    fetchFollowers,
    fetchFollowing,
  }
}

export default useFollow
