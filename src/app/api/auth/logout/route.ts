import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

// POST 요청: 로그아웃 처리
export async function POST() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Successfully logged out" })
}
