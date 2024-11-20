import { FetchPostsResult } from "@/types/post"

export const fetchPosts = async (
  pageParam = 1,
  userId?: string,
): Promise<FetchPostsResult> => {
  const API_URL =
    typeof window !== "undefined" // 클라이언트 환경
      ? "" // 클라이언트에서는 상대 경로를 사용
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" // 서버 환경에서는 절대 경로 사용

  const userQuery = userId ? `&userId=${userId}` : ""
  try {
    const response = await fetch(
      `${API_URL}/api/posts?page=${pageParam}${userQuery}`,
      {
        method: "GET",
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Unknown error fetching posts")
    }

    const data = await response.json()
    // 데이터 길이가 10개일 경우 다음 페이지가 있다고 간주
    const nextPage = data.length === 10 ? pageParam + 1 : undefined

    return {
      data: data || [],
      nextPage,
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error // 에러를 재던져서 상위에서 처리
  }
}
