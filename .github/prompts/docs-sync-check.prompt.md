---
name: "Docs Sync Check"
description: "Compare Golem implementation behavior against the docs sources and identify documentation drift. Use when CLI behavior, command flow, cache behavior, recipes, or editor integration may have changed and the docs might need updates."
argument-hint: "Describe the command, feature, file, or change to verify, for example: golem resolve behavior, cache environment variables, sample command flow, clangd setup"
agent: "agent"
---

Review the requested Golem behavior or change and check whether the documentation source is still accurate.

Use these rules:

- Prefer implementation and project files as the source of truth over generated output or published site output.
- Link to existing docs pages instead of rewriting their content.
- Treat the docs sources under [../../content/docs](../../content/docs) as the documentation to review, not `public/`.
- For command behavior, verify against the implementation in [../../../golem/src/golemcpp/golem](../../../golem/src/golemcpp/golem) and, when relevant, the consumer workflow in [../../../golem/examples](../../../golem/examples).
- Remember that the environment-variable page [../../content/docs/reference/1-environment-variables.md](../../content/docs/reference/1-environment-variables.md) is incomplete, so environment behavior should be checked directly in [../../../golem/src/golemcpp/golem/context.py](../../../golem/src/golemcpp/golem/context.py).

Focus on one task: determine whether the docs are in sync for the requested area.

Produce the result in this format:

## Scope

- What implementation area or user workflow was checked
- Which docs pages were compared

## Findings

- List concrete mismatches, omissions, or ambiguities first
- If there are no doc issues, say that explicitly
- For each issue, cite the implementation file and the docs page that disagree

## Recommended Updates

- List the smallest doc changes needed to restore parity
- Prefer specific target pages under `content/docs`
- Note when a docs gap should be fixed by linking to an existing page instead of adding duplicate explanation

## Residual Risks

- Note anything you could not verify from source
- Call out stale sample/editor state if it could mislead the docs review

If the requested area spans multiple commands, keep the response organized by command or feature. If the request is too broad, narrow it to the most likely affected pages and say so.
