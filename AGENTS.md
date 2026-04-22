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

## Editing Rules

- Do not hand-edit [public](public), [resources/_gen](resources/_gen), or [hugo_stats.json](hugo_stats.json) unless the task is explicitly about generated output.
- If a styling change depends on purge results, inspect [config/postcss.config.js](config/postcss.config.js) and the generated stats file.
- Preserve existing Hugo front matter and Thulite structure when editing docs pages or layouts.

## Useful Patterns

- [content/docs/guides/2-getting-started.md](content/docs/guides/2-getting-started.md): docs-page front matter and markdown style.
- [layouts/home.html](layouts/home.html): local Hugo template override.
- [config/_default/module.toml](config/_default/module.toml): module mounts and overrides.
- [assets/js/custom.js](assets/js/custom.js) and [config/postcss.config.js](config/postcss.config.js): asset pipeline conventions.
