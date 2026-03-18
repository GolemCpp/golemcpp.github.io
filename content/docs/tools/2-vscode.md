---
title: "Visual Studio Code"
description: ""
summary: ""
date: 2026-03-18T16:55:06+01:00
draft: false
weight: 902
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

For intellisense, Golem supports the **Microsoft C/C++ Extension** through a `golem configure` option:

- `--vscode`

  Generates `.vscode/c_cpp_properties.json`, which refers to `compile_commands.json` files found in `build/golem/vscode/`. Golem generates files for each target and the point of view from which the intellisense shows results can be selected from the bottom right in VSCode.

  Sets `.vscode/cache/.browse.VC.db` as path to store symbols

**The files are generated when running `golem build`.**

For a very fast intellisense, we recommend using `clangd`'s extension, which Golem supports too.
