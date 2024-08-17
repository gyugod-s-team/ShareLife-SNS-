"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

const HomePage = () => {
  const route = useRouter()
  const { toast } = useToast()
  const [nickname, setNickname] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [showModal, setShowModal] = useState<boolean>(false)
  const [posts, setPosts] = useState<
    Array<{
      id: number
      title: string
      content: string
      image_url: string
      user_id: string
    }>
  >([])
  const [editPostId, setEditPostId] = useState<number | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "게시글 불러오기 오류",
        description: error.message,
      })
    } else {
      setPosts(data)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        toast({
          title: "로그인 상태가 아닙니다.",
          description: "로그인을 먼저 진행해주세요.",
        })
        route.push("/login")
        return
      }

      const { user } = data.session
      setCurrentUserId(user.id)

      const { data: userNickname } = await supabase
        .from("users")
        .select("nickname")
        .eq("id", user.id)
        .single()

      if (userNickname) {
        setNickname(userNickname.nickname)
      }
    }
    checkSession()
  }, [route])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        title: "로그아웃 중 오류가 발생하였습니다.",
        description: error.message,
      })
      return
    }

    route.push("/login")
  }

  const uploadImage = async (file: File) => {
    const fileName = `image-${Date.now()}.png`
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file)

    if (uploadError) {
      toast({
        title: "이미지 업로드 중 오류가 발생하였습니다.",
        description: uploadError.message,
      })
      return null
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`
  }

  const createPost = async (uploadedImageUrl: string) => {
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user

    const { error } = await supabase.from("posts").insert([
      {
        user_id: user?.id,
        title,
        content,
        image_url: uploadedImageUrl,
      },
    ])

    if (error) {
      toast({
        title: "게시글 작성 중 오류가 발생하였습니다.",
        description: error.message,
      })
    } else {
      toast({ title: "게시글이 작성되었습니다.", description: "upload post" })
      setShowModal(false)
      setTitle("")
      setContent("")
      setImageFile(null)
      setImagePreview("")
      fetchPosts()
    }
  }

  const handleCreateOrUpdatePost = async () => {
    if (editPostId) {
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile)
        if (uploadedImageUrl) {
          await updatePost(uploadedImageUrl)
        }
      } else {
        await updatePost("")
      }
    } else {
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile)
        if (uploadedImageUrl) {
          await createPost(uploadedImageUrl)
        }
      } else {
        await createPost("")
      }
    }
  }

  const handleEditPost = (post: {
    id: number
    title: string
    content: string
    image_url: string
  }) => {
    setEditPostId(post.id)
    setTitle(post.title)
    setContent(post.content)
    setImagePreview(post.image_url)
    setShowModal(true)
  }

  const updatePost = async (uploadedImageUrl: string) => {
    const { error } = await supabase
      .from("posts")
      .update({ title, content, image_url: uploadedImageUrl })
      .eq("id", editPostId)

    if (error) {
      toast({
        title: "게시글 수정 중 오류가 발생하였습니다.",
        description: error.message,
      })
    } else {
      toast({ title: "게시글이 수정되었습니다." })
      setShowModal(false)
      setEditPostId(null)
      setTitle("")
      setContent("")
      setImageFile(null)
      setImagePreview("")
      fetchPosts()
    }
  }

  const deletePost = async (postId: number) => {
    const confirmDelete = window.confirm("정말로 이 게시글을 삭제하시겠습니까?")
    if (!confirmDelete) return

    const { error } = await supabase.from("posts").delete().eq("id", postId)

    if (error) {
      toast({
        title: "게시글 삭제 중 오류가 발생하였습니다.",
        description: error.message,
      })
    } else {
      toast({ title: "게시글이 삭제되었습니다." })
      fetchPosts()
    }
  }

  return (
    <div>
      <Button onClick={handleLogout}>로그아웃</Button>
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
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0]
                  setImageFile(file)
                  setImagePreview(URL.createObjectURL(file))
                }
              }}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2" />
            )}
            <Button onClick={handleCreateOrUpdatePost} className="mt-4">
              {editPostId ? "수정" : "게시"}
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="mt-8">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 mb-4">
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.content}</p>
            {post.image_url && (
              <img src={post.image_url} alt="Post Image" className="mt-2" />
            )}
            {post.user_id === currentUserId && (
              <>
                <Button onClick={() => handleEditPost(post)} className="mt-2">
                  수정
                </Button>
                <Button
                  onClick={() => deletePost(post.id)}
                  className="mt-2 ml-2"
                >
                  삭제
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage
