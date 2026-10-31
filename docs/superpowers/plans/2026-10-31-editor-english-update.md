# Editor English Update Implementation Plan

> Execute inline using superpowers:executing-plans and test-driven-development. The user explicitly requested implementation and the full PR/deployment workflow.

**Goal:** Update the matching English edition with one explicit button in the Korean editor.

**Architecture:** Share existing post parsing/writing logic; add a local translation service and dev-only HTTP endpoint; save before translation and show progress in the editor.

**Tech Stack:** Astro, Node.js built-in tests/filesystem/child_process, Marked for Markdown structure validation, existing authenticated Claude Code CLI.

**Spec:** `docs/superpowers/specs/2026-10-31-editor-english-update-design.md`

## Constraints and review focus

- No translation on ordinary save and no translation credentials in browser/static output.
- Preserve resource destinations/code and source metadata, including publication status.
- Provider failure, invalid output, duplicate requests, or concurrent source/English edits must not overwrite existing text.
- Disable editing during the translation request and preserve any changes made during an ordinary save.
- Existing unrelated Korean drafts remain drafts through merge/deployment.

## Task 1: Translation and file handling

- [x] Add temporary-file tests for English creation/update, metadata synchronization, resource/code preservation, failures, concurrent edits, duplicate calls, and invalid slugs; run and observe failure before implementation.
- [x] Extract `parsePost(raw)` and `updatePost(raw, input)` into `src/editor/post.mjs`, keeping the existing editor's preservation rules.
- [x] Implement `updateEnglishPost(root, slug, { generate })` in `src/editor/translate.mjs`; default provider uses Claude Code, with protected Markdown spans, validation, timeout, and atomic target writes.
- [x] Register `/__editor/translate?lang=ko&slug=...` in the dev integration and test actual HTTP responses/files with only the model replaced.
- [x] Run all Node tests; confirm passing.

## Task 2: Editor and delivery

- [x] Add a Korean-only translation panel/button in `src/editor/edit.astro`. Save first, indicate progress, block duplicate interactions, and show an English link after success.
- [x] Document the local CLI login dependency and publication-state behavior in README; add an npm test command.
- [ ] Exercise the actual button on the banner post; verify the saved English file and both publication states.
- [ ] Check the editor at 375/768/1280px, ordinary Save, English view, and production build.
- [x] Request a fresh read-only code review, fix material findings, and rerun affected checks.
- [ ] Commit, push the requested branch, create a PR against main, merge it, and verify Actions and live Korean/English URLs.
