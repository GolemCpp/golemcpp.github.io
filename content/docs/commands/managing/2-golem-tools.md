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

`golem tools` manages external tools that Golem can install into its tools cache.

``` bash
golem tools install <tool> [--version=<version>]
golem tools uninstall <tool>
golem tools list [--available]
```

## Subcommands

- `install <tool> [--version=<version>]`

  Install or replace a supported tool into the selected tools cache.

- `uninstall <tool>`

  Remove an installed tool from the selected tools cache.

- `list`

  List tools currently installed in the selected tools cache.

- `list --available`

  List tools that Golem currently knows how to install.

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

You can also set the cache location with the `GOLEM_CACHE_DIRECTORY` environment variable. Path minimization honours the same `GOLEM_CACHE_MINIMIZATION_ENABLED` / `GOLEM_CACHE_MINIMIZATION_LENGTH` environment variables and [golem config](/docs/commands/golem-config/) settings as the rest of the cache.

## Supported tools

- `cppfront`

  Download and build a cache-backed local cppfront tool.

  See [cppfront](/docs/tools/cppfront/).
