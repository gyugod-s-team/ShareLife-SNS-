import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: Request) {
  // FormData로 요청을 받기
  const formData = await request.formData()

  const fileName = formData.get("fileName") as string
  const file = formData.get("file") as File

  // Buffer로 변환
  const buffer = await file.arrayBuffer()

  // WebP로 변환
  const webpBuffer = await sharp(Buffer.from(buffer))
    .toFormat("webp")
    .toBuffer()

  // const { error: uploadError } = await supabase.storage
  //   .from("images")
  //   .upload(fileName, buffer)

  // if (uploadError) {
  //   return NextResponse.json({ error: uploadError.message }, { status: 400 })
  // }

  // WebP 이미지 업로드
  const webpFileName = fileName.replace(/\.(jpg|jpeg|png)$/, ".webp") // 파일 확장자 변경
  const { data, error: webpUploadError } = await supabase.storage
    .from("images")
    .upload(webpFileName, webpBuffer)

  if (webpUploadError) {
    return NextResponse.json(
      { error: webpUploadError.message },
      { status: 400 },
    )
  }

  // 이미지 URL 생성
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`
  const webpImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${webpFileName}`

  // 원본 이미지와 WebP 이미지의 크기 비교
  const originalSize = buffer.byteLength
  const webpSize = webpBuffer.byteLength

  console.log(`Original Image Size: ${originalSize} bytes`)
  console.log(`WebP Image Size: ${webpSize} bytes`)

  return NextResponse.json({ webpImageUrl })
}
