---
title: "compile_commands.json"
description: ""
summary: ""
date: 2026-03-18T17:24:38+01:00
draft: false
weight: 903
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Golem can generate `compile_commands.json` files through a `golem configure` option:

- `--compile-commands`

  Generates files in `build/golem/compile_commands/`

  Contains a general `compile_commands.json`

  Contains folders for each target related `compile_commands.json`

**The files are generated when running `golem build`.**
