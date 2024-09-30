import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // FormData로 요청을 받기
  const formData = await request.formData()

  const fileName = formData.get("fileName") as string
  const file = formData.get("file") as File

  // Buffer로 변환
  const buffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, buffer)

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 })
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`
  return NextResponse.json({ imageUrl })
}
