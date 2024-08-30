import { useMemo, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import useAuth from "./useAuth"
import { NewPost, Post } from "@/app/home/type"

const ROWS_PER_PAGE = 10

const usePosts = () => {
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
  ): Promise<FetchPostsResult> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((pageParam - 1) * ROWS_PER_PAGE, pageParam * ROWS_PER_PAGE - 1)

    if (error) {
      throw new Error(error.message)
    }

    return {
      data: data || [],
      nextPage: data?.length === ROWS_PER_PAGE ? pageParam + 1 : undefined,
    }
  }

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  const posts = useMemo(
    () => postsData?.pages.flatMap((page) => page.data) || [],
    [postsData],
  )

  const loadMorePosts = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
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

  const createPost = async (newPost: NewPost) => {
    if (!currentUserId) {
      toast({
        title: "사용자가 인증되지 않았습니다.",
        description: "게시글을 작성하기 전에 로그인하세요.",
      })
      return
    }
    const { error } = await supabase.from("posts").insert([newPost])
    if (error) {
      toast({
        title: "게시글 작성 중 오류가 발생하였습니다.",
        description: error.message,
      })
    } else {
      toast({ title: "게시글이 작성되었습니다." })
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

    const { error } = await supabase.from("posts").delete().eq("id", postId)

    if (error) {
      toast({
        title: "게시글 삭제 중 오류가 발생하였습니다.",
        description: error.message,
      })
    } else {
      toast({ title: "게시글이 삭제되었습니다." })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    }
  }

  const handleCreatePost = async () => {
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

  // const handleCreateOrUpdatePost = async () => {
  //   if (editPostId) {
  //     await handleUpdatePost()
  //   } else {
  //     await handleCreatePost()
  //   }

  // // 모달 닫기 및 폼 리셋
  // resetForm()
  // setShowModal(false)
  // }

  // const handleCreateOrUpdatePost = async () => {
  //   const uploadedImageUrl = imageFile
  //     ? await uploadImage(imageFile)
  //     : imagePreview

  //   if (!uploadedImageUrl) {
  //     toast({
  //       title: "이미지를 포함하지 않았습니다",
  //       description: "이미지를 추가해주세요.",
  //     })
  //     return
  //   }

  //   const postData: NewPost = {
  //     title,
  //     content,
  //     image_url: uploadedImageUrl,
  //     user_id: currentUserId, // 현재 사용자 ID를 넣어줍니다
  //   }

  //   if (editPostId) {
  //     await updatePost(uploadedImageUrl)
  //   } else {
  //     await createPost(postData)
  //   }

  //   // 모달 닫기 및 폼 리셋
  //   resetForm()
  //   setShowModal(false)
  // }

  const handleEditPost = (post: Post) => {
    setEditPostId(post.id)
    setTitle(post.title)
    setContent(post.content)
    setImagePreview(post.image_url)
    // setShowModal(true)
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
    editPostId,
    currentUserId,
    nickname,
    resetForm,
    loadMorePosts,
    hasNextPage,
    isFetchingNextPage,
  }
}

export default usePosts
