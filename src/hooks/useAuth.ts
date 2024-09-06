import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useSession } from "next-auth/react"

const useAuth = () => {
  const { data: session, status } = useSession()
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [nickname, setNickname] = useState<string>("")
  const [profileImage, setProfileImage] = useState<string>("")
  const route = useRouter()
  const { toast } = useToast()

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const { data } = await supabase.auth.getSession()
  //     if (!data.session) {
  //       toast({
  //         title: "로그인 상태가 아닙니다.",
  //         description: "로그인을 먼저 진행해주세요.",
  //       })
  //       route.push("/login")
  //       return
  //     }

  //     const { user } = data.session
  //     setCurrentUserId(user.id)

  //     const { data: userData } = await supabase
  //       .from("users")
  //       .select("nickname, profile_image")
  //       .eq("id", user.id)
  //       .single()

  //     if (userData) {
  //       setNickname(userData.nickname)
  //       setProfileImage(userData.profile_image)
  //     }
  //   }
  //   checkSession()
  // }, [route])
  //     if (status === "authenticated" && session?.user) {
  //   setCurrentUserId(session.user.id)

  //   const { data: userData, error } = await supabase
  //     .from("users")
  //     .select("nickname, profile_image")
  //     .eq("id", session.user.id)
  //     .single()

  //   if (userData) {
  //     setNickname(userData.nickname)
  //     setProfileImage(userData.profile_image)
  //   } else if (error) {
  //     console.error(error.message)
  //   }
  // }
  //   }

  //   checkSession()
  // }, [status, session])
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

        // console.log("User Data:", userData)
        // console.log("Profile Image URL:", userData?.profile_image)

        if (error) {
          console.error("사용자 데이터 가져오기 오류:", error.message)
          return
        }

        if (userData) {
          setNickname(userData.nickname || session.user.name || "") // Fallback to session.user.name
          setProfileImage(userData.profile_image || session.user.image || "") // Fallback to session.user.image
        }
      }

      fetchUserData()
    }

    //   // 인증된 사용자는 세션 정보를 사용하여 상태 업데이트
    //   setCurrentUserId(session.user.id)
    //   setNickname(session.user.name || "") // user.name은 next-auth에서 기본 제공
    //   setProfileImage(session.user.image || "") // user.image는 next-auth에서 기본 제공
    // }
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

  return { currentUserId, nickname, profileImage, handleLogout }
}

export default useAuth
