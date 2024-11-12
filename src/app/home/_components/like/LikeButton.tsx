import useLike from "@/hooks/useLike"
import { throttle } from "lodash"
import React, { useCallback } from "react"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

const LikeButton: React.FC<{ postId: number }> = ({ postId }) => {
  const { toggleLike, isLiked, likeCounts } = useLike()
  const isPostLiked = isLiked(postId)
  const likeCount = likeCounts[postId] || 0

  // Create a throttled version of toggleLike
  const throttledToggleLike = useCallback(
    throttle(async (id: number) => {
      // Toggle like and update state
      await toggleLike(id)
    }, 300), // 300ms throttle
    [toggleLike],
  )

  return (
    <div className="flex items-center mt-2">
      <button
        onClick={() => throttledToggleLike(postId)}
        className="mr-2 text-xl"
      >
        {isPostLiked ? (
          <AiFillHeart className="text-red-500" />
        ) : (
          <AiOutlineHeart className="text-gray-500" />
        )}
      </button>
      <span>{likeCount} Likes</span>
    </div>
  )
}

export default LikeButton
