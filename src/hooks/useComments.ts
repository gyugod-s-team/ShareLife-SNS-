import {
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useMemo, useState } from "react"
import useAuth from "./useAuth"
import { useToast } from "@/components/ui/use-toast"
import { Comment } from "@/app/home/type"

type FetchCommentsResult = {
  data: Comment[]
  nextPage: number | undefined
}

const ROWS_PER_PAGE = 20

const useComments = (postId: number) => {
  const { currentUserId } = useAuth()
  const [comment, setComment] = useState<string>("")
  const [editComment, setEditComment] = useState<string>("") // 댓글 수정용 상태
  const [editCommentId, setEditCommentId] = useState<number | null>(null)
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false)
  // const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // 댓글을 가져오는 비동기 함수
  const fetchComments = async (
    pageParam: number = 1,
  ): Promise<FetchCommentsResult> => {
    const response = await fetch(
      `/api/comments?postId=${postId}&page=${pageParam}`,
    )
    if (!response.ok) {
      throw new Error("댓글 가져오기 오류")
    }
    const result = await response.json()
    return {
      data: result.data,
      nextPage: result.nextPage,
    }
  }

  // 댓글을 가져오는 쿼리
  const {
    data: commentsData,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) => fetchComments(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  const comments = useMemo(
    () => commentsData?.pages.flatMap((page) => page.data) || [],
    [commentsData],
  )

  // 댓글 더불러오기 함수
  const loadMoreComments = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  // 댓글 생성 함수
  const createComment = async (commentText: string) => {
    if (!postId || !currentUserId || !commentText) {
      toast({
        title: "댓글 작성 오류",
        description: "필수 필드가 누락되었습니다.",
      })
      return
    }

    const newCommentData = {
      post_id: postId,
      user_id: currentUserId,
      content: commentText,
    }

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCommentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      toast({
        title: "댓글 작성 중 오류가 발생하였습니다",
        description: errorData.error,
      })
    } else {
      toast({ title: "댓글이 작성되었습니다" })
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    }
  }

  // 댓글 수정 함수
  const updateComment = async (commentId: number, updatedContent: string) => {
    if (!currentUserId) return

    const updatedCommentData = {
      commentId,
      userId: currentUserId,
      content: updatedContent,
    }

    const response = await fetch("/api/comments", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCommentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      toast({
        title: "댓글 수정 중 오류가 발생하였습니다",
        description: errorData.error,
      })
    } else {
      toast({ title: "댓글이 수정되었습니다" })
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    }
  }

  // 댓글 삭제 함수
  const deleteComment = async (commentId: number) => {
    if (!currentUserId) return

    const confirmDelete = window.confirm("정말로 이 댓글을 삭제하시겠습니까?")
    if (!confirmDelete) return

    const deleteCommentData = {
      commentId,
      userId: currentUserId,
    }

    const response = await fetch("/api/comments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteCommentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      toast({
        title: "댓글 삭제 중 오류가 발생하였습니다",
        description: errorData.error,
      })
    } else {
      toast({ title: "댓글이 삭제되었습니다" })
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    }
  }

  // 댓글 생성 또는 수정 핸들러
  const handleCreateOrUpdateComment = async () => {
    if (!comment.trim() && !editComment.trim()) {
      toast({
        title: "댓글을 입력해주세요",
        description: "빈 댓글은 작성할 수 없습니다.",
      })
      return // 댓글이 비어있으면 함수 종료
    }

    if (editCommentId) {
      await updateComment(editCommentId, editComment)
    } else {
      await createComment(comment)
    }

    resetForm() // 폼 초기화
    setShowCommentModal(false) // 모달 닫기
  }

  // 댓글 수정 핸들러
  const handleEditComment = (comment: Comment) => {
    setEditCommentId(comment.id)
    setEditComment(comment.content)
    setShowCommentModal(true)
  }

  // 폼 초기화 함수
  const resetForm = () => {
    setComment("")
    setEditComment("")
    setEditCommentId(null)
  }

  return {
    comments,
    loadMoreComments,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    comment,
    setComment,
    editComment, // 수정용 상태 반환
    setEditComment, // 수정용 상태 변경 함수 반환
    showCommentModal,
    setShowCommentModal,
    handleCreateOrUpdateComment,
    handleEditComment,
    deleteComment,
    editCommentId,
    resetForm,
  }
}

export default useComments
