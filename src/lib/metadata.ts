import { Metadata } from "next"

// 공통 메타데이터 설정
const defaultMetadata: Metadata = {
  applicationName: "Share Life",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
    ],
  },
  robots: "index, follow", // 기본값 (필요 시 개별 설정에서 덮어쓰기)
}

// 회원가입 페이지 메타데이터
export const registerMetadata: Metadata = {
  ...defaultMetadata,
  title: "회원가입 - Share Life",
  description: "새 계정을 만들고 Share Life에서 다양한 사람들과 소통하세요.",
  robots: "noindex, nofollow", // 검색엔진 색인 방지
}

// 로그인 페이지 메타데이터
export const loginMetadata: Metadata = {
  ...defaultMetadata,
  title: "로그인 - Share Life",
  description:
    "계정에 로그인하여 Share Life를 통해 다양한 사람들과 소통하세요.",
  robots: "noindex, nofollow", // 검색엔진 색인 방지
}

// 홈 페이지 메타데이터
export const homeMetadata: Metadata = {
  ...defaultMetadata,
  title: "Share Life - 새로운 소셜 네트워크",
  description:
    "다양한 사람들과 공유하고 소통하는 SNS, Share Life에 오신 것을 환영합니다.",
  keywords: ["SNS", "소셜 미디어", "공유 플랫폼", "좋아요"],
  alternates: {
    canonical: "https://www.sharelife.shop/home",
  },
  openGraph: {
    title: "Share Life - 새로운 소셜 네트워크",
    description:
      "다양한 사람들과 공유하고 소통하는 SNS, Share Life에 오신 것을 환영합니다.",
    url: "https://www.sharelife.shop/main",
    images: [
      {
        url: "/mainpageimage.webp",
        width: 800,
        height: 600,
      },
    ],
    type: "website",
  },
}

// 사용자 프로필 페이지 메타데이터
export const userProfileMetadata: Metadata = {
  ...defaultMetadata,
  title: "사용자 프로필 - Share Life",
  description: "사용자의 프로필과 게시물을 확인하고 팔로우해 보세요.",
  keywords: ["프로필", "SNS 사용자", "소셜 미디어", "팔로우"],
  openGraph: {
    title: "사용자 프로필 - Share Life",
    description: "사용자의 프로필과 게시물을 확인하고 팔로우해 보세요.",
    images: [
      {
        url: "/userpageimage.webp",
        width: 800,
        height: 600,
      },
    ],
    type: "website",
  },
}
