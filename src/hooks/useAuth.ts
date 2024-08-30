import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

const useAuth = () => {
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [nickname, setNickname] = useState<string>("")
  const route = useRouter()
  const { toast } = useToast()

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

  return { currentUserId, nickname, handleLogout }
}

export default useAuth
