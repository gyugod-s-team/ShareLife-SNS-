import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import usePosts from "@/hooks/usePosts"
import useAuth from "@/hooks/useAuth"

const CreatePostModal: React.FC = () => {
  const {
    title,
    content,
    imagePreview,
    showModal,
    setShowModal,
    setTitle,
    setContent,
    handleFileChange,
    handleCreatePost,
  } = usePosts()

  const { nickname } = useAuth()
  console.log("nickname:", nickname)

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger>{nickname}님의 일상을 남겨보세요!</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Input
            placeholder="제목을 작성해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder={`${nickname}님, 무슨 일상을 공유하고 싶으신가요?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2"
          />
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2" />
          )}
          <Button onClick={handleCreatePost} className="mt-4">
            게시
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostModal
