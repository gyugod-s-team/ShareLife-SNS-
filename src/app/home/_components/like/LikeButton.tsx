import useLike from "@/hooks/useLike"
import React from "react"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

const LikeButton: React.FC<{ postId: number }> = ({ postId }) => {
  const { toggleLike, isPostLikedByUser, getLikeCountForPost } = useLike()
  const isLiked = isPostLikedByUser(postId)
  const likeCount = getLikeCountForPost(postId)

  return (
    <div className="flex items-center mt-2">
      <button onClick={() => toggleLike(postId)} className="mr-2 text-xl">
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
