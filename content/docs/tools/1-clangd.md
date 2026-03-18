---
title: "clangd"
description: ""
summary: ""
date: 2026-03-18T16:55:01+01:00
draft: false
weight: 901
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Golem supports `clangd` through a `golem configure` option:

- `--clangd`

  Generates `.clangd` at the root of the project

  Uses `build/golem/clangd/compile_commands.json`

**The files are generated when running `golem build`.**
