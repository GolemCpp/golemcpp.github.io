---
title: "golem build"
description: ""
summary: ""
date: 2026-01-18T10:16:49+01:00
lastmod: 2026-01-18T10:16:52+01:00
draft: false
weight: 304
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

This command builds the libraries and programs defined in the project file (e.g. `golemfile.py` or `golemfile.json`).

If any dependency is needed, the artifacts are expected to be built using `golem resolve` and `golem dependencies` before hand.

``` bash
golem build [options]
```

## Options

- `-v`

  Show the compile commands and more

  Default: `False`

- `--targets=<target1>,<target2>,...`

  Select targets to build

  Default: Select all the targets
