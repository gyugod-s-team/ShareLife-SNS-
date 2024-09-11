// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase" // Supabase 클라이언트 설정 파일의 경로

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("status", "ONLINE")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { name, status } = await req.json()
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, status }])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const { id, name, status } = await req.json()
  const { data, error } = await supabase
    .from("users")
    .update({ name, status })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const { data, error } = await supabase.from("users").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
