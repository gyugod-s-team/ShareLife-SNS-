"use client"
import React from "react"
import { useRouter } from "next/navigation"
import LikeButton from "../like/LikeButton"
import EditPostModal from "../post/EditPostModal"
import DeletePostButton from "../post/DeletePostButton"
import CommentSection from "../comment/CommentSection"
import Image from "next/image"
import TruncatedText from "../truncatedText/TruncatedText"
import useAuth from "@/hooks/useAuth"
import { Post } from "@/types/post"

const PostCard = React.forwardRef<HTMLDivElement, { post: Post }>(
  ({ post }, ref) => {
    const { currentUserId } = useAuth()
    const router = useRouter()

    const handleProfileClick = (userId: string) => {
      router.push(`/profile/${userId}`)
    }

    return (
      <article
        className="bg-neutral-900 text-white border-2 border-neutral-900 rounded-lg mb-6 shadow-sm"
        ref={ref}
      >
        <div className="flex items-center p-3">
          <Image
            src={post.users.profile_image}
            alt={`${post.users.nickname}'s profile`}
            className="w-8 h-8 rounded-full mr-3"
            width={32}
            height={32}
            loading="lazy"
          />
          <span
            onClick={() => handleProfileClick(post.user_id)}
            className="font-semibold text-sm cursor-pointer hover:underline"
          >
            {post.users.nickname}
          </span>
          {post.user_id === currentUserId && (
            <div className="ml-auto flex space-x-2">
              <EditPostModal post={post} />
              <DeletePostButton post={post} />
            </div>
          )}
        </div>

        {post.image_url && (
          <div
            className="relative w-full bg-neutral-800"
            style={{ paddingTop: "100%" }}
          >
            <Image
              src={post.image_url}
              alt="Post Image"
              layout="fill"
              objectFit="contain"
              className="absolute top-0 left-0 w-full h-full"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-3">
          <div className="mb-2">
            <div className="font-bold">
              <TruncatedText text={post.title} maxLength={20} maxLines={1} />
            </div>
            <div className="text-sm">
              <TruncatedText text={post.content} maxLength={30} maxLines={1} />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-2">
            <LikeButton postId={post.id} />
          </div>

          <CommentSection postId={post.id} />
        </div>
      </article>
    )
  },
)

export default PostCard
