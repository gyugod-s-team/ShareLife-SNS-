# Share Life
<p align="center">
  <img src="https://github.com/user-attachments/assets/a81a30aa-33c6-4451-95df-e0249d612c71" alt="Logo" width="50%" />
</p>

## 서비스 개요
> 개발 기간 : 2024.08 ~ 2024.09

 
> 배포 주소 : ~~~

 
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

## 프로젝트 구성도

<table>
  <thead>
    <tr>
      <th align="center">아키텍처(Architecture)(만들어야함) - 어느 사이트가 좋음?(Architecture)</th>
    </tr>
  </thead>
<tbody>
  <tr>
     <td align="center">
          <a target="_blank" rel="noopener noreferrer" href=""><img src="" alt="아키텍처" width="1000px" style="max-width: 100%;"></a>
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
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/user-attachments/assets/259d967c-51a5-46fd-8bcf-d37839aa840e"><img src="https://github.com/user-attachments/assets/259d967c-51a5-46fd-8bcf-d37839aa840e" alt="ERD" width="1000px" style="max-width: 100%;"></a>
        </td>
    </tr>
  </tbody>
</table>


<details>
  <summary>폴더 구조</summary>
  <br>
<div class="snippet-clipboard-content notranslate position-relative overflow-auto">
  <pre class="notranslate">
    <code>
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
</code>
  </pre>
  <div class="zeroclipboard-container">
  </details>

## 기술 스택
<table>
  <tr>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/ee5c1862-f414-4fa8-b792-bd7844692431" alt="HTML5" width="50px" height="50px" style="max-width: 100%;">
      <p>HTML5</p>
    </th>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/ae9db30b-ded1-4293-9465-44d28008da47" alt="CSS3" width="50px" height="50px" style="max-width: 100%;">
      <p>CSS3</p>
    </th>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/09c362d3-3fb8-42bd-9a6e-4d34882df65b" alt="TypeScript" width="50px" height="50px" style="max-width: 100%;">
      <p>TypeScript</p>
    </th>
    </th>
  </tr>
</table>
<table>
  <tr>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/6e6fd106-e5af-4ca0-9fff-88ebbad214cc" alt="Next.js" width="50px" height="50px" style="max-width: 100%;">
      <p>Next.js</p>
    </th>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/c5ce84df-d47b-48eb-86cf-f0bffa4fec18" alt="Tanstack Query" width="50px" height="50px" style="max-width: 100%;">
      <p>TanStack Query</p>
    </th>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/77782e7c-dbb3-420d-b6b3-6e287bbb9196" alt="Zustand" width="50px" height="50px" style="max-width: 100%;">
      <p>Zustand(예정)</p>
    </th>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/ab3c5285-d954-49d5-82fa-532607a6e9a8" alt="ShadCN/UI" width="50px" height="50px" style="max-width: 100%;">
      <p>ShadCN/UI</p>
    </th>
        <th align="center">
      <img src="https://github.com/user-attachments/assets/73683cf0-d9ee-48ee-a3dc-41e0614a3b41" alt="Tailwind CSS" width="50px" height="50px" style="max-width: 100%;">
      <p>Tailwind CSS</p>
    </th>
        <th align="center">
      <img src="https://github.com/user-attachments/assets/700b75a5-20fa-454f-be73-76c37860be87" alt="Zod" width="50px" height="50px" style="max-width: 100%;">
      <p>Zod</p>
    </th>
        </th>
        <th align="center">
      <img src="https://github.com/user-attachments/assets/18aacac6-b6d2-4fd0-9c39-acdf75e97fd1" alt="React Hook Form" width="50px" height="50px" style="max-width: 100%;">
      <p>React Hook Form</p>
    </th>
        </th>
        <th align="center">
      <img src="https://github.com/user-attachments/assets/d21ebe1d-9fe4-4557-a19e-8d07cdcb7112" alt="NextAuth.js" width="50px" height="50px" style="max-width: 100%;">
      <p>NextAuth.js</p>
    </th>
  </tr>
</table>  
<table>
  <tr>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/e5a102f9-09a9-465e-bfb3-e586d0cecddb" alt="Supabase" width="50px" height="50px" style="max-width: 100%;">
      <p>Supabase</p>
    </th>
    <th align="center">
      <img src="https://github.com/user-attachments/assets/f10e767e-cc5c-41fa-b76d-66303ce19a1b" alt="Vercel" width="50px" height="50px" style="max-width: 100%;">
      <p>Vercel</p>
    </th>
    </table>  

## 기능 소개
**(시연 영상??)**
+ **로그인 / 회원가입**
  + Zod를 이용한 **폼 유효성 검증**(이메일 형식, 대소문자+특수문자+8자 이상 비밀번호, 2자 이상 이름 및 닉네임)
  + React-Hook-Form를 이용한 **폼 상태 관리 및 성능 최적화**
  + NextAuth.js와 Supabase Auth를 이용한 **인증 상태 유지 및 유저 정보 관리**
  + `middelware.ts`를 통해 Token이 없을 시, **서비스 접근 제한 및 보호**
  
+ **게시글 및 댓글 CRUD**
  + TanStack Query useInfiniteQuery를 이용한 **페이지네이션(무한스크롤)**
  + IntersectionObserver를 사용하여 **스크롤 끝에 도달하면 다음 게시글 로드**
  + `useMemo`와 `useCallback`을 이용한 **게시글 데이터 메모이제이션(성능 개선)**
  + ShadCN/UI 모달창을 이용한 **게시글 생성 및 수정(Title/Content/Image)**
  + Next.js Image 컴포넌트 이용하여 **자동 이미지 최적화**
 
+ **게시글 좋아요 & 유저 팔로우**
  + **낙관적 UI 업데이트**를 활용한 좋아요 및 팔로우
  + Supabase Realtime를 이용한 **실시간 업데이트**
 
## 성능 최적화
아직 최적화 중

## 트러블 슈팅
너무 많고 짜잘해서 다 넣을지 뺄지 고민중(최적화 아직 안끝남)



## 목차
[1. 웹 서비스 소개](#웹-서비스-소개)<br>
[2. 기술 스택](#기술-스택)<br>
[3. 주요 기능](#주요-기능)<br>

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

## 웹 서비스 소개
**Share Life**는 사진으로 일상 생활을 공유하는 SNS 서비스입니다.

+ 'Share Life' 계정 정보
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




## 주요 기능
### [회원가입]
+ 이메일 / 비밀번호
  + 


