"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

const HomePage = () => {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        toast({
          title: "로그인 상태가 아닙니다.",
          description: "로그인을 먼저 진행해주세요.",
        })
        router.push("/login")
        return
      }
    }
    checkSession()
  }, [router])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        title: "로그아웃 중 오류가 발생하였습니다.",
        description: error.message,
      })
      return
    }

    router.push("/login")
  }

  return (
    <div>
      <Button onClick={handleLogout}>로그아웃</Button>
    </div>
  )
}

export default HomePage
