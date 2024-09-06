// components/CommentSection.tsx
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useComments from "@/hooks/useComments"
import useAuth from "@/hooks/useAuth"

type CommentSectionProps = {
  postId: number
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const {
    comments,
    comment,
    setComment,
    handleCreateOrUpdateComment,
    handleEditComment,
  } = useComments(postId)
  const { currentUserId } = useAuth()
  return (
    <div className="mt-4">
      <Input
        placeholder="댓글을 입력하세요"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleCreateOrUpdateComment} className="mt-2">
        댓글 작성
      </Button>
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border p-2 mt-2">
            <p>{comment.content}</p>
            {comment.user_id === currentUserId && (
              <Button
                onClick={() => handleEditComment(comment)}
                className="mt-1"
              >
                수정
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentSection
