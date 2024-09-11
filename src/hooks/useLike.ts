import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import useAuth from "./useAuth"

type LikeCounts = {
  [postId: number]: number
}

const useLike = () => {
  const { currentUserId } = useAuth()
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [likeCounts, setLikeCounts] = useState<LikeCounts>({})
  const [error, setError] = useState<string | null>(null)

  const fetchUserLikes = async () => {
    if (!currentUserId) return

    const { data: likes, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", currentUserId)
      .returns<{ post_id: number }[]>()

    if (error) {
      setError("Error fetching likes")
      console.error("Error fetching likes:", error)
    } else {
      setLikedPosts(likes ? likes.map((like) => like.post_id) : [])
    }
  }

  const fetchAllLikeCounts = async () => {
    try {
      const { data: posts, error: postError } = await supabase
        .from("posts")
        .select("id")

      if (postError) {
        setError("Error fetching posts")
        console.error("Error fetching posts:", postError)
        return
      }

      const postIds = posts.map((post) => post.id)
      const updatedLikeCounts: LikeCounts = {}

      // Fetch like counts for each post
      const likeCountsPromises = postIds.map(async (postId) => {
        const { count, error: countError } = await supabase
          .from("likes")
          .select("*", { count: "exact" })
          .eq("post_id", postId)

        if (countError) {
          console.error("Error fetching like count for post:", countError)
          toast({
            title: "좋아요 불러오는데 에러가 발생하였습니다",
            description: countError.message,
          })
          return { postId, count: 0 } // Default to 0 on error
        }
        return { postId, count: count || 0 }
      })

      const likeCountsResults = await Promise.all(likeCountsPromises)
      likeCountsResults.forEach(({ postId, count }) => {
        updatedLikeCounts[postId] = count
      })

      setLikeCounts(updatedLikeCounts)
    } catch (error) {
      setError("Error fetching like counts")
      console.error("Error fetching like counts:", error)
      toast({
        title: "좋아요 갯수 불러오기 실패",
        description: (error as Error).message,
      })
    }
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

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId)
      if (deleteError) {
        toast({
          title: "좋아요 삭제 중 오류가 발생했습니다.",
          description: deleteError.message,
        })
      } else {
        fetchAllLikeCounts() // Update like count
      }
    } else {
      const { error: insertError } = await supabase
        .from("likes")
        .insert([{ post_id: postId, user_id: currentUserId }])
      if (insertError) {
        toast({
          title: "좋아요 추가 중 오류가 발생했습니다.",
          description: insertError.message,
        })
      } else {
        fetchAllLikeCounts() // Update like count
      }
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
