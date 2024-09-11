// src/app/api/likes/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { data, error } = await supabase.from("likes").select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { post_id, user_id } = await req.json()
  const { data, error } = await supabase
    .from("likes")
    .insert([{ post_id, user_id }])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { post_id, user_id } = await req.json()
  const { data, error } = await supabase
    .from("likes")
    .delete()
    .match({ post_id, user_id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
