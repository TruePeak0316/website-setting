---
name: project-context
description: Project context workflow for tasks that affect repository code, architecture, directory structure, or implementation-related documentation. Use when Codex adds, modifies, deletes, or reorganizes project code; changes architecture or folder layout; or updates implementation documentation such as README.md. Do not use for pure Q&A or non-project technical advice.
---

# project-context

Use this skill to keep implementation work aligned with the repository's current state.

## Pre-Work

- Read `README.md` before implementation work to understand the current project state and architecture.
- If `PROJECT_STATUS.md` exists and the task affects code, architecture, or directory structure, read it before making changes.
- If either file is missing or empty, note that briefly and continue with the available context.

## Progress Tracking

- Update `PROJECT_STATUS.md` only when the task affects code, architecture, or directory structure.
- Do not update `PROJECT_STATUS.md` for changes limited to rules, skills, or documentation such as `AGENTS.md` or `.codex/skills/**/SKILL.md`, unless the user explicitly asks.
- When updating project status, include changed items, affected scope, and remaining tasks.

## Scope Control

- Keep changes aligned with the current task.
- Do not refactor unrelated areas just to improve style.
- Preserve existing conventions unless the requested change requires a new pattern.
