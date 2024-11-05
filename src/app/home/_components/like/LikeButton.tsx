import useLike from "@/hooks/useLike"
import { throttle } from "lodash"
import React, { useCallback } from "react"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

const LikeButton: React.FC<{ postId: number }> = ({ postId }) => {
  const { toggleLike, isPostLikedByUser, getLikeCountForPost } = useLike()
  const isLiked = isPostLikedByUser(postId)
  const likeCount = getLikeCountForPost(postId)

  // throttle된 toggleLike 함수 생성
  const throttledToggleLike = useCallback(
    throttle(async (id: number) => {
      // 좋아요 토글 후 상태 업데이트
      await toggleLike(id)
    }, 300), // 300ms 간격으로 요청
    [toggleLike],
  )

  return (
    <div className="flex items-center mt-2">
      <button
        onClick={() => throttledToggleLike(postId)}
        className="mr-2 text-xl"
      >
        {isLiked ? (
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
