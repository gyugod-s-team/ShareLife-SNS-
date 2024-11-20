export type User = {
  nickname: string
  profile_image: string
  user_id: string
}

export type Post = {
  id: number
  title: string
  content: string
  image_url: string
  user_id: string
  created_at: string
  users: User
}

export type FetchPostsResult = {
  data: Post[]
  nextPage: number | undefined
}

export type NewPost = Omit<Post, "id" | "created_at" | "users">

export type PostCardProps = {
  post: Post
  currentUserId: string
  loadMorePosts: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLast: boolean
}
