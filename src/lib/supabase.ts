import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string

// 서버 측에서는 SUPABASE_SERVICE_ROLE_KEY 사용, 클라이언트 측에서는 NEXT_PUBLIC_SUPABASE_ANON_KEY 사용
const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY // 서버에서 서비스 역할 키 사용
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // 클라이언트에서 익명 키 사용

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey as string,
)
