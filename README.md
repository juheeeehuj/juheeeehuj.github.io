# juheeeehuj.github.io

한/영 블로그. [Astro](https://astro.build)로 만들고 GitHub Pages로 무료 배포합니다.

**주소:** https://juheeeehuj.github.io

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
   tags: ['design']
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
| 사이트 이름·소개 문구   | `src/i18n/ui.ts`                 |
| 소개(About) 페이지      | `src/pages/[lang]/about.astro`   |
| 색·폰트·폭              | `src/styles/global.css` 맨 위    |
| 헤더 / 푸터             | `src/components/Header.astro` · `Footer.astro` |
| 글 페이지 레이아웃      | `src/layouts/BlogPost.astro`     |
| 배포 설정               | `.github/workflows/deploy.yml`   |

## 개인 도메인 연결하기 (나중에)

1. 도메인을 산다 (가비아, Cloudflare, Namecheap 등).
2. `public/CNAME` 파일을 만들고 도메인 한 줄만 적는다. 예: `juhee.dev`
3. `astro.config.mjs` 의 `SITE` 를 `https://juhee.dev` 로 바꾼다.
4. 도메인 업체 DNS 설정:
   - 루트 도메인(`juhee.dev`): A 레코드 4개 → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` 서브도메인: CNAME → `juheeeehuj.github.io`
5. GitHub 레포 → Settings → Pages → Custom domain 에 도메인 입력, **Enforce HTTPS** 체크.

DNS 반영은 몇 분에서 하루까지 걸릴 수 있다.
