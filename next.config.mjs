import TerserPlugin from "terser-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

const isProduction = process.env.NODE_ENV === "production"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["jouopgwghtzpozglsrxw.supabase.co"], // 이미지 도메인 설정
  },
  metadataBase: isProduction
    ? "https://www.sharelife.shop"
    : "http://localhost:3000",
  webpack(config) {
    if (isProduction) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              format: {
                comments: false, // 주석 제거
              },
              compress: {
                drop_console: true, // console.* 구문 제거
                pure_funcs: ["console.log"], // 특정 함수 호출 제거
                unused: true, // 사용하지 않는 코드 제거
                dead_code: true, // 도달할 수 없는 코드 제거
                reduce_vars: true, // 변수의 크기를 줄여서 최적화
              },
              mangle: true,
            },
            extractComments: false, // 주석을 별도의 파일로 추출하지 않음
          }),
        ],
      }
    }

    // Bundle Analyzer 추가
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          openAnalyzer: true,
        }),
      )
    }
    return config
  },
}

export default nextConfig
