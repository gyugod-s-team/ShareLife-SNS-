import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useSession } from "next-auth/react"

const useAuth = () => {
  const { data: session, status } = useSession()
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [nickname, setNickname] = useState<string | null>("")
  const [profileImage, setProfileImage] = useState<string>("")
  const route = useRouter()
  const { toast } = useToast()

  // 사용자 프로필 정보를 가져오는 함수 예시
  const fetchPostUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("nickname, profile_image")
      .eq("user_id", userId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  useEffect(() => {
    if (status === "loading") return // 세션 로딩 중에는 아무 작업도 하지 않음

    if (status === "unauthenticated") {
      // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
      toast({
        title: "로그인 상태가 아닙니다.",
        description: "로그인을 먼저 진행해주세요.",
      })
      route.push("/login")
    } else if (status === "authenticated" && session?.user) {
      setCurrentUserId(session.user.id)
      // Supabase에서 사용자 데이터 가져오기
      const fetchUserData = async () => {
        const { data: userData, error } = await supabase
          .from("users")
          .select("nickname, profile_image")
          .eq("user_id", session.user.id)
          .single()

        if (error) {
          console.error("사용자 데이터 가져오기 오류:", error.message)
          return
        }

        if (userData) {
          setNickname(userData.nickname)
          console.log("설정된 닉네임:", userData.nickname) // 추가된 로그
          setProfileImage(userData.profile_image || session.user.image || "")
        }
      }

      fetchUserData()
    }
  }, [status, session, route, toast])

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

  return {
    currentUserId,
    nickname,
    profileImage,
    handleLogout,
    fetchPostUserData,
  }
}

export default useAuth
