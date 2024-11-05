import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import usePosts from "@/hooks/usePosts"
import { Post } from "../../type"
import Image from "next/image"
import { FaPencilAlt } from "react-icons/fa" // Font Awesome

type EditPostModalProps = {
  post: Post
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post }) => {
  const {
    title,
    content,
    imagePreview,
    showModal,
    handleFileChange,
    setTitle,
    setContent,
    debouncedUpdatePost,
    handleEditPost,
    setShowModal,
  } = usePosts()

  const handleOpenModal = () => {
    handleEditPost(post)
    setShowModal(true)
  }

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="mt-2 p-0 bg-transparent border-none"
      >
        <FaPencilAlt
          className="text-white cursor-pointer hover:text-blue-500"
          size={15}
        />
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <Input
              placeholder="제목을 수정해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full" // 너비를 100%로 설정
            />
            <Input
              placeholder="내용을 수정해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 w-full" // 너비를 100%로 설정
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 w-full" // 너비를 100%로 설정
            />
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                className="mt-2 rounded-md object-cover h-48 w-full" // 고정된 높이 및 너비
                width={400} // 실제 너비는 사용할 필요 없음
                height={300} // 실제 높이도 사용할 필요 없음
              />
            )}
            <Button onClick={debouncedUpdatePost} className="mt-4 w-full">
              수정
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditPostModal
