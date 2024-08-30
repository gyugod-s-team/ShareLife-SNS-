import React from "react"
import { Button } from "@/components/ui/button"
import usePosts from "@/hooks/usePosts"
import { Post } from "../../type"

type DeletePostModalProps = {
  post: Post
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ post }) => {
  const { deletePost } = usePosts()

  return (
    <>
      <Button onClick={() => deletePost(post.id)} className="mt-2">
        삭제
      </Button>
    </>
  )
}

export default DeletePostModal
