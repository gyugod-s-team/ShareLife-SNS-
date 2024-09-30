import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { email, password, name, nickname } = await request.json()

  // 회원가입 처리
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        nickname,
        profile_image:
          "https://jouopgwghtzpozglsrxw.supabase.co/storage/v1/object/public/default_profile_image/1361876.png",
      },
    },
  })

  // Supabase signUp 오류 처리
  if (signUpError) {
    console.log("Supabase error:", signUpError)
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  // 사용자 정보를 users 테이블에 추가
  const userId = signUpData.user?.id // user ID 가져오기
  const { error: insertError } = await supabase.from("users").insert([
    {
      user_id: userId,
      email,
      name,
      nickname,
      profile_image:
        "https://jouopgwghtzpozglsrxw.supabase.co/storage/v1/object/public/default_profile_image/1361876.png",
    },
  ])

  // 사용자 정보 추가 오류 처리
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json(
    { message: "User successfully registered", user: signUpData.user },
    { status: 201 },
  )
}
