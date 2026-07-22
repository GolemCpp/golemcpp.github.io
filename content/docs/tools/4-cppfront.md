---
title: "cppfront"
description: ""
summary: ""
date: 2026-05-19T22:10:28+02:00
draft: false
weight: 904
toc: true
seo:
  title: ""
  description: ""
  canonical: ""
  noindex: false
---

Golem supports `cppfront` for projects that contain `.cpp2` source files.

## Installing cppfront

The easiest way to install cppfront is to use `golem tools` to install it into the tools cache:

```bash
golem tools install cppfront [options]
```

Available options:

- `--version=<version>`

  Git reference to install.

  Default: `v0.8.1`

- `--cache-directory=<path>`

  Select the cache directory. Tools are stored in its `tools/` subdirectory.

  Default: `~/.cache/golem` (tools in `~/.cache/golem/tools`)

Once installed, `golem configure` can reuse that cached installation automatically, without requiring `--cppfront-path` or `--cppfront-include`. But provide `--cache-directory` if not set on the default value.

To learn more about tool management, see [golem tools](/docs/commands/golem-tools/).

## Existing installation

Use `golem configure` to point Golem at an existing cppfront installation:

- `--cppfront-path=<exe_path>`

  Path to the cppfront executable.

- `--cppfront-include=<dir_path>`

  Path to cppfront's `include` directory.

You can also provide the same values through the `CPPFRONT` and `CPPFRONT_INCLUDE` environment variables.

## Lookup order

When a project contains `.cpp2` files, Golem looks for cppfront in this order:

1. `--cppfront-path` and `--cppfront-include`
2. `CPPFRONT` and `CPPFRONT_INCLUDE`
3. A cached installation created by `golem tools install cppfront`
4. `cppfront` on `PATH` for the executable

For the cache-backed lookup, Golem uses the `tools/` subdirectory of `--cache-directory=<path>` when provided, otherwise `GOLEM_CACHE_DIRECTORY`, otherwise `~/.cache/golem/tools`.

## Examples

To learn with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/cppfront>

