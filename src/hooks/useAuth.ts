"use client"
import { useState, useEffect, useMemo } from "react"
import { useToast } from "@/components/ui/use-toast"
import { signIn, useSession } from "next-auth/react"
import { LoginSchema, RegisterSchema, userType } from "@/lib/zod"
import { usePathname, useRouter } from "next/navigation"
import { profile } from "console"

const useAuth = () => {
  const { data: session, status } = useSession()
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [nickname, setNickname] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [postNickname, setPostNickname] = useState<string | null>(null)
  const [postProfileImage, setPostProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const route = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // 에러 처리를 위한 헬퍼 함수
  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    console.error("에러 발생:", errorMessage)
    toast({
      title: "오류가 발생했습니다.",
      description: errorMessage,
    })
    setLoading(false) // 에러 발생 시 loading 상태를 false로 설정
  }

  // 사용자 프로필 정보를 가져오는 함수 예시
  const fetchPostUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/user-data?userId=${userId}`, {
        method: "GET",
      })

      const data = await response.json()

      if (response.ok && data) {
        setPostNickname(data.nickname)
        setPostProfileImage(data.profile_image)
      } else {
        throw new Error(data.error?.message || "Failed to fetch user data")
      }
    } catch (error: unknown) {
      handleError(error) // 헬퍼 함수 호출
    }
  }

  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return // 세션 로딩 중에는 아무 작업도 하지 않음
    } else {
      setLoading(false) // 로딩이 끝나면 false로 설정
    }

    // 로그인 또는 회원가입 페이지에서는 토스트 메시지를 표시하지 않음
    if (
      status === "unauthenticated" &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      toast({
        title: "로그인 상태가 아닙니다.",
        description: "로그인을 먼저 진행해주세요.",
      })
    } else if (status === "authenticated" && session?.user) {
      if (currentUserId !== session.user.id) {
        setCurrentUserId(session.user.id)
      }
      if (nickname !== session.user.nickname) {
        setNickname(session.user.nickname)
      }
      if (profileImage !== session.user.profile_image) {
        setProfileImage(session.user.profile_image)
      }
    }
    console.log("session:", session)
  }, [status, session])

  // // 메모이제이션된 값
  // const currentUserId = useMemo(() => {
  //   return status === "authenticated" && session?.user ? session.user.id : ""
  // }, [status, session])

  // const nickname = useMemo(() => {
  //   return status === "authenticated" && session?.user
  //     ? session.user.nickname
  //     : null
  // }, [status, session])

  // const profileImage = useMemo(() => {
  //   return status === "authenticated" && session?.user
  //     ? session.user.profile_image
  //     : null
  // }, [status, session])

  // // 상태 변화 감지용 useEffect
  // useEffect(() => {
  //   console.log("currentUserId:", currentUserId)
  //   console.log("nickname:", nickname)
  //   console.log("profileImage:", profileImage)
  // }, [currentUserId, nickname, profileImage])

  const handleSignUp = async (data: userType) => {
    const { email, password, name, nickname } = data
    setLoading(true)

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, nickname }),
      })

      const responseData = await response.json()
      console.log("회원가입 API 응답:", responseData)
      if (!response.ok) {
        throw new Error(responseData.error || "회원가입에 실패하였습니다.")
      }

      toast({
        title: "회원가입 성공",
        description: "회원가입이 성공적으로 완료되었습니다.",
      })

      route.push("/login")
    } catch (error: unknown) {
      handleError(error)
      toast({
        title: "회원가입 실패",
      })
    } finally {
      setLoading(false)
    }
  }

  const goToLoginPage = () => {
    console.log("goToLoginPage 호출됨")
    route.push("/login")
  }

  const handleLogin = async (data: userType) => {
    const { email, password } = data
    setLoading(true)

    try {
      // NextAuth의 signIn을 사용하여 로그인 시도
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (response?.error) {
        throw new Error(response.error)
      }
      toast({
        title: "로그인 성공",
        description: "로그인에 성공하였습니다.",
      })
      route.push("/home")
    } catch (error: unknown) {
      handleError(error) // 헬퍼 함수 호출
    } finally {
      setLoading(false) // 항상 loading 상태를 false로 설정
    }
  }

  const goToRegisterPage = () => {
    console.log("test")
    route.push("/register")
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        route.push("/login")
      } else {
        throw new Error(data.error || "Failed to log out")
      }
    } catch (error: unknown) {
      handleError(error) // 헬퍼 함수 호출
    }
  }

  return {
    currentUserId,
    nickname,
    profileImage,
    handleLogout,
    postNickname,
    postProfileImage,
    fetchPostUserData,
    loading,
    handleSignUp,
    goToLoginPage,
    handleLogin,
    goToRegisterPage,
  }
}

export default useAuth
