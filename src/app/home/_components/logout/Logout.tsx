"use client"
import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import React from "react"

const Logout = () => {
  const { handleLogout } = useAuth()
  return <Button onClick={handleLogout}>로그아웃</Button>
}

export default Logout
