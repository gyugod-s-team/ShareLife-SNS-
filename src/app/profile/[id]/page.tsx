import React from "react"
import UserProfile from "../_components/UserProfilePage"
import { userProfileMetadata } from "@/lib/metadata"
import { Metadata } from "next"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id

  // 사용자 프로필 페이지 메타데이터를 복사하여 URL을 동적으로 설정
  const dynamicMetadata: Metadata = {
    ...userProfileMetadata,
    alternates: {
      canonical: `https://www.sharelife.shop/profile/${id}`,
    },
    openGraph: {
      ...userProfileMetadata.openGraph,
      url: `https://www.sharelife.shop/profile/${id}`, // 동적 URL 설정
    },
  }

  return dynamicMetadata
}

const page = ({ params }: { params: { id: string } }) => {
  return <UserProfile params={params} />
}

export default page
