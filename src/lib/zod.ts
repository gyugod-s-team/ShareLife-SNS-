import { z } from "zod"

export const RegisterSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  password: z
    .string()
    .min(
      8,
      "비밀번호는 최소 8자 이상, 대소문자, 숫자, 특수문자 포함이어야 합니다",
    ),
  name: z.string().min(2, "이름을 입력하세요"),
  nickname: z.string().min(2, "닉네임을 입력하세요"),
})

export type userType = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  password: z
    .string()
    .min(
      8,
      "비밀번호는 최소 8자 이상, 대소문자, 숫자, 특수문자 포함이어야 합니다",
    ),
})
