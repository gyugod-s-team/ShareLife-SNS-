"use client"
import { useEffect, useState } from "react"
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
import Header from "../_components/Header"
import LikeButton from "@/app/home/_components/like/LikeButton"
import CommentSection from "@/app/home/_components/comment/CommentSection"
import { Post } from "@/app/home/type"
import { useToast } from "@/components/ui/use-toast"

const UserProfile = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const { currentUserId, postNickname, postProfileImage, fetchPostUserData } =
    useAuth()
  const { posts, isFetchingNextPage, fetchPosts } = usePosts(id)
  const { followers, following, followCounts, toggleFollow, isFollowingUser } =
    useFollow(id)
  const [showPostModal, setShowPostModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchPostUserData(id)
      fetchPosts(1, id)
    }
  }, [id, fetchPostUserData, fetchPosts])

  const handleToggleFollow = async () => {
    if (isFollowingUser(id)) {
      setShowUnfollowConfirm(true)
    } else {
      try {
        await toggleFollow(id)
        toast({
          title: "팔로우 성공",
          description: `${postNickname}님을 팔로우하였습니다.`,
        })
      } catch (error) {
        console.error("Follow Error:", error)
        toast({
          title: "팔로우 오류",
          description: (error as Error).message,
        })
      }
    }
  }

  const handleConfirmUnfollow = async () => {
    setShowUnfollowConfirm(false) // Confirm dialog 닫기
    try {
      await toggleFollow(id) // 언팔로우 요청
      toast({
        title: "언팔로우 성공",
        description: `${postNickname}님을 언팔로우하였습니다.`,
      })
    } catch (error) {
      console.error("Unfollow Error:", error)
      toast({
        title: "언팔로우 오류",
        description: (error as Error).message,
      })
    }
  }

  const handleShowFollowers = () => setShowFollowers(true)
  const handleShowFollowing = () => setShowFollowing(true)
  const handleCloseDialog = () => {
    setShowFollowers(false)
    setShowFollowing(false)
  }

  const handlePostClick = (post: Post) => {
    if (post) {
      setSelectedPost(post)
      setShowPostModal(true)
    }
  }

  const handleClosePostModal = () => setShowPostModal(false)

  if (isFetchingNextPage || !posts) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-800 text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="bg-neutral-800 min-h-screen text-white">
      <Header />
      <main className="max-w-[600px] my-5 mx-auto pt-16 pb-8 px-4">
        <div className="bg-neutral-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <Image
              src={postProfileImage || "/default-avatar.png"}
              alt={`${postNickname || "User"}'s profile`}
              className="w-20 h-20 rounded-full mr-6"
              width={80}
              height={80}
            />
            <div>
              <h1 className="font-semibold text-2xl mb-2">
                {postNickname || "Loading..."}
              </h1>
              <div className="flex space-x-4">
                <button onClick={handleShowFollowers} className="text-sm">
                  <span className="font-bold">
                    {followCounts.followerCount || 0}
                  </span>{" "}
                  followers
                </button>
                <button onClick={handleShowFollowing} className="text-sm">
                  <span className="font-bold">
                    {followCounts.followingCount || 0}
                  </span>{" "}
                  following
                </button>
              </div>
            </div>
          </div>
          {currentUserId !== id && (
            <Button
              onClick={handleToggleFollow}
              className={`w-full ${isFollowingUser(id) ? "bg-neutral-700" : "bg-blue-600"}`}
            >
              {isFollowingUser(id) ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
        {/* Rest of the component remains the same */}
      </main>

      {/* Unfollow Confirmation Dialog */}
      <Dialog open={showUnfollowConfirm} onOpenChange={setShowUnfollowConfirm}>
        <DialogContent className="bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle>Unfollow Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to unfollow {postNickname}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowUnfollowConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmUnfollow}>
              Unfollow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Other existing dialogs */}
    </div>
  )
}

export default UserProfile
