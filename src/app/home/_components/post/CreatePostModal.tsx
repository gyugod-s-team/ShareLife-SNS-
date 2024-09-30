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
import Image from "next/image"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

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

  const { nickname, loading } = useAuth()

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger className="text-lg font-semibold hover:underline">
        {loading ? (
          <Skeleton width={200} height={20} />
        ) : (
          `${nickname}님의 일상을 남겨보세요!`
        )}
      </DialogTrigger>
      <DialogContent className="p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <h2 className="text-xl font-bold mb-4">새 게시물 작성</h2>
          <Input
            placeholder="제목을 작성해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg p-2"
          />
          <Input
            placeholder={`${nickname}님, 무슨 일상을 공유하고 싶으신가요?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 border rounded-lg p-2"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              className="mt-2 rounded-lg" // 모서리 둥글게
              width={500}
              height={300}
            />
          )}
          <Button
            onClick={handleCreatePost}
            className="mt-4 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            게시
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostModal
