"use client"
import usePosts from "@/hooks/usePosts"
import React, { useCallback, useRef } from "react"
import PostCard from "../_components/post/PostCard"
import PostSkeleton from "./skeleton/PostSkeleton"
import { Post } from "@/types/post"

interface HomePageProps {
  initialPosts: Post[] // Post 배열로 타입 정의
}

const HomePage: React.FC<HomePageProps> = ({ initialPosts }) => {
  const {
    posts,
    loadMorePosts,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePosts(undefined, initialPosts)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return

      if (observer.current) observer.current.disconnect() // 연결 해제
      if (node) {
        observer.current = new IntersectionObserver(
          (entries) => {
            console.log(
              "IntersectionObserver triggered",
              entries[0].isIntersecting,
            ) // 로그 추가
            if (entries[0].isIntersecting && hasNextPage) {
              console.log("Loading more posts...") // 로그 추가
              loadMorePosts()
            }
          },
          { rootMargin: "100px" },
        )
        observer.current.observe(node)
      }
    },
    [isFetchingNextPage, hasNextPage, loadMorePosts],
  )

  if (isLoading) {
    return (
      <div className="bg-neutral-800 min-h-screen">
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

  return (
    <div className="bg-neutral-800 min-h-screen">
      <main className="my-5 max-w-[600px] mx-auto pt-16 pb-8 px-2">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            ref={index === posts.length - 1 ? lastPostElementRef : null}
          />
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
