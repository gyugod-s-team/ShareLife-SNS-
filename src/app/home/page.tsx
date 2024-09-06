"use client"

import useAuth from "@/hooks/useAuth"
import usePosts from "@/hooks/usePosts"
import React, { useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Logout from "./_components/logout/Logout"
import CreatePostModal from "./_components/post/CreatePostModal"
import LikeButton from "./_components/like/LikeButton"
import EditPostModal from "./_components/post/EditPostModal"
import DeletePostButton from "./_components/post/DeletePostButton"
import CommentSection from "./_components/comment/CommentSection"
import Image from "next/image"

const HomePage = () => {
  const { currentUserId, nickname, profileImage } = useAuth()
  const { posts, loadMorePosts, hasNextPage, isFetchingNextPage } = usePosts()
  const router = useRouter()

  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          loadMorePosts()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, loadMorePosts],
  )

  const handleProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  return (
    <div>
      <Logout />
      <CreatePostModal />
      <div className="mt-8">
        {posts.map((post, index) => {
          return (
            <div
              key={post.id}
              className="border p-4 mb-4"
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              <span
                onClick={() => handleProfileClick(post.user_id)}
                className="cursor-pointer"
              >
                <div className="flex items-center mb-2">
                  <Image
                    src={post.users.profile_image} // 프로필 이미지
                    alt={`${post.users.nickname}'s profile`}
                    className="w-10 h-10 rounded-full mr-2"
                    width={100}
                    height={100}
                  />
                  <span
                    onClick={() => handleProfileClick(post.user_id)}
                    className="cursor-pointer font-semibold"
                  >
                    {post.users.nickname} {/* 닉네임 */}
                  </span>
                </div>
              </span>
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.content}</p>
              {post.image_url && (
                <img src={post.image_url} alt="Post Image" className="mt-2" />
              )}
              <LikeButton postId={post.id} />

              {post.user_id === currentUserId && (
                <>
                  <EditPostModal post={post} />
                  <DeletePostButton post={post} />
                </>
              )}
              <CommentSection postId={post.id} />
            </div>
          )
        })}
        {isFetchingNextPage && <div>Loading more posts...</div>}
      </div>
    </div>
  )
}

export default HomePage
