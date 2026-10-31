# Work and Case Studies Implementation Plan

> **For agentic workers:** Execute inline with superpowers:executing-plans; review the complete change once before completion.

**Goal:** Separate Work and Case Studies in both languages, classify the requested projects, and swap Yeosu and Refine.

**Architecture:** Keep the existing content collection and detail URLs. A shared classification helper filters both listing pages and the homepage, and selects the appropriate parent navigation for detail pages. Reuse one listing component.

**Tech Stack:** Astro, MDX, existing CSS, Node test runner.

**Spec:** User instructions in this conversation, including the later clarification restoring The Answers to Case Studies and moving the five private projects to Work.

## Global Constraints

- Branch: `feat/work-case-studies`; preview at `http://localhost:4321/ko/work/`.
- Work: CHAISA, WITIM identity, Yeosu, Refine, AX Studio Showcase, company website, hospital sales brochure.
- Work also includes Wiblog, WITIM marketing design, WITIM design system, CHAISA → ONEQ pivot, and SGA100.
- Remaining items belong to Case Studies; retain existing draft/locked visibility rules.
- The Answers belongs to Case Studies. The completed WWF case study stays; its obsolete locked placeholder must not appear.
- Private entries use a uniform muted color at 50% opacity, with no hover preview. Existing publication visibility is preserved.
- Preserve detail URLs and external/PDF destinations.
- Keep Korean and English categories/order consistent.
- Yeosu appears immediately before Refine.
- The user authorized commit, push, PR creation, and merge after reviewing the local changes.

## Review Focus

- Detail pages highlight and return to the right listing even though their existing URLs contain `/work/`.
- Full-screen studio pages close to the right listing, including Wingo in Case Studies.
- Homepage Work sections contain only Work projects.
- Language toggles remain on the same listing and existing detail links still resolve.
- Five GNB items remain usable at mobile, tablet, and desktop sizes.

### Task 1: Classification and listing separation

**Files:** `src/portfolio.mjs`, `src/portfolio.test.mjs`, `src/i18n/ui.ts`, `src/components/PortfolioListing.astro`, listing routes, `package.json`.

- [x] Write behavior tests for partitioning bilingual entries, preserving The Answers in Case Studies, and placing unlisted future entries in Case Studies; observe failure before implementation.
- [x] Implement the shared selection helper and localized listing component; add the Case Studies listing.
- [x] Verify classification tests and the existing suite.

### Task 2: Navigation, homepage, detail context, and ordering

**Files:** Header, home page, standard/studio detail routes and layouts, Refine/Yeosu frontmatter in both languages.

- [x] Add localized GNB labels and listing introductions; select only Work on the homepage.
- [x] Give detail pages the correct parent link, active GNB, and related projects.
- [x] Swap Refine and Yeosu order in both languages.
- [x] Build and verify both listing memberships, existing detail URLs, return links, and language switching in the browser at 375/768/1280 px.
- [x] Obtain one read-only review of the complete change and address significant findings.

## Execution Notes

- Baseline: 19 tests passed before implementation; main was clean at `a6ecb92`.
- Ruling: use the existing main checkout on the new feature branch so the user's running server on port 4321 reflects the changes; no new server is needed.
- Classification clarification: user confirmed the five private projects belong to Work, and The Answers belongs to Case Studies. Updated the shared classification and tests accordingly.
- Verification: 23/23 tests pass; production build generates 39 pages; both languages and all three viewport sizes have no content clipping or document overflow. Mobile GNB horizontal scrolling remains usable, including the last About item.
- Browser checks: both listing language toggles, WWF breadcrumbs/active menu/related projects, Wingo close-to-Case-Studies, CHAISA close-to-Work, and homepage membership pass.
- Restarted the existing background server on port 4321 after confirming it retained stale collection entries across branch changes; fresh content now matches disk.
- Initial read-only review: no Critical, Important, or Minor findings. After local review, the user clarified the private project classification and requested muted styling, then authorized integration.
