"use client"

import useAuth from "@/hooks/useAuth"
import usePosts from "@/hooks/usePosts"
import React, { useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import LikeButton from "../_components/like/LikeButton"
import EditPostModal from "../_components/post/EditPostModal"
import DeletePostButton from "../_components/post/DeletePostButton"
import CommentSection from "../_components/comment/CommentSection"
import Image from "next/image"
import Header from "@/app/home/_components/Header"
import PostSkeleton from "../_components/PostSkeleton"
import TruncatedText from "../_components/TruncatedText"

const HomePage = () => {
  const { currentUserId } = useAuth()
  const {
    posts,
    loadMorePosts,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePosts()
  const router = useRouter()

  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            loadMorePosts()
          }
        },
        { rootMargin: "100px" },
      ) // 스크롤 끝에서 100px 전에 로드
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, loadMorePosts],
  )

  if (isLoading) {
    return (
      <div className="bg-neutral-800 min-h-screen">
        <Header />
        <main className="my-5 max-w-[600px] mx-auto pt-16 pb-8 px-2">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </main>
      </div>
    )
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>
  }

  const handleProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  return (
    <div className="bg-neutral-800 min-h-screen">
      <Header />
      <main className="my-5 max-w-[600px] mx-auto pt-16 pb-8 px-2">
        {posts.map((post, index) => (
          <article
            key={post.id}
            className="bg-neutral-900 text-white border-2 border-neutral-900 rounded-lg mb-6 shadow-sm"
            ref={index === posts.length - 1 ? lastPostElementRef : null}
          >
            <div className="flex items-center p-3 ">
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
                <div className="ml-auto flex space-x-2 ">
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
                  {" "}
                  {/* 제목을 더 두드러지게 */}
                  <TruncatedText
                    text={post.title}
                    maxLength={20}
                    maxLines={1}
                  />
                </div>
                <div className="text-sm">
                  {" "}
                  {/* 타이틀을 덜 강조 */}
                  <TruncatedText
                    text={post.content}
                    maxLength={30}
                    maxLines={1}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-2">
                <LikeButton postId={post.id} />
                {/* Add comment icon and share icon here */}
              </div>

              <CommentSection postId={post.id} />
            </div>
          </article>
        ))}
        {isFetchingNextPage && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}
      </main>
    </div>
  )
}

export default HomePage
