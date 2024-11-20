// components/CommentSection.tsx
"use client"
import React, { useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useComments from "@/hooks/useComments"
import useAuth from "@/hooks/useAuth"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import TruncatedText from "@/app/home/_components/truncatedText/TruncatedText"

type CommentSectionProps = {
  postId: number
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const {
    comments,
    comment,
    setComment,
    editComment,
    setEditComment,
    handleCreateOrUpdateComment,
    handleEditComment,
    deleteComment,
    showCommentModal,
    loadMoreComments,
    setShowCommentModal,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useComments(postId)

  const { currentUserId } = useAuth()

  // 무한 스크롤을 위한 observer 설정
  const observer = useRef<IntersectionObserver | null>(null)

  // 마지막 댓글을 감지하는 콜백 함수
  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          loadMoreComments() // 추가 댓글 로드
        }
      })
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, loadMoreComments],
  )

  return (
    <div className="mt-4">
      {/* 댓글 입력 필드 */}
      <div className="sticky top-0 bg-neutral-900">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="댓글을 입력하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-black flex-1"
          />
          <Button
            onClick={handleCreateOrUpdateComment}
            className="whitespace-nowrap"
          >
            댓글 작성
          </Button>
        </div>
      </div>

      {/* 댓글 리스트 - 스크롤 가능한 컨테이너 */}
      <div className="mt-4 overflow-y-auto max-h-60">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 mb-2" />
            ))
          : comments.map((comment, index) => (
              <div
                key={comment.id}
                className="border border-blue-300 rounded-lg p-2 mt-2 relative"
                ref={
                  index === comments.length - 1 ? lastCommentElementRef : null
                } // 마지막 댓글 요소에 ref 설정
              >
                {/* 댓글 내용 */}
                <div className="flex justify-between items-start">
                  <TruncatedText
                    text={comment.content}
                    maxLength={20}
                    maxLines={2}
                  />

                  {/* 수정 및 삭제 버튼 */}
                  {comment.user_id === currentUserId && (
                    <div className="ml-2 flex flex-col space-y-1">
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="text-gray-500 hover:text-blue-500"
                        title="수정"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-gray-500 hover:text-red-500"
                        title="삭제"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

        {/* 추가 댓글 로드 중일 때 스켈레톤 표시 */}
        {isFetchingNextPage && <Skeleton className="h-10 mb-2" />}
      </div>

      {/* 댓글 수정 모달 */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <Input
              placeholder="댓글을 수정하세요"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={handleCreateOrUpdateComment}
              className="mt-4 w-full"
            >
              수정
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentSection
