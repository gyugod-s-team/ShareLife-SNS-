"use client"
import { useEffect } from "react"
import useAuth from "@/hooks/useAuth"
import usePosts from "@/hooks/usePosts"
import useFollow from "@/hooks/useFollow"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import CommentSection from "@/app/home/_components/comment/CommentSection"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import ProfileSkeleton from "./skeleton/ProfileSkeleton"
import PostsSkeleton from "./skeleton/PostsSkeleton"
import Header from "./header/Header"
import { useProfile } from "@/hooks/useProfile"

const UserProfile = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const { currentUserId } = useAuth()
  const { posts, isFetchingNextPage, isError, error, isLoading, fetchPosts } =
    usePosts(id)
  const { followers, following, followCounts, isFollowing } = useFollow(id)
  const {
    userData,
    isUserDataSuccess,
    isUserDataError,
    isUserDataLoading,
    handleToggleFollow,
    handleConfirmUnfollow,
    handleShowFollowers,
    handleShowFollowing,
    handlePostClick,
    showPostModal,
    selectedPost,
    showFollowers,
    showFollowing,
    showUnfollowConfirm,
    setShowPostModal,
    setShowFollowers,
    setShowFollowing,
    setShowUnfollowConfirm,
  } = useProfile(id)

  useEffect(() => {
    if (id) {
      fetchPosts(1, id)
    }
  }, [id, fetchPosts])

  if (isUserDataLoading) {
    return (
      <div className="bg-neutral-800 min-h-screen text-white">
        <Header />
        <main className="max-w-[935px] my-5 mx-auto pt-16 pb-8 px-4">
          <ProfileSkeleton />
          <PostsSkeleton />
        </main>
      </div>
    )
  }

  if (isFetchingNextPage || !posts) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-800 text-white">
        <Skeleton count={1} height={50} className="mb-4" />
        <Skeleton count={5} height={200} />
      </div>
    )
  }

  if (isLoading || !isUserDataSuccess) {
    return (
      <div className="bg-neutral-800 min-h-screen text-white">
        <Header />
        <main className="max-w-[935px] my-5 mx-auto pt-16 pb-8 px-4">
          <ProfileSkeleton />
          <PostsSkeleton />
        </main>
      </div>
    )
  }

  if (isUserDataError || isError) {
    return <div className="text-white">Error: {(error as Error).message}</div>
  }

  return (
    <div className="bg-neutral-800 min-h-screen text-white">
      <Header />
      <main className="max-w-[935px] my-5 mx-auto pt-16 pb-8 px-4">
        <div className="flex items-center mb-10">
          {userData.profile_image ? (
            <Image
              // src={postProfileImage}
              src={userData.profile_image}
              alt={`${userData.nickname || "User"}'s profile`}
              className="w-36 h-36 rounded-full mr-10"
              width={144}
              height={144}
              loading="lazy"
            />
          ) : (
            <Skeleton circle height={144} width={144} className="mr-10" />
          )}
          <div>
            <div className="flex items-center mb-4">
              {userData.nickname ? (
                <h1 className="text-2xl mr-4">{userData.nickname}</h1>
              ) : (
                <Skeleton width={150} height={30} />
              )}
              {currentUserId !== id && (
                <Button
                  onClick={handleToggleFollow}
                  className={`px-6 ${isFollowing ? "bg-neutral-700" : "bg-blue-600"}`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
            <div className="flex space-x-8 mb-4">
              <span>
                <strong>{posts.length}</strong> posts
              </span>
              <button onClick={handleShowFollowers}>
                <strong>{followCounts.followerCount || 0}</strong> followers
              </button>
              <button onClick={handleShowFollowing}>
                <strong>{followCounts.followingCount || 0}</strong> following
              </button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square cursor-pointer relative group"
              onClick={() => handlePostClick(post)}
            >
              <Image
                src={post.image_url}
                alt={post.image_url || "Post image"}
                layout="fill"
                objectFit="cover"
                className="rounded-sm"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-center"></div>
              </div>
            </div>
          ))}
        </div>
        {isFetchingNextPage && <PostsSkeleton />}
      </main>

      {/* Post Modal */}
      <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
        <DialogContent className="bg-neutral-900 text-white p-0 w-full max-w-[1000px] h-[90vh] max-h-[90vh] overflow-hidden">
          {selectedPost ? (
            <div className="flex h-full">
              {/* Image Section */}
              <div className="w-3/5 bg-black relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={selectedPost.image_url}
                    alt={selectedPost.image_url || "Post image"}
                    layout="fill"
                    objectFit="contain"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Post Details Section */}
              <div className="w-2/5 flex flex-col h-full">
                <div className="p-4 border-b border-neutral-700 flex items-center">
                  <Image
                    src={userData.profile_image || "/default-avatar.png"}
                    alt={userData.nickname || "User"}
                    width={32}
                    height={32}
                    className="rounded-full mr-3"
                    loading="lazy"
                  />
                  <span className="font-semibold">{userData.nickname}</span>
                </div>

                {/* Scrollable Comment Section */}
                <div className="flex-grow overflow-y-auto max-h-[60vh]">
                  <CommentSection postId={selectedPost.id} />
                </div>
              </div>
            </div>
          ) : (
            <Skeleton height={300} />
          )}
        </DialogContent>
      </Dialog>

      {/* Followers Dialog */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {followers.length > 0 ? (
              followers.map((follower) => (
                <div
                  key={follower.user_id}
                  className="flex items-center space-x-4"
                >
                  <Image
                    src={follower.profile_image || "/default-avatar.png"}
                    alt={follower.nickname}
                    width={40}
                    height={40}
                    className="rounded-full"
                    loading="lazy"
                  />
                  <span>{follower.nickname}</span>
                </div>
              ))
            ) : (
              <Skeleton count={3} height={40} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {following.length > 0 ? (
              following.map((followed) => (
                <div
                  key={followed.user_id}
                  className="flex items-center space-x-4"
                >
                  <Image
                    src={followed.profile_image || "/default-avatar.png"}
                    alt={followed.nickname}
                    width={40}
                    height={40}
                    className="rounded-full"
                    loading="lazy"
                  />
                  <span>{followed.nickname}</span>
                </div>
              ))
            ) : (
              <Skeleton count={3} height={40} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Unfollow Confirmation */}
      <Dialog open={showUnfollowConfirm} onOpenChange={setShowUnfollowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>언팔로우</DialogTitle>
            <DialogDescription>정말 언팔로우 하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnfollowConfirm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmUnfollow}>Unfollow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserProfile
