"use client"

import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import usePosts from "@/hooks/usePosts"
import React, { useCallback, useRef } from "react"
import LikeButton from "./components/like/LikeButton"
import EditPostModal from "./components/post/EditPostModal"
import CreatePostModal from "./components/post/CreatePostModal"
import DeletePostModal from "./components/post/DeletePostModal"
import CommentSection from "./components/comment/CommentSection"
import Logout from "./components/logout/Logout"

const HomePage = () => {
  const { currentUserId } = useAuth()
  const { posts, loadMorePosts, hasNextPage, isFetchingNextPage } = usePosts()

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
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.content}</p>
              {post.image_url && (
                <img src={post.image_url} alt="Post Image" className="mt-2" />
              )}
              <LikeButton postId={post.id} />

              {post.user_id === currentUserId && (
                <>
                  <EditPostModal post={post} />
                  <DeletePostModal post={post} />
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
