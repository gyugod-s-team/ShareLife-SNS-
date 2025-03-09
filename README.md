# Share Life

<p align="center">
  <img src="https://github.com/user-attachments/assets/a81a30aa-33c6-4451-95df-e0249d612c71" alt="Logo" width="50%" />
</p>

## 웹 서비스 소개

**Share Life**는 사진으로 일상 생활을 공유하는 SNS 서비스입니다.

## 서비스 개요

> 개발 기간 : 2024.08 ~ 2024.09

> 배포 주소 : [Share Life](https://www.sharelife.shop/)

> 'Share Life' 계정 정보

<table>
<thead>
<tr>
<th align="center">아이디</th>
<th align="left"><a href="mailto:test01@test.com">test01@test.com</a></th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">비밀번호</td>
<td align="left">Test1234!</td>
</tr>
</tbody>
</table>

> 서비스를 구경하고 싶으시면 상단의 계정 정보로 로그인 후 사용하실 수 있습니다.

## 📚 기술 스택

<div>
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<br>

<img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/nextauth.js-000000?style=for-the-badge&logo=nextauth.js&logoColor=white">
<img src="https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white">
<img src="https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=zustand&logoColor=white">
<!-- <img src="https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=zustand&logoColor=white"> -->
<img src="https://img.shields.io/badge/zod-3178C6?style=for-the-badge&logo=custom">
<img src="https://img.shields.io/badge/react%20hook%20form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white">
<br>

<img src="https://img.shields.io/badge/shadcn/ui-7289DA?style=for-the-badge&logo=custom">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
<img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</div>

## 프로젝트 구성도

<table align="center">
  <thead>
    <tr>
      <th align="center">아키텍처(Architecture)</th>
    </tr>
  </thead>
<tbody>
  <tr>
     <td align="center">
          <a target="_blank" rel="noopener noreferrer" href="https://ibb.co/sb3c72Z"><img src="https://i.ibb.co/172BcLk/share-life-drawio-1.png"  alt="share-life-drawio" width="1000px" style="max-width: 100%;"></a>
        </td>
    </tr>
  </tbody>
</table>

<table align="center">
  <thead>
    <tr>
      <th align="center">개체-관계 모델(ERD)(수파베이스꺼 안이쁨 다시 만들지 고민)(Architecture)</th>
    </tr>
  </thead>
<tbody>
  <tr>
     <td align="center">
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/user-attachments/assets/259d967c-51a5-46fd-8bcf-d37839aa840e"><img src="https://github.com/user-attachments/assets/259d967c-51a5-46fd-8bcf-d37839aa840e" alt="ERD" width="800px" style="max-width: 100%;"></a>
        </td>
    </tr>
  </tbody>
</table>

### 폴더 구조

```
📁 public
├──📁 assets
│   ├──📁 icons(아직 미사용)
│   └──📁 images(아직 미사용)
│
📁 app
├──📁 api                               # api
│   ├──📁 auth
│       └──📁 [...nextauth]
│
├──📁 home
│   └──📁 _components
│       ├──📁 comment                   # 댓글
│       ├──📁 like                      # 좋아요
│       ├──📁 logout                    # 로그아웃
│       └──📁 post                      # 게시글
├──📁 login                             # 로그인
│
├──📁 profile                           # 유저 프로필
│   └──📁 [id]
├──📁 register                          # 회원가입
│
📁 components                           # ShadCN/UI
├──📁 ui
│
📁 hooks                                # Auth, Comment, Follow, Like, Post
│
📁 lib                                  # NextAuth, Supabase, Tailwind CSS, Zod
│
📁 providers                            # TanstackQuery, NextAuth
│
📁 styles
│
📁 types                                # NextAuth, ShadCN/UI, Supabase
```

<markdown-accessiblity-table data-catalyst=""><table>

<thead>
<tr>
<th>폴더명</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>api</code></td>
<td>API 관련 폴더</td>
</tr>
<tr>
<td><code>home</code></td>
<td>메인 페이지 관련 폴더</td>
</tr>
<tr>
<td><code>login</code></td>
<td>로그인 페이지 관련 폴더</td>
</tr>
<tr>
<td><code>profile</code></td>
<td>프로필 페이지 관련 폴더</td>
</tr>
<tr>
<td><code>components/ui</code></td>
<td>ShadCN/UI 관련 폴더</td>
</tr>
<tr>
<td><code>hooks</code></td>
<td>훅 관련 폴더</td>
</tr>
<tr>
<td><code>lib</code></td>
<td>라이브러리 및 유틸리티 관련 폴더</td>
</tr>
<tr>
<td><code>providers</code></td>
<td>공급자 관련 폴더</td>
</tr>
<!-- <tr>
<td><code>stores</code></td>
<td>Zustand 상태관리 관련된 폴더</td>
</tr> -->
<tr>
<td><code>styles</code></td>
<td>스타일 관련된 폴더</td>
</tr>
<tr>
<td><code>types</code></td>
<td>타입 관련된 폴더</td>
</tr>
</tbody>
</table></markdown-accessiblity-table>

## 기능 소개

- **로그인 / 회원가입**
  - Zod를 이용한 **폼 유효성 검증**(이메일 형식, 대소문자+특수문자+8자 이상 비밀번호, 2자 이상 이름 및 닉네임)
  - React-Hook-Form를 이용한 **폼 상태 관리 및 성능 최적화**
  - NextAuth.js와 Supabase Auth를 이용한 **인증 상태 유지 및 유저 정보 관리**
  - `middelware.ts`를 통해 Token이 없을 시, **서비스 접근 제한 및 보호**
<details>
  <summary>로그인 / 회원가입 시연 영상</summary>
   <table>
    <thead>
      <tr>
        <th>로그인</th>
        <th>회원가입</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img src="https://i.imgur.com/qYY6AfL.gif" alt="로그인" width="500px" style="max-width: 100%;"></td>
        <td><img src="https://i.imgur.com/GDNn22i.gif" alt="회원가입" width="500px" style="max-width: 100%;"></td>
      </tr>
    </tbody>
  </table>
</details>

- **게시글 및 댓글 CRUD**

  - `TanStack Query useInfiniteQuery`를 이용한 **페이지네이션(무한스크롤)**
  - `IntersectionObserver`를 사용하여 **스크롤 끝에 도달하면 다음 게시글 로드**
  - `useMemo`와 `useCallback`을 이용한 **게시글 데이터 메모이제이션(성능 개선)**
  - ShadCN/UI 모달창을 이용한 **게시글 생성 및 수정(Title/Content/Image)**
  - Next.js Image 컴포넌트 이용하여 **자동 이미지 최적화**
<details>
  <summary>게시글 및 댓글 CRUD 시연 영상</summary>
   <table>
    <thead>
      <tr>
        <th>게시글 및 댓글 CRUD</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img src="https://i.imgur.com/30wdJs3.gif" alt="로그인" width="500px" style="max-width: 100%;"></td>
      </tr>
    </tbody>
  </table>
</details>

- **게시글 좋아요 & 유저 팔로우**
  - **낙관적 UI 업데이트**를 활용한 좋아요 및 팔로우
  - Supabase Realtime를 이용한 **실시간 업데이트**
<details>
  <summary>게시글 좋아요 & 유저 팔로우 시연 영상</summary>
   <table>
    <thead>
      <tr>
        <th>게시글 좋아요 및 유저 팔로우</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img src="https://i.imgur.com/x1NaXtL.gif" alt="로그인" width="500px" style="max-width: 100%;"></td>
      </tr>
    </tbody>
  </table>
</details>

## 성능 최적화
  <table>
    <thead>
      <tr>
        <th>성능 최적화 전</th>
        <th>성능 최적화 후</th>
      </tr>
    </thead>
    <tbody>
      <tr>
<td style="width: 300px; height: 300px; overflow: hidden;">
    <img src="https://velog.velcdn.com/images/gyu4016/post/e446ae9f-3844-4378-9829-46710e7e4363/image.png" alt="성능 최적화 전" style="width: 100%; height: 100%; object-fit: cover;">
</td>
<td style="width: 300px; height: 300px; overflow: hidden;">
    <img src="https://velog.velcdn.com/images/gyu4016/post/1a5dbcab-fe2a-4b56-bb88-7b34fb1e7e55/image.png" alt="성능 최적화 후" style="width: 100%; height: 100%; object-fit: cover;">
</td>
      </tr>
    </tbody>
  </table>

- 웹 성능 최적화 점수 약 40점 증가
  - img태그 next Image 컴포넌트로 변경 및 lazy loading 적용하여 이미지 최적화
  - Terser-Webpack-Plugin 도입으로 JS코드 축소 및 불필요한 코드 제거
  - Tanstack Query useInfiniteQuery와 throttle 적용하여 초기 렌더링 속도 향상
  - userMemo와 useCallback을 이용한 데이터 메모이제이션
  - React-Hook-Form 라이브러리로 폼 리렌더링 방지
 
## 트러블 슈팅

- **Next 14 버전에서 React-query 사용 시 RSC와의 충돌**
  - 원인
    - 루트 layout에서 클라이언트 전용 QueryClientProvider 사용하면 데이터 불일치
  - 해결 방법
    - Client Stream Hydration 방식을 사용해 데이터 동기화 문제 해결
      - 클라이언트 컴포넌트에 Provider넣어준 후 layout에 import
    - ReactQueryStreamedHydration 추가하여 서버에서 클라이언트 측으로 데이터 효율적으로 전달
- **NextAuth Session** 타입 에러
  - 원인
    - NextAuth.js의 기본 세션 타입에 사용자 정의 타입이 없음
  - 해결 방법
    - types/next-auth.d.ts에서 Session과 JWT 타입 확장하여 id와 email 타입을 명시적으로 선언
    - tsconfig.json의 include 배열에 types 폴더 추가하여 타입 인식하도록 설정
- **팔로우 팔로잉 타입 에러**
  - 원인
    - Supabase의 follows 테이블의 column 타입을 똑같이 선언해서 데이터 호출해도 에러 발생
  - 해결 방법
    - Supabase에서 직접 Database 타입을 불러와 createClient에 추가하여 해결
   
## ppt 소개
https://drive.google.com/file/d/1tEB3pg75wwjq-4jJSTkeZyf-vaj1EO0s/view?usp=sharing
