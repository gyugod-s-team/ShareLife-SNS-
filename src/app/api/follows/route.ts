// src/app/api/follows/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { data, error } = await supabase.from("follows").select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { follower_id, following_id } = await req.json()
  const { data, error } = await supabase
    .from("follows")
    .insert([{ follower_id, following_id }])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { follower_id, following_id } = await req.json()
  const { data, error } = await supabase
    .from("follows")
    .delete()
    .match({ follower_id, following_id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
