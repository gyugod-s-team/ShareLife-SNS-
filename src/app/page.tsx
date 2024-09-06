"use client"
import React from "react"
import LoginPage from "./login/page"
import { redirect } from "next/navigation"

const HomePage = () => {
  redirect("/login")
  // return <LoginPage />
}

export default HomePage
