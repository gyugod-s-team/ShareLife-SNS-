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

<table>
  <thead>
    <tr>
      <th align="center">아키텍처(Architecture)</th>
    </tr>
  </thead>
<tbody>
  <tr>
     <td align="center">
          <a target="_blank" rel="noopener noreferrer" href="https://ibb.co/3dB4nSF"><img src="https://ibb.co/3dB4nSF" alt="아키텍처" width="1000px" style="max-width: 100%;"></a>
        </td>
    </tr>
  </tbody>
</table>

<table>
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
📁 hooks
│
📁 lib
│
📁 providers
│
📁 stores                               # Zustand
│
📁 styles
│
📁 types
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
<td>api 관련 파일 넣어놓은 폴더</td>
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
<td>훅 관련된 폴더</td>
</tr>
<tr>
<td><code>lib</code></td>
<td>폴더</td>
</tr>
<tr>
<td><code>providers</code></td>
<td> 폴더</td>
</tr>
<tr>
<td><code>stores</code></td>
<td>Zustand 상태관리 관련된 폴더</td>
</tr>
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

**(시연 영상??)**

- **로그인 / 회원가입**
  - Zod를 이용한 **폼 유효성 검증**(이메일 형식, 대소문자+특수문자+8자 이상 비밀번호, 2자 이상 이름 및 닉네임)
  - React-Hook-Form를 이용한 **폼 상태 관리 및 성능 최적화**
  - NextAuth.js와 Supabase Auth를 이용한 **인증 상태 유지 및 유저 정보 관리**
  - `middelware.ts`를 통해 Token이 없을 시, **서비스 접근 제한 및 보호**
- **게시글 및 댓글 CRUD**

  - TanStack Query useInfiniteQuery를 이용한 **페이지네이션(무한스크롤)**
  - IntersectionObserver를 사용하여 **스크롤 끝에 도달하면 다음 게시글 로드**
  - `useMemo`와 `useCallback`을 이용한 **게시글 데이터 메모이제이션(성능 개선)**
  - ShadCN/UI 모달창을 이용한 **게시글 생성 및 수정(Title/Content/Image)**
  - Next.js Image 컴포넌트 이용하여 **자동 이미지 최적화**

- **게시글 좋아요 & 유저 팔로우**
  - **낙관적 UI 업데이트**를 활용한 좋아요 및 팔로우
  - Supabase Realtime를 이용한 **실시간 업데이트**

## 성능 최적화

아직 최적화 중

## 트러블 슈팅

너무 많고 짜잘해서 다 넣을지 뺄지 고민중(최적화 아직 안끝남)

=================================================================================

4. 주요 기능
5. 데모 영상
6. 특이사항
7. 구글 애널리틱스 통계
8. 개발 기간
9. 프로젝트의 주요 기능과 목적
10. 설치 실행 방법
11. 변경 로그의 링크
12. 사전 요구사항
13. 소개
14. 사용법
15. 기여 방법
16. 라이센스
17. 연락처
