import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // 회원가입 핸들러
// export const signupHandler = async (
//   email: string,
//   password: string,
//   nickname: string,
// ) => {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         full_name: nickname,
//         user_img:
//           "https://ywwmsridviznotzmkver.supabase.co/storage/v1/object/public/user_img/default_img/defaultprofileimage.webp",
//       },
//     },
//   })
//   return { data, error }
// }

// // 닉네임 중복 검사
// export const nicknameValidationHandler = async (nickname: string) => {
//   const { data, error } = await supabase
//     .from("users")
//     .select("nickname")
//     .eq("nickname", nickname)
//     .maybeSingle()
//   return { data, error }
// }
