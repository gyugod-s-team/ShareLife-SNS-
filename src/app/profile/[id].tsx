import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabase" // Supabase 클라이언트를 임포트
import Image from "next/image"

const ProfilePage = () => {
  const router = useRouter()
  const { id } = router.query // URL의 [id] 파라미터를 가져옴

  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    console.log(id)

    const fetchUserData = async () => {
      if (id) {
        console.log(id)

        // id 값이 있을 때만 데이터 fetch를 진행
        const { data, error } = await supabase
          .from("users")
          .select("nickname, profile_image") // 필요한 사용자 데이터를 선택
          .eq("user_id", id)
          .single()

        if (error) {
          console.error(
            "사용자 데이터를 가져오는 중 오류가 발생했습니다:",
            error,
          )
          setLoading(false)
        } else {
          setUserData(data)
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>User not found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        {userData.profile_image ? (
          <Image
            src={userData.profile_image}
            alt={`${userData.nickname}'s profile`}
            width={100}
            height={100}
            className="rounded-full"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
        )}
        <h1 className="ml-4 text-3xl font-bold">{userData.nickname}</h1>
      </div>
      <p>{userData.bio || "This user has no bio."}</p>
      {/* 추가적인 프로필 정보 및 UI 요소들 */}
    </div>
  )
}

export default ProfilePage
