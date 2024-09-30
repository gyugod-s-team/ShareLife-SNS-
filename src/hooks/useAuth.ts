"use client"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { signIn, useSession } from "next-auth/react"
import { LoginSchema, RegisterSchema, userType } from "@/lib/zod"
import { useRouter } from "next/navigation"

const useAuth = () => {
  const { data: session, status } = useSession()
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [nickname, setNickname] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [postNickname, setPostNickname] = useState<string | null>(null)
  const [postProfileImage, setPostProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const route = useRouter()
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
      return
    } // 세션 로딩 중에는 아무 작업도 하지 않음

    if (status === "unauthenticated") {
      setLoading(false)
      // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
      toast({
        title: "로그인 상태가 아닙니다.",
        description: "로그인을 먼저 진행해주세요.",
      })
      route.push("/login")
    } else if (status === "authenticated" && session?.user) {
      setCurrentUserId(session.user.id)

      // API로 현재 사용자 데이터 가져오기
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `/api/auth/user-data?userId=${session.user.id}`,
            {
              method: "GET",
            },
          )

          const data = await response.json()

          if (response.ok && data) {
            setNickname(data.nickname)
            setProfileImage(data.profile_image || session.user.image || "")
          } else {
            throw new Error(data.error || "Failed to fetch user data")
          }
        } catch (error: unknown) {
          handleError(error) // 헬퍼 함수 호출
        } finally {
          setLoading(false) // 데이터 로딩 완료 후 loading 상태를 false로 설정
        }
      }

      fetchUserData()
    }
  }, [status, session, route, toast])

  const handleSignUp = async (data: userType) => {
    const { email, password, name, nickname } = data
    setLoading(true)

    // Zod 유효성 검사
    const result = RegisterSchema.safeParse({ email, password, name, nickname })

    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message)
      toast({ title: "회원가입 실패", description: errors.join(", ") })
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, nickname }),
      })

      const responseData = await response.json()

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

    //Zod 유효성 검사
    const result = LoginSchema.safeParse({ email, password })

    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message)
      toast({ title: "로그인 실패", description: errors.join(", ") })
      setLoading(false)
      return
    }

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
