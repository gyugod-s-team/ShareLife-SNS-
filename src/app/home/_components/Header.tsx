import Logout from "@/app/home/_components/logout/Logout"
import CreatePostModal from "@/app/home/_components/post/CreatePostModal"
import React from "react"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-neutral-800 text-white shadow-md z-10">
      <h1 className="text-xl font-bold">Share Life</h1>
      <div className="flex-grow text-center">
        <CreatePostModal />
      </div>
      <div className="flex items-center space-x-4">
        <Logout />
      </div>
    </header>
  )
}

export default Header
