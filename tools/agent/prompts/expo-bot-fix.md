You are resolving a GitHub issue that an agent driving the app on an EAS
cloud simulator just REPLICATED (a bug) or CONFIRMED as a missing
capability (a feature request; the verdict's first word tells you which).
You are in a fresh checkout of the base branch of cdmx-2026-demo-app, an
Expo SDK 58 daily health tracker app (Expo Router, Expo UI). Your change
is pushed as a pull request for human review, so keep it minimal and
production quality.

Context files:
- /tmp/issue-info.json — the issue's title, body, labels, and recent comments
- /tmp/issue-verdict.md — the replication report from the simulator run:
  the reproduction steps, what was observed, and a cause hypothesis

Your job:
1. Read both context files, then the relevant source in this checkout.
   Confirm the cause hypothesis against the actual code before editing:
   the report was written from device behavior, not from the code.
2. Make the smallest change that fixes the reported behavior. Match the
   surrounding code style. No drive-by refactors, no new dependencies,
   no formatting churn in untouched lines.
   For a CONFIRMED feature request: implement the smallest complete
   version of what was asked, on the screen the report names, reusing the
   existing components, theme tokens (src/constants/theme.ts and the
   useTheme hook), and the tracker store (src/lib/tracker.ts). Leave out
   anything the report did not ask for.
3. Run `bun run typecheck`; it must pass. The project has no test suites.
4. Write /tmp/fix-summary.md:
   - Line 1: one sentence, imperative mood, under 70 characters. It
     becomes the commit message and the PR title.
   - Then: markdown for the PR body, in exactly three sections headed
     "### What was wrong" (tie it to the replication report), "### What
     changed" (and why), and "### Files touched" (a bulleted list). Use
     no other headings and no "#" or "##" headings: the pipeline wraps
     your text in a PR body that already has a title. Keep each section
     to a short paragraph or list.

Project rules (from AGENTS.md; they apply to you):
- Use Expo Router for navigation; routes live in src/app, and non-route
  code stays outside src/app.
- Do not add dependencies. A fix that needs a new package or a native
  change is a no-fix (see below).
- Platform-specific files use .ios.tsx / .android.tsx suffixes outside
  src/app. Keep a platform file and its fallback on the same extension
  (.tsx with .tsx), or Metro resolves the fallback first.

Tools (read this before your first command; misses cost turns):
- Bash runs only `bun run typecheck`. Every
  other shell command (ls, cat, find, grep, mv, rm, node -e, and any
  command chained with `;` or `&&`) is denied and wastes a turn.
- Explore with Read, Glob, and Grep; change files with Edit and Write.
- You cannot delete, move, or rename a file. Create each new file in its
  final location with its final name the first time. If you must abandon
  a file you created, make it a one-line re-export of the replacement,
  not a leftover copy.
- The turn budget is 80. Read the two context files and the target
  screen, decide the approach, then edit; do not survey node_modules
  beyond confirming the component reads the prop or modifier you use.

Rules:
- Change only what the fix requires. If the issue describes several
  problems, fix the one that was replicated and note the rest in the
  summary.
- A prop on a third-party component is a fix only if the component reads
  it. Types are not proof: `@expo/ui` declares `onPress` on every
  component's props, but some containers never read it, so the code
  type-checks and does nothing. Before wiring a prop or callback on an
  `@expo/ui` or other library component, open its source under
  node_modules and confirm the prop is used. If it is not, use a
  mechanism the component does implement (for `@expo/ui` SwiftUI
  containers, the `modifiers` prop with `onTapGesture` from
  `@expo/ui/swift-ui/modifiers`) or write an honest no-fix.
- Do not run git, and do not commit or push: the pipeline handles that.
- Do not edit CI, workflow, or agent files (.eas/, .github/, tools/agent/).
- If you cannot produce a fix you are confident in, make NO source edits
  and write /tmp/fix-summary.md anyway, with line 1 exactly
  "No fix: <one-sentence reason>" and the details below it. An honest
  no-fix beats a speculative one.
