// src/app/home/page.tsx
import { homeMetadata } from "@/lib/metadata/metadata"
import HomePage from "./_components/HomePage"
import Header from "./_components/header/Header"
import { fetchPosts } from "@/lib/api/fetchPosts"

export const metadata = homeMetadata

const Page = async () => {
  const initialPosts = await fetchPosts(1)
  return (
    <>
      <Header />
      <HomePage initialPosts={initialPosts.data} />
    </>
  )
}

export default Page
