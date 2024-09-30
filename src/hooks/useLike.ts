"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import useAuth from "./useAuth"
import { method } from "lodash"

type LikeCounts = {
  [postId: number]: number
}

type LikeCountData = {
  postId: number // 또는 string, 데이터 타입에 맞게 조정
  count: number
}

const useLike = () => {
  const { currentUserId } = useAuth()
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [likeCounts, setLikeCounts] = useState<LikeCounts>({})
  const [error, setError] = useState<string | null>(null)

  const fetchUserLikes = async () => {
    if (!currentUserId) return

    const response = await fetch(`/api/likes?userId=${currentUserId}`, {
      method: "GET",
    })
    const data = await response.json()

    if (response.ok) {
      setLikedPosts(data.map((like: { post_id: number }) => like.post_id))
    } else {
      setError(data.error)
      console.error("Error fetching likes:", data.error)
    }
  }

  const fetchAllLikeCounts = async () => {
    const response = await fetch(`/api/likes/count`, { method: "GET" })

    if (!response.ok) {
      const data = await response.json()
      toast({
        title: "좋아요 수 불러오기 실패",
        description: data.error,
      })
      console.error("Error fetching like counts:", data.error)
      return
    }

    const likeCountsData: LikeCountData[] = await response.json()
    const updatedLikeCounts: LikeCounts = {}

    likeCountsData.forEach(({ postId, count }) => {
      updatedLikeCounts[postId] = count
    })

    setLikeCounts(updatedLikeCounts)
  }

  const toggleLike = async (postId: number) => {
    if (!currentUserId) return

    const existingLike = likedPosts.includes(postId)

    // Optimistic UI update
    setLikedPosts((prevLikedPosts) =>
      existingLike
        ? prevLikedPosts.filter((id) => id !== postId)
        : [...prevLikedPosts, postId],
    )

    const method = existingLike ? "DELETE" : "POST"
    const response = await fetch(`/api/likes`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId: currentUserId }),
    })

    if (!response.ok) {
      const data = await response.json()
      toast({
        title: existingLike
          ? "좋아요 삭제 중 오류가 발생했습니다."
          : "좋아요 추가 중 오류가 발생했습니다.",
        description: data.error,
      })
      // Rollback optimistic update on error
      setLikedPosts((prevLikedPosts) =>
        existingLike
          ? [...prevLikedPosts, postId]
          : prevLikedPosts.filter((id) => id !== postId),
      )
    } else {
      fetchAllLikeCounts() // Update like count
    }
  }

  useEffect(() => {
    if (!currentUserId) return

    const fetchInitialData = async () => {
      await fetchUserLikes()
      await fetchAllLikeCounts()
    }

    fetchInitialData()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => fetchAllLikeCounts(),
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [currentUserId])

  const isPostLikedByUser = (postId: number) => likedPosts.includes(postId)
  const getLikeCountForPost = (postId: number) => likeCounts[postId] || 0

  return {
    toggleLike,
    isPostLikedByUser,
    getLikeCountForPost,
    error, // Return error state
  }
}

export default useLike
