# Agent Notes

## Scope

- This folder is the Hugo/Thulite documentation site for Golem.
- Prefer source files under `content`, `layouts`, `assets`, and `config` over generated output.

## Source Of Truth

- Command and guide content lives under [content/docs](content/docs).
- When editing docs for Golem behavior, verify the implementation in [../golem](../golem) and examples in [../golem/examples](../golem/examples).
- Key docs to link instead of duplicating are [content/docs/guides/2-getting-started.md](content/docs/guides/2-getting-started.md), [content/docs/commands/3-golem-configure.md](content/docs/commands/3-golem-configure.md), [content/docs/commands/4-golem-resolve.md](content/docs/commands/4-golem-resolve.md), [content/docs/commands/5-golem-dependencies.md](content/docs/commands/5-golem-dependencies.md), [content/docs/commands/6-golem-build.md](content/docs/commands/6-golem-build.md), [content/docs/tools/1-clangd.md](content/docs/tools/1-clangd.md), and [content/docs/tools/2-vscode.md](content/docs/tools/2-vscode.md).

## Environment And Commands

- Use the package scripts in [package.json](package.json): `npm run dev`, `npm run build`, `npm run format`, `npm run preview`.
- Node must satisfy the engine constraint in [package.json](package.json), and Hugo is an external prerequisite.
- Expect environment skew: [netlify.toml](netlify.toml) and [.github/workflows/hugo.yml](.github/workflows/hugo.yml) pin different Hugo versions.

## Writing Docs

- **Write for someone reading in a hurry.** Keep one idea per sentence. Name the subject, then say what follows from it, and mark the step with `therefore`, `so`, `but` or `otherwise`, so the reader does not have to infer the turn. Prefer a short paragraph over a long one, and a list over a paragraph when the items are genuinely separate. Never make the page its own subject: `This section explains how caching works.` and `Note that the cache is shared.` describe the documentation, where `Every project on a machine reads the same cache.` states the fact the reader came for.
- **Show the structure instead of narrating it.** Give each case its own line, whether that is a list, a table or a set of headings, because a paragraph hides how many cases there are. Give parallel things a parallel shape for the same reason: two settings, two commands or two reasons read in one pass when they are worded alike, and cost a reparse when they are not. But a list is only for items that differ. When two rows or two bullets share most of their words, cut them to one line naming the difference, which is all the reader was going to take from them.
- **Use the words Golem and Git already use**: locator, location, request, version, cache root, fetch, ref, branch, tag, resolve. Do not invent a metaphor for something that already has a name. Prefer the concrete word to the general one, for a noun as much as for a verb: say what a command writes, not that it "makes changes"; say `the source directory`, not `the content`. Where a term stays abstract, give an example: `a reference (e.g. a branch, a tag)`.
- **Show it before explaining it.** A command line, a setting, or a worked example carries more than the paragraph describing it. Put the example first and keep the prose around it short.
- **Skip the flourishes.** Do not pack a relation into a compound adjective, do not close a sentence on a punchline, and do not write an epigram where a plain statement will do. Being plain is not being long, so cut a sentence instead of decorating it.
- The same intent governs the comments and docstrings in [../golem](../golem); see the `Writing Code` section of [../golem/AGENTS.md](../golem/AGENTS.md).

## Editing Rules

- Do not hand-edit [public](public), [resources/_gen](resources/_gen), or [hugo_stats.json](hugo_stats.json) unless the task is explicitly about generated output.
- If a styling change depends on purge results, inspect [config/postcss.config.js](config/postcss.config.js) and the generated stats file.
- Preserve existing Hugo front matter and Thulite structure when editing docs pages or layouts.

## Useful Patterns

- [content/docs/guides/2-getting-started.md](content/docs/guides/2-getting-started.md): docs-page front matter and markdown style.
- [layouts/home.html](layouts/home.html): local Hugo template override.
- [config/_default/module.toml](config/_default/module.toml): module mounts and overrides.
- [assets/js/custom.js](assets/js/custom.js) and [config/postcss.config.js](config/postcss.config.js): asset pipeline conventions.
