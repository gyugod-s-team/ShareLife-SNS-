import React from "react"
import { Button } from "@/components/ui/button"
import usePosts from "@/hooks/usePosts"
import { Post } from "../../type"
import { FaTrash } from "react-icons/fa"

type DeletePostModalProps = {
  post: Post
}

const DeletePostButton: React.FC<DeletePostModalProps> = ({ post }) => {
  const { deletePost } = usePosts()

  return (
    <>
      <Button
        onClick={() => deletePost(post.id)}
        className="mt-2 p-2 bg-transparent border-none"
      >
        <FaTrash className="text-gray-200 hover:text-blue-500" size={15} />
      </Button>
    </>
  )
}

export default DeletePostButton
