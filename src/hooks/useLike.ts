"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import useAuth from "./useAuth"
import { method } from "lodash"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type LikeCounts = {
  [postId: number]: number
}

type LikeData = {
  post_id: number
}

type LikeCountData = {
  postId: number
  count: number
}

const useLike = () => {
  const { currentUserId } = useAuth()
  const queryClient = useQueryClient()

  // Fetch user likes
  const { data: likedPosts = [], error: likedPostsError } = useQuery<number[]>({
    queryKey: ["userLikes", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return []
      const response = await fetch(`/api/likes?userId=${currentUserId}`)
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || "좋아요를 불러오는 데 실패했습니다.")
      return data.map((like: LikeData) => like.post_id)
    },
    staleTime: 30000,
    enabled: !!currentUserId,
  })

  // Fetch all like counts
  const { data: likeCounts = {}, error: likeCountsError } =
    useQuery<LikeCounts>({
      queryKey: ["likeCounts"],
      queryFn: async () => {
        const response = await fetch(`/api/likes/count`)
        console.log(response.headers.get("Cache-Control"))
        const data = await response.json()
        console.log("likedata", data) // 응답 데이터 확인
        if (!response.ok)
          throw new Error(
            data.error || "좋아요 카운트를 불러오는 데 실패했습니다.",
          )
        return data.reduce(
          (acc: LikeCounts, { postId, count }: LikeCountData) => {
            acc[postId] = count
            return acc
          },
          {},
        )
      },
      staleTime: 30000,
    })

  // Toggle like with mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: number) => {
      if (!currentUserId) return
      const existingLike = likedPosts.includes(postId)
      const method = existingLike ? "DELETE" : "POST"
      const response = await fetch(`/api/likes`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUserId }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }
      return postId
    },
    onMutate: async (postId: number) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: ["userLikes", currentUserId],
        exact: true,
      })
      const previousLikedPosts = queryClient.getQueryData<number[]>([
        "userLikes",
        currentUserId,
      ])
      queryClient.setQueryData<number[]>(["userLikes", currentUserId], (old) =>
        old
          ? old.includes(postId)
            ? old.filter((id) => id !== postId)
            : [...old, postId]
          : [],
      )
      return { previousLikedPosts }
    },
    onError: (error, _, context) => {
      toast({
        title: "오류가 발생했습니다.",
        description: error.message,
      })
      queryClient.setQueryData(
        ["userLikes", currentUserId],
        context?.previousLikedPosts,
      )
    },
    onSettled: () => {
      // 무효화
      queryClient.invalidateQueries({ queryKey: ["userLikes", currentUserId] })
    },
  })

  const isPostLikedByUser = (postId: number) => likedPosts.includes(postId)
  const getLikeCountForPost = (postId: number) => likeCounts[postId] || 0

  useEffect(() => {
    if (!currentUserId) return

    // Subscribe to real-time updates
    const channel = supabase
      .channel("likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => queryClient.invalidateQueries({ queryKey: ["likeCounts"] }),
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [currentUserId, queryClient])

  return {
    toggleLike: toggleLikeMutation.mutate,
    isPostLikedByUser,
    getLikeCountForPost,
    likedPostsError,
    likeCountsError,
  }
}

export default useLike
