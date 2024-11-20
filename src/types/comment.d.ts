export type Comment = {
  id: number
  content: string
  user_id: string
  post_id: number
  created_at: string
}

export type CommentProps = {
  comment: Comment
  onEdit: (comment: Comment) => void
}

export type FetchCommentsResult = {
  data: Comment[]
  nextPage: number | undefined
}
