"use client"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import useAuth from "./useAuth"

type LikeCounts = Record<number, number> // 각 postId에 대한 좋아요 수를 저장

const useLike = () => {
  const { currentUserId } = useAuth()
  const [likeCounts, setLikeCounts] = useState<LikeCounts>({})
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const fetchLikeCounts = async () => {
    try {
      const response = await fetch(`/api/likes/count`, {
        method: "GET",
      })
      if (!response.ok) {
        const { error } = await response.json()
        toast({
          title: "좋아요 수 불러오기 실패",
          description: error,
        })
        throw new Error(error)
      }

      const data = await response.json()
      const counts = data.reduce(
        (acc: LikeCounts, item: { postId: number; count: number }) => {
          acc[item.postId] = item.count
          return acc
        },
        {},
      )
      setLikeCounts(counts)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "좋아요 수를 불러오는 데 실패했습니다."
      toast({
        title: "좋아요 불러오기 실패",
        description: errorMessage,
      })
      setError(errorMessage)
    }
  }

  const fetchLikedPosts = async () => {
    if (currentUserId) {
      try {
        const url = `/api/likes?userId=${currentUserId}` // URL 확인
        // 올바른 경로: userId를 쿼리 파라미터로 전달
        const response = await fetch(url, {
          method: "GET",
        })
        if (!response.ok) {
          const { error } = await response.json()
          throw new Error(error)
        }

        const data = await response.json()
        setLikedPosts(
          new Set(data.map((item: { postId: number }) => item.postId)),
        )
      } catch (error) {
        console.error("좋아요 여부 불러오기 실패:", error)
        setError("좋아요 여부를 불러오는 데 실패했습니다.")
      }
    }
  }

  const toggleLike = async (postId: number) => {
    // 좋아요 상태 및 이전 상태 저장
    const isLiked = likedPosts.has(postId)
    const previousLikedPosts = new Set(likedPosts)
    const previousLikeCounts = { ...likeCounts }

    // Optimistic UI update
    setLikedPosts((prev) => {
      const updated = new Set(prev)
      if (isLiked) {
        updated.delete(postId)
      } else {
        updated.add(postId)
      }
      return updated
    })

    // 좋아요 수 업데이트
    setLikeCounts((prevCounts) => {
      const currentCount = prevCounts[postId] || 0
      const newCount = isLiked ? currentCount - 1 : currentCount + 1
      return {
        ...prevCounts,
        [postId]: newCount,
      }
    })

    try {
      const response = await fetch(`/api/likes`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: currentUserId,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "좋아요 상태 변경 실패"
      toast({
        title: "좋아요 상태 변경 실패",
        description: errorMessage,
      })
      setError(errorMessage)

      // 이전 상태로 롤백
      setLikedPosts(previousLikedPosts)
      setLikeCounts(previousLikeCounts)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchLikeCounts(), fetchLikedPosts()]) // 모든 데이터 병렬로 불러오기
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData() // 비동기 함수 실행
  }, [currentUserId])

  return {
    likeCounts,
    likedPosts,
    toggleLike,
    isLiked: (postId: number) => likedPosts.has(postId),
    error,
  }
}

export default useLike
