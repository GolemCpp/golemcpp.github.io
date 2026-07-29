---
title: golem tools
url: "/docs/commands/golem-tools/"
description: ""
summary: ""
date: 2026-05-19T22:42:37+02:00
draft: false
weight: 332
toc: true
seo:
  title: ""
  description: ""
  canonical: ""
  noindex: false
---

`golem tools` manages external tools that Golem can install into its cache.

``` bash
golem tools install <tool> [--version=<version>]
golem tools uninstall <tool> [--yes]
golem tools list [--available]
```

## Subcommands

- `install <tool> [--version=<version>]`

  Install or replace a supported tool. The tool is written into the first **writable** cache the
  [resolution policy](/docs/advanced/cache-system/#cache-resolution-policies) selects for it. If
  that cache is read-only, the install is refused rather than silently written elsewhere.

- `uninstall <tool> [--yes]`

  Remove an installed tool. The command prints what it is about to delete and asks for
  confirmation; pass `--yes` to skip the prompt. A tool found in a **read-only** cache is reported
  and left untouched.

- `list`

  List installed tools, each with the cache location holding it and a `(read-only)` marker where
  applicable.

- `list --available`

  List tools that Golem currently knows how to install.

## Tools live in the project's caches

A tool is a cached resource like any other, so `golem tools` searches **every** configured cache
location — the primary cache, the additional writable ones and the read-only ones — following the
same [cache resolution](/docs/advanced/cache-system/) as dependencies. A tool served from a shared
read-only cache is found and used without being reinstalled.

The set of caches is resolved with the usual
[precedence](/docs/commands/golem-config/#resolution-order), which includes the options a previous
`golem configure` persisted. Point the command at a non-default build directory with
`--build-dir=<path>` to pick those up.

## Options

- `--cache-directory=<path>`

  Select the base cache directory. Tools are stored in its `tools/` subdirectory,
  or flat at the cache root under a short hash when [path minimization](/docs/advanced/cache-system/#path-minimization)
  is enabled (the default).

  Default: `~/.cache/golem` (tools in `~/.cache/golem/tools`)

- `--cache-minimization-enabled[=<on|off>]`

  Store tools under short hashed flat paths to avoid long-path limits. Omit for
  the automatic default, pass the bare flag to force it on, or pass `=on` / `=off`
  to force a value.

  Default: `on`

- `--cache-minimization-length=<n>`

  Number of hash characters used for minimized tool names.

  Default: `8`

- `--yes`, `-y`

  Do not prompt for confirmation before uninstalling.

- `--build-dir=<path>`

  Read the options of a previous `golem configure` from this build directory instead of the default
  `build/`.

Every cache setting can also come from its environment variable
(`GOLEM_CACHE_DIRECTORY`, `GOLEM_ADDITIONAL_CACHE_DIRECTORIES`,
`GOLEM_CACHE_MINIMIZATION_ENABLED`, …) or from a stored
[golem config](/docs/commands/golem-config/) setting, exactly like the rest of the cache. The
additional and read-only cache directories have no `golem tools` option: set them through the
environment or the configuration store.

## Supported tools

- `cppfront`

  Download and build a cache-backed local cppfront tool.

  See [cppfront](/docs/tools/cppfront/).
