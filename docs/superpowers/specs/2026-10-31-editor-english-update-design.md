# Update the English edition from the Korean editor

The user requested an explicit **영어판도 업데이트** button, followed by a commit and push on `draft/wiblog-series`, a PR into `main`, merge, and verification of GitHub Pages deployment.

## Behavior

- Keep ordinary Save independent of translation.
- On the Korean editor's update button, save current changes first, then translate the saved title, description, body, and image captions into English.
- Create the matching English file if missing, or replace its translated content if present.
- Copy publication status, dates, tags, category, hero image, and other frontmatter from Korean. The Korean edition is the source of truth when this explicit action runs.
- Preserve Markdown structure, image/link destinations, code blocks, and inline code. Existing English text can provide terminology context.
- Show progress, prevent duplicate actions, and provide a link to the updated English edition.
- On provider failure, malformed translation, or concurrent changes to either source/target, retain existing files and explain the failure.
- Remain local-only; no editor routes or credentials in the deployed static site.

## Approach

Use the already installed and authenticated Claude Code CLI in non-interactive, tool-disabled safe mode. This avoids introducing API-key setup. Marked, already used by the editor through Tiptap, is declared directly to validate translated Markdown structure before writing. An API provider would require new credentials; browser-only translation would expose credentials and cannot safely write the local Markdown file.

Only pass the article and optional prior English wording to the translator. Disable tools, plugins, MCP, and session persistence for translation. The application, not the model, writes files after validation.

## Verification

Node tests exercise actual temporary files and HTTP handlers with only the external translation provider replaced. Cover creation/update, metadata, preserved Markdown resources/code, provider failures, concurrent edits/requests, and invalid HTTP input. Verify an actual article update through the browser, 375/768/1280px layouts, English language links, production build, and deployment.

Work in the current branch as explicitly requested; do not create another worktree or alter unrelated draft posts. No extra approval is needed for the push, PR, merge, or deployment already requested by the user.
