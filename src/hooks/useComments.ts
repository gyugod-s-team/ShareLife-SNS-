import {
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query"
import React, { useMemo, useState } from "react"
import useAuth from "./useAuth"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Comment } from "@/app/home/type"

const ROWS_PER_PAGE = 20

const useComments = (postId: number) => {
  const { currentUserId } = useAuth()
  const [comment, setComment] = useState<string>("")
  const [editCommentId, setEditCommentId] = useState<number | null>(null)
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  type FetchCommentsResult = {
    data: Comment[]
    nextPage: number | undefined
  }

  // 댓글을 가져오는 비동기 함수
  const fetchComments = async (
    pageParam: number = 1,
  ): Promise<FetchCommentsResult> => {
    const { data, error } = await supabase
      .from("comments")
      .select("*", { count: "exact" })
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .range((pageParam - 1) * ROWS_PER_PAGE, pageParam * ROWS_PER_PAGE - 1)
      .returns<Comment[]>()

    if (error) {
      console.error("댓글 가져오기 오류:", error) // 에러 로깅
      throw new Error(error.message)
    }

    return {
      data: data || [],
      nextPage: data?.length === ROWS_PER_PAGE ? pageParam + 1 : undefined,
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
    const newCommentData = {
      post_id: postId,
      user_id: currentUserId,
      content: commentText,
    }
    const { error } = await supabase.from("comments").insert([newCommentData])

    if (error) {
      toast({
        title: "댓글 작성 중 오류가 발생하였습니다",
        description: error.message,
      })
      console.error("댓글 생성 오류:", error) // 에러 로깅
    } else {
      toast({ title: "댓글이 작성되었습니다" })
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    }
  }

  // 댓글 수정 함수
  const updateComment = async (commentId: number, updatedContent: string) => {
    if (!currentUserId) return

    const { error } = await supabase
      .from("comments")
      .update({ content: updatedContent })
      .eq("id", commentId)
      .eq("user_id", currentUserId)

    if (error) {
      toast({
        title: "댓글 수정 중 오류가 발생하였습니다",
        description: error.message,
      })
      console.error("댓글 수정 오류:", error) // 에러 로깅
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

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", currentUserId)

    if (error) {
      toast({
        title: "댓글 삭제 중 오류가 발생하였습니다",
        description: error.message,
      })
      console.error("댓글 삭제 오류:", error) // 에러 로깅
    } else {
      toast({ title: "댓글이 삭제되었습니다" })
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    }
  }

  // 댓글 생성 또는 수정 핸들러
  const handleCreateOrUpdateComment = async () => {
    if (editCommentId) {
      await updateComment(editCommentId, comment)
    } else {
      await createComment(comment)
    }

    resetForm() // 폼 초기화
    setShowCommentModal(false) // 모달 닫기
  }

  // 댓글 수정 핸들러
  const handleEditComment = (comment: Comment) => {
    setEditCommentId(comment.id)
    setComment(comment.content)
    setShowCommentModal(true)
  }

  // 폼 초기화 함수
  const resetForm = () => {
    setComment("")
    setEditCommentId(null)
  }

  return {
    comments,
    loadMoreComments,
    hasNextPage,
    isFetchingNextPage,
    status,
    comment,
    setComment,
    showCommentModal,
    setShowCommentModal,
    handleCreateOrUpdateComment,
    handleEditComment,
    deleteComment,
    resetForm,
  }
}

export default useComments
