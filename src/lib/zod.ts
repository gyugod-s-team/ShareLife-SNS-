import { z } from "zod"

// 공통 스키마 정의
const emailSchema = z.string().email("유효한 이메일 주소를 입력하세요")
const passwordSchema = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
  .regex(/[A-Z]/, "비밀번호에 최소 하나의 대문자가 포함되어야 합니다")
  .regex(/[a-z]/, "비밀번호에 최소 하나의 소문자가 포함되어야 합니다")
  .regex(/[0-9]/, "비밀번호에 최소 하나의 숫자가 포함되어야 합니다")
  .regex(/[\W_]/, "비밀번호에 최소 하나의 특수문자가 포함되어야 합니다")

// 회원가입 스키마
export const RegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, "이름을 입력하세요"),
  nickname: z.string().min(2, "닉네임을 입력하세요"),
})

// 로그인 스키마
export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type RegisterType = z.infer<typeof RegisterSchema>
export type LoginType = z.infer<typeof LoginSchema>

// export const RegisterSchema = z.object({
//   email: z.string().email("유효한 이메일 주소를 입력하세요"),
//   password: z
//     .string()
//     .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
//     .regex(/[A-Z]/, "비밀번호에 최소 하나의 대문자가 포함되어야 합니다")
//     .regex(/[a-z]/, "비밀번호에 최소 하나의 소문자가 포함되어야 합니다")
//     .regex(/[0-9]/, "비밀번호에 최소 하나의 숫자가 포함되어야 합니다")
//     .regex(/[\W_]/, "비밀번호에 최소 하나의 특수문자가 포함되어야 합니다"),
//   name: z.string().min(2, "이름을 입력하세요"),
//   nickname: z.string().min(2, "닉네임을 입력하세요"),
// })

// export type userType = z.infer<typeof RegisterSchema>

// export const LoginSchema = z.object({
//   email: z.string().email("유효한 이메일 주소를 입력하세요"),
//   password: z
//     .string()
//     .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
//     .regex(/[A-Z]/, "비밀번호에 최소 하나의 대문자가 포함되어야 합니다")
//     .regex(/[a-z]/, "비밀번호에 최소 하나의 소문자가 포함되어야 합니다")
//     .regex(/[0-9]/, "비밀번호에 최소 하나의 숫자가 포함되어야 합니다")
//     .regex(/[\W_]/, "비밀번호에 최소 하나의 특수문자가 포함되어야 합니다"),
// })
