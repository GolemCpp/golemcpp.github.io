---
title: golem init
url: "/docs/commands/golem-init/"
description: ""
summary: ""
date: 2026-04-22T20:45:45+02:00
draft: false
weight: 311
toc: true
seo:
  title: ""
  description: ""
  canonical: ""
  noindex: false
---

This command generates a starter `golemfile.py` in the current project directory.

The generated file is a normal Python project file with inline hints about the usual Golem workflow, including when to run `configure`, `resolve`, `dependencies`, and `build`.

``` bash
golem init [--project-dir=<project_dir>] [--force]
```

## Options

- `--project-dir=<project_dir>`

  Directory where `golemfile.py` should be generated

  Default: Current directory

- `--force`

  Overwrite an existing `golemfile.py` or replace an existing `golemfile.json`

## Notes

- Without `--force`, `golem init` refuses to replace an existing `golemfile.py` or `golemfile.json`.
- With `--force`, `golem init` removes any existing `golemfile.py` or `golemfile.json`.
- The command creates only the project file. You still need to add your sources, for example `src/main.cpp`.
- A common next step is:

  ``` bash
  golem configure --variant=debug
  golem build
  ```

- If you later add dependencies with `project.dependency(...)`, run:

  ``` bash
  golem resolve
  golem dependencies
  golem build
  ```
