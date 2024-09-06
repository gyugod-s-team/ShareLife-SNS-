import React from "react"
import useAuth from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

const ProfilePage = () => {
  const { currentUserId, nickname, handleLogout } = useAuth()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">프로필</h1>
      <div className="mt-4">
        <p>닉네임: {nickname}</p>
        <Button onClick={handleLogout} className="mt-4">
          로그아웃
        </Button>
      </div>
    </div>
  )
}

export default ProfilePage
