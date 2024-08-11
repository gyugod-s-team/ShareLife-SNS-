import TerserPlugin from 'terser-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'], // 이미지 도메인 설정
  },
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
              },
            },
            extractComments: false, // 주석을 별도의 파일로 추출하지 않음
          }),
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
