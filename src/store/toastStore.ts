import { create } from "zustand"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
}

interface ToastState {
  toasts: Toast[] // 여러 개의 토스트를 관리하는 배열
  addToast: (
    message: string,
    type: "success" | "error" | "info" | "warning",
  ) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [], // 초기 상태는 빈 배열
  addToast: (message, type) => {
    const id = Math.random().toString(36).substring(2, 9) // 고유한 ID 생성
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }], // 새로운 토스트 추가
    }))
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id), // 특정 토스트 제거
    }))
  },
}))
