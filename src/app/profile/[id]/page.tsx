"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import usePosts from "@/hooks/usePosts"
import { Button } from "@/components/ui/button"
import useFollow from "@/hooks/useFollow"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"

const UserProfile = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const { id } = params // URL에서 유저 ID 가져오기
  const { currentUserId, postNickname, postProfileImage, fetchPostUserData } =
    useAuth()
  const { posts, isFetchingNextPage, fetchPosts } = usePosts()
  const { followers, following, followCounts, toggleFollow, error } =
    useFollow(id)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showUnfollowModal, setShowUnfollowModal] = useState(false)

  useEffect(() => {
    fetchPostUserData(id)
    fetchPosts(1, id)
  }, [id, fetchPostUserData, fetchPosts])

  useEffect(() => {
    setIsFollowing(following.some((user) => user.id === id))
  }, [following, id])

  if (isFetchingNextPage || !posts) {
    return <div>Loading...</div>
  }

  const handleBackToHome = () => {
    router.push("/home")
  }

  const handleToggleFollow = () => {
    if (isFollowing) {
      setShowUnfollowModal(true)
    } else {
      toggleFollow(id)
    }
  }

  const handleUnfollow = () => {
    toggleFollow(id)
    setShowUnfollowModal(false)
  }

  const handleShowFollowers = () => {
    setShowFollowers(!showFollowers)
    setShowFollowing(false)
  }

  const handleShowFollowing = () => {
    setShowFollowing(!showFollowing)
    setShowFollowers(false)
  }

  return (
    <div>
      <Button onClick={handleBackToHome}>뒤로가기</Button>
      <div className="flex items-center mb-2">
        <img
          src={postProfileImage || ""}
          alt={`${postNickname}'s profile`}
          className="w-10 h-10 rounded-full mr-2"
          width="100"
          height="100"
        />
        <div>{postNickname || "Loading..."}</div>
      </div>
      <div>
        <button onClick={handleShowFollowers}>
          팔로워: {followCounts.followerCount}
        </button>
        {" | "}
        <button onClick={handleShowFollowing}>
          팔로잉: {followCounts.followingCount}
        </button>
        {currentUserId !== id && (
          <Button onClick={handleToggleFollow}>
            {isFollowing ? "언팔로우" : "팔로우"}
          </Button>
        )}
        <Dialog open={showUnfollowModal} onOpenChange={setShowUnfollowModal}>
          <DialogContent>
            <DialogHeader>언팔로우 확인</DialogHeader>
            <p>정말로 이 사용자를 언팔로우하시겠습니까?</p>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowUnfollowModal(false)}
              >
                취소
              </Button>
              <Button variant="destructive" onClick={handleUnfollow}>
                언팔로우
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {showFollowers && (
        <div>
          <h3>팔로워 목록</h3>
          {followers.length > 0 ? (
            followers.map((follower) => (
              <div key={follower.id}>
                <img
                  src={follower.profile_image || "/default-profile.png"}
                  alt={follower.nickname}
                  className="w-8 h-8 rounded-full"
                />
                <span>{follower.nickname}</span>
              </div>
            ))
          ) : (
            <p>팔로워가 없습니다.</p>
          )}
        </div>
      )}
      {showFollowing && (
        <div>
          <h3>팔로잉 목록</h3>
          {following.length > 0 ? (
            following.map((followedUser) => (
              <div key={followedUser.id}>
                <img
                  src={followedUser.profile_image || "/default-profile.png"}
                  alt={followedUser.nickname}
                  className="w-8 h-8 rounded-full"
                />
                <span>{followedUser.nickname}</span>
              </div>
            ))
          ) : (
            <p>팔로잉한 사용자가 없습니다.</p>
          )}
        </div>
      )}
      <h2>게시글 목록</h2>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.image_url && (
              <img src={post.image_url} alt="Post Image" className="mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserProfile
