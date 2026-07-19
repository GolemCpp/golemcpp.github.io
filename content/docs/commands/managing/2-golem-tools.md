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

- `--tools-cache-directory=<path>`

  Select the tools cache directory.

  Default: `~/.cache/golem/tools`

You can also set the tools cache location with the `GOLEM_TOOLS_CACHE_DIRECTORY` environment variable.

## Supported tools

- `cppfront`

  Download and build a cache-backed local cppfront tool.

  See [cppfront](/docs/tools/cppfront/).
