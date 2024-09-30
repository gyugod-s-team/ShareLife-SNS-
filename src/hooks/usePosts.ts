import { useMemo, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import useAuth from "./useAuth"
import { NewPost, Post } from "@/app/home/type"
import _, { throttle } from "lodash"

const ROWS_PER_PAGE = 10

const usePosts = (userId?: string) => {
  const { currentUserId, nickname } = useAuth()
  const [editPostId, setEditPostId] = useState<number | null>(null)
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [showModal, setShowModal] = useState<boolean>(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  type FetchPostsResult = {
    data: Post[]
    nextPage: number | undefined
  }

  const fetchPosts = async (
    pageParam: number = 1,
    userId?: string,
  ): Promise<FetchPostsResult> => {
    const response = await fetch(
      `/api/posts?page=${pageParam}&userId=${userId}`,
      { method: "GET" },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error fetching posts:", errorData.error)
      throw new Error(errorData.error)
    }

    const data = await response.json()

    return {
      data: data || [],
      nextPage: data.length === ROWS_PER_PAGE ? pageParam + 1 : undefined,
    }
  }

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, // 초기 로딩 상태 추가
    isError, // 에러 상태 추가
    error, // 에러 정보 추가
  } = useInfiniteQuery({
    queryKey: ["posts", userId],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, userId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  const posts = useMemo(
    () => postsData?.pages.flatMap((page) => page.data) || [],
    [postsData],
  )

  const loadMorePosts = throttle(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, 300) // 300ms 동안 하나의 요청만

  const uploadImage = async (file: File) => {
    const fileName = `image-${Date.now()}.png`
    // const fileData = await file.arrayBuffer()

    const formData = new FormData()
    formData.append("fileName", fileName)
    formData.append("file", file)

    const response = await fetch("/api/posts/image", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      toast({
        title: "이미지 업로드 중 오류가 발생하였습니다.",
        description: error.message,
      })
      return null
    }

    const { imageUrl } = await response.json()
    return imageUrl
  }

  const createPost = async (newPost: NewPost) => {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })

    console.log("createpostsrespon", response)

    if (!response.ok) {
      const error = await response.json()
      console.log("게시글 작성 중 오류:", error.message)
      toast({
        title: "게시글 작성 중 오류가 발생하였습니다.",
        description: error.message,
      })
    } else {
      const data = await response.json()
      toast({ title: data.message })
      // 새로 작성된 게시글을 포함하여 데이터를 다시 불러옵니다.
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    }
  }

  const updatePost = async (uploadedImageUrl: string) => {
    if (!editPostId) return

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
      resetForm()
      setShowModal(false)
      queryClient.invalidateQueries({ queryKey: ["posts"] }) // 게시글 리스트를 새로 고침
    }
  }

  const deletePost = async (postId: number) => {
    const confirmDelete = window.confirm("정말로 이 게시글을 삭제하시겠습니까?")
    if (!confirmDelete) return

    const response = await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: postId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      toast({
        title: "게시글 삭제 중 오류가 발생하였습니다.",
        description: errorData.error,
      })
      return
    }

    toast({ title: "게시글이 삭제되었습니다." })
    queryClient.invalidateQueries({ queryKey: ["posts"] })
  }

  const handleCreatePost = async () => {
    if (!imageFile) {
      toast({
        title: "이미지를 포함하지 않았습니다",
        description: "이미지를 추가해주세요.",
      })
      return
    }

    const uploadedImageUrl = await uploadImage(imageFile)

    if (!uploadedImageUrl) {
      return
    }

    const postData: NewPost = {
      title,
      content,
      image_url: uploadedImageUrl,
      user_id: currentUserId,
    }

    await createPost(postData)
    resetForm()
  }

  const handleUpdatePost = async () => {
    const uploadedImageUrl = imageFile
      ? await uploadImage(imageFile)
      : imagePreview

    if (!uploadedImageUrl) {
      toast({
        title: "이미지를 포함하지 않았습니다",
        description: "이미지를 추가해주세요.",
      })
      return
    }

    await updatePost(uploadedImageUrl)
    resetForm()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEditPost = (post: Post) => {
    setEditPostId(post.id)
    setTitle(post.title)
    setContent(post.content)
    setImagePreview(post.image_url)
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setImageFile(null)
    setImagePreview("")
    setEditPostId(null)
    setShowModal(false)
  }

  return {
    title,
    content,
    imagePreview,
    showModal,
    setTitle,
    setContent,
    setImageFile,
    setShowModal,
    setImagePreview,
    handleEditPost,
    handleCreatePost,
    handleUpdatePost,
    handleFileChange,
    deletePost,
    posts,
    fetchPosts,
    editPostId,
    currentUserId,
    nickname,
    resetForm,
    loadMorePosts,
    hasNextPage,
    isFetchingNextPage,
    isLoading, // 초기 로딩 상태 추가
    isError, // 에러 상태 추가
    error, // 에러 정보 추가
  }
}

export default usePosts
