import Logout from "@/app/home/_components/logout/Logout"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import React from "react"

const Header = () => {
  const router = useRouter()

  const handleBackToHome = () => {
    router.push("/home")
  }

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-neutral-800 text-white shadow-md z-10">
      <h1 className="text-xl font-bold">Share Life</h1>
      <div className="flex-grow text-center"></div>
      <div className="flex items-center space-x-4">
        <Button onClick={handleBackToHome}>뒤로가기</Button>
        {/* <Logout /> */}
      </div>
    </header>
  )
}

export default Header
