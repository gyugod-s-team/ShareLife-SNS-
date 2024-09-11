"use client"
import { useToast } from "@/components/ui/use-toast"
import useAuth from "@/hooks/useAuth"
import useFollow from "@/hooks/useFollow"
import usePosts from "@/hooks/usePosts"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const { currentUserId, fetchPostUserData } = useAuth()
  const { posts, loadMorePosts, hasNextPage, isFetchingNextPage } = usePosts()
  const {
    isFollowingUser: checkIsFollowingUser,
    toggleFollow,
    followCounts,
    followers,
    following,
    fetchFollowers,
    fetchFollowing,
  } = useFollow()
  const { toast } = useToast()
  const router = useRouter()

  // 프로필 상태 정의
  const [profile, setProfile] = useState<{
    nickname: string | null
    profile_image: string | null
  } | null>(null)
  const [isFollowersModalOpen, setFollowersModalOpen] = useState(false)
  const [isFollowingModalOpen, setFollowingModalOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [loadingFollowers, setLoadingFollowers] = useState<boolean>(false)
  const [loadingFollowing, setLoadingFollowing] = useState<boolean>(false)

  const handleBackHome = () => {
    router.push("/home")
  }

  // 프로필 데이터를 불러오는 함수
  const fetchProfile = async () => {
    try {
      const profileData = await fetchPostUserData(id) // 프로필 데이터 가져오는 함수
      console.log(profileData, "111111111111111")
      setProfile(profileData)
      const followingStatus = await checkIsFollowingUser(id)
      setIsFollowing(followingStatus)
    } catch (error) {
      toast({
        title: "프로필 불러오기 실패",
        description: (error as Error).message,
      })
    }
  }

  // useEffect로 프로필 데이터 불러오기
  useEffect(() => {
    fetchProfile()
  }, [id])

  // 팔로우 상태 토글
  const handleToggleFollow = async () => {
    try {
      await toggleFollow(id)
      const followingStatus = await checkIsFollowingUser(id)
      setIsFollowing(followingStatus)

      toast({
        title: isFollowing ? "팔로우 취소" : "팔로우",
        description: isFollowing
          ? "이제 언팔로우 되었습니다."
          : "팔로우 되었습니다.",
      })
    } catch (error) {
      toast({
        title: "팔로우 상태 변경 실패",
        description: (error as Error).message,
      })
    }
  }

  const handleShowFollowers = async () => {
    try {
      setLoadingFollowers(true)
      await fetchFollowers(id)
      setFollowersModalOpen(true)
    } catch (error) {
      toast({
        title: "팔로워 불러오기 실패",
        description: (error as Error).message,
      })
    } finally {
      setLoadingFollowers(false)
    }
  }

  const handleShowFollowing = async () => {
    try {
      setLoadingFollowing(true)
      await fetchFollowing(currentUserId)
      setFollowingModalOpen(true)
    } catch (error) {
      toast({
        title: "팔로잉 불러오기 실패",
        description: (error as Error).message,
      })
    } finally {
      setLoadingFollowing(false)
    }
  }

  const userPosts = posts.filter((post) => post.user_id === id)

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
    <>
      <button
        onClick={handleBackHome}
        className="mb-4 px-4 py-2 text-white bg-gray-500 rounded"
      >
        Back
      </button>
      <div className="flex items-center mb-2">
        {profile && (
          <>
            <Image
              src={profile.profile_image || "/default-profile.png"}
              alt={`${profile.nickname || "User"}'s profile`}
              className="w-10 h-10 rounded-full mr-2"
              width={100}
              height={100}
            />
            <span className="font-bold text-lg">{profile.nickname}</span>
          </>
        )}
        {id !== currentUserId && (
          <button
            onClick={handleToggleFollow}
            className={`ml-4 px-4 py-2 text-white ${
              isFollowing ? "bg-red-500" : "bg-blue-500"
            } rounded transition-colors duration-300`}
          >
            {isFollowing ? "언팔로우" : "팔로우"}
          </button>
        )}
      </div>
      <div className="mb-4">
        <span className="cursor-pointer" onClick={handleShowFollowers}>
          {`팔로워 ${followCounts.followerCount}`}
        </span>
        <span className="cursor-pointer ml-4" onClick={handleShowFollowing}>
          {`팔로잉 ${followCounts.followingCount}`}
        </span>
      </div>
      {userPosts.map((post, index) => (
        <div
          key={post.id}
          className="border p-4 mb-4"
          ref={index === userPosts.length - 1 ? lastPostElementRef : null}
        >
          <h3 className="font-bold">{post.title}</h3>
          <p>{post.content}</p>
          {post.image_url && (
            <img src={post.image_url} alt="Post Image" className="mt-2" />
          )}
        </div>
      ))}
      {isFetchingNextPage && <div>Loading more posts...</div>}
      {/* 팔로워 모달 */}
      <Dialog open={isFollowersModalOpen} onOpenChange={setFollowersModalOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="font-bold text-lg mb-4">팔로워 목록</h2>
          </DialogHeader>
          {loadingFollowers ? (
            <p>Loading...</p>
          ) : followers.length > 0 ? (
            followers.map((follower) => (
              <div key={follower.id} className="flex items-center mb-2">
                <span>{follower.nickname}</span>
                {follower.profile_image && (
                  <img
                    src={follower.profile_image}
                    alt={`${follower.nickname}'s profile`}
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            ))
          ) : (
            <p>팔로워가 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>
      {/* 팔로잉 모달 */}
      <Dialog open={isFollowingModalOpen} onOpenChange={setFollowingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="font-bold text-lg mb-4">팔로잉 목록</h2>
          </DialogHeader>
          {loadingFollowing ? (
            <p>Loading...</p>
          ) : following.length > 0 ? (
            following.map((followedUser) => (
              <div key={followedUser.id} className="flex items-center mb-2">
                <span>{followedUser.nickname}</span>
                {followedUser.profile_image && (
                  <img
                    src={followedUser.profile_image}
                    alt={`${followedUser.nickname}'s profile`}
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            ))
          ) : (
            <p>팔로잉한 사용자가 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProfilePage
