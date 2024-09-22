// components/CommentSection.tsx
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useComments from "@/hooks/useComments"
import useAuth from "@/hooks/useAuth"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

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
    setShowCommentModal,
    editCommentId,
  } = useComments(postId)
  const { currentUserId } = useAuth()

  return (
    <div className="mt-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="text-black flex-1" // flex-1로 input을 넓게 만듦
        />
        <Button
          onClick={handleCreateOrUpdateComment}
          className="whitespace-nowrap"
        >
          댓글 작성
        </Button>
      </div>

      {/* 댓글 리스트 */}
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className=" p-2 mt-2 relative">
            {/* 댓글 내용 */}
            <p>{comment.content}</p>

            {/* 수정 및 삭제 버튼을 이모티콘으로 변경하고, 오른쪽 상단에 배치 */}
            {comment.user_id === currentUserId && (
              <div className="absolute top-1 right-1 space-x-2">
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
        ))}
      </div>

      {/* 댓글 수정 모달 */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <Input
              placeholder="댓글을 수정하세요"
              value={editComment} // 수정할 때는 editComment만 사용
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
