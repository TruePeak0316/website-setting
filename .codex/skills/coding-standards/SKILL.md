---
name: coding-standards
description: Repository coding standards for adding, modifying, refactoring, reviewing, or designing code. Use when Codex touches code, proposes implementation snippets, performs code review, or gives architecture advice in this repository; do not use for pure Q&A, deployment-only work, or unrelated documentation updates.
---

# coding-standards

Follow these repository standards whenever work affects code or implementation design.

## Code Changes

- You may modify project code files as needed for the requested task.
- If explanatory documentation is needed, update existing documentation such as `README.md` or `PROJECT_STATUS.md`.
- Do not create new explanatory documentation files such as `NOTES.md` or `HOW_TO.md` unless the user explicitly asks.
- Prefer clear names, simple control flow, and locally established patterns.
- Keep important configuration centralized instead of scattering hard-coded values.

## Modularity

- Keep a single source file under 600 lines. If a file would exceed that limit, split it by responsibility.
- Split modules by single responsibility, not arbitrary line count.
- Depend on explicit interfaces between modules: functions, classes, types, or stable public helpers.
- Keep directory structure aligned with architecture layers such as `core/`, `api/`, `utils/`, or `models/` when those layers exist.
- Update all imports when refactoring module paths.

## Reuse Existing Solutions

- For common features that likely have mature prior art, first assess whether an existing implementation or pattern should be adapted.
- If an external reference implementation would materially reduce risk, ask the user to provide candidate GitHub repositories, examples, or snippets.
- Do not replace the user's source-gathering step with independent external searching when this repository rule applies.

## Review Expectation

Assume code changes will be reviewed by a strict senior reviewer. Keep changes focused, understandable, and easy to justify.
