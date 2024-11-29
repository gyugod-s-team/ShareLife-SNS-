import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import useAuth from "./useAuth"
import useFollow from "./useFollow"
import { Post } from "@/types/post"
import { useToast } from "@/components/ui/use-toast"

export interface UserProfile {
  id: string
  nickname: string | null
  profile_image: string | null
}

export function useProfile(userId: string) {
  const { fetchPostUserData } = useAuth()
  const { isFollowing, toggleFollow } = useFollow(userId)
  // 상태 관리
  const [showPostModal, setShowPostModal] = useState<boolean>(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showFollowers, setShowFollowers] = useState<boolean>(false)
  const [showFollowing, setShowFollowing] = useState<boolean>(false)
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // useQuery를 사용하여 사용자 데이터를 가져옵니다.
  const {
    data: userData,
    isSuccess: isUserDataSuccess,
    isError: isUserDataError,
    isLoading: isUserDataLoading,
  } = useQuery({
    queryKey: ["postUserData", userId],
    queryFn: () => fetchPostUserData(userId), // fetchPostUserData를 호출할 때 id를 전달합니다.
    enabled: !!userId, // id가 있을 때만 쿼리를 활성화합니다.
    staleTime: 10 * 60 * 1000, // 5분 동안 신선한 데이터로 유지
    refetchInterval: false, // 자동 갱신 비활성화
    gcTime: 10 * 60 * 1000, // cacheTime임 10분동엔 메모리 유지
  })

  const handleToggleFollow = async () => {
    if (isFollowing) {
      setShowUnfollowConfirm(true)
    } else {
      try {
        await toggleFollow(userId)
        queryClient.invalidateQueries({ queryKey: ["postUserData", userId] })
        toast({
          title: "팔로우 성공",
          description: `${userData.nickname}님을 팔로우하였습니다.`,
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
    setShowUnfollowConfirm(false)
    try {
      await toggleFollow(userId)
      toast({
        title: "언팔로우 성공",
        description: `${userData.nickname}님을 언팔로우하였습니다.`,
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

  const handlePostClick = (post: Post) => {
    if (post) {
      setSelectedPost(post)
      setShowPostModal(true)
    }
  }

  return {
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
  }
}
