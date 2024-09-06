import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import usePosts from "@/hooks/usePosts"
import { Post } from "../../type"

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
    handleUpdatePost,
    handleEditPost,
    setShowModal,
  } = usePosts()

  // 수정 버튼을 클릭하면 모달을 열기 위한 함수
  const handleOpenModal = () => {
    handleEditPost(post) // 선택한 게시글의 데이터를 설정
    setShowModal(true) // 모달을 열기
  }

  return (
    <>
      <Button onClick={handleOpenModal} className="mt-2">
        수정
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <Input
              placeholder="제목을 수정해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="내용을 수정해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2"
            />
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2" />
            )}
            <Button onClick={handleUpdatePost} className="mt-4">
              수정
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditPostModal
