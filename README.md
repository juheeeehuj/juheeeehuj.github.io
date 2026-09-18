# juheeeehuj.github.io

한/영 블로그. [Astro](https://astro.build)로 만들고 GitHub Pages로 무료 배포합니다.

**주소:** https://juheeoh.com

## 글 쓰기

1. `src/content/blog/ko/` 와 `src/content/blog/en/` 에 **같은 파일명**으로 마크다운을 만든다.
   - `ko/my-post.md` + `en/my-post.md` → 오른쪽 위 KO/EN 버튼으로 서로 전환된다.
   - 한 언어만 써도 된다. 그때 토글은 상대 언어 홈으로 간다.
   - 파일명이 곧 주소다: `ko/my-post.md` → `/ko/blog/my-post/`
2. 맨 위에 frontmatter:

   ```yaml
   ---
   title: '글 제목'
   description: '목록과 검색 결과에 보이는 한 줄 요약'
   pubDate: 2026-09-18
   # updatedDate: 2026-09-20            # (선택) 수정일
   # heroImage: '../../../assets/x.jpg' # (선택) 대표 이미지. src/assets/ 에 넣는다
   category: design                     # product | design | ai (메뉴·카테고리 페이지)
   tags: ['design']
   # featured: true                     # (선택) 홈 상단 슬라이드에 올린다. 3개 이상일 때 보인다
   # draft: true                        # (선택) true 면 배포에서 빠진다
   ---
   ```

3. `git add . && git commit -m "새 글" && git push` → 1~2분 뒤 자동 반영.

## 로컬에서 보기

```bash
npm install      # 처음 한 번
npm run dev      # http://localhost:4321
npm run build    # 배포와 같은 빌드 (에러 확인용)
```

## 어디를 고치나

| 바꾸고 싶은 것          | 파일                             |
| ----------------------- | -------------------------------- |
| 사이트 이름·소개 문구·SNS 주소 | `src/i18n/ui.ts`          |
| 소개(About) 페이지      | `src/pages/[lang]/about.astro`   |
| 프로필 사진             | `public/avatar.jpg` (정사각형)   |
| 색·폰트·폭              | `src/styles/global.css` 맨 위    |
| 헤더 / 푸터             | `src/components/Header.astro` · `Footer.astro` |
| 글 페이지 레이아웃      | `src/layouts/BlogPost.astro`     |
| 배포 설정               | `.github/workflows/deploy.yml`   |

## 도메인 (juheeoh.com)

- 구입처: 가비아. 만기일 2027-09-18이니 **연장**을 잊지 않는다.
- DNS (가비아 → DNS 관리):
  - `@` A 레코드 4개 → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - `www` CNAME → `juheeeehuj.github.io.`
- GitHub: 레포 Settings → Pages → Custom domain = `juheeoh.com`, Enforce HTTPS 체크.
  GitHub Actions 로 배포하므로 `public/CNAME` 파일은 필요 없다.
- 도메인을 바꾸면 `astro.config.mjs` 의 `SITE` 도 같이 바꾼다.
