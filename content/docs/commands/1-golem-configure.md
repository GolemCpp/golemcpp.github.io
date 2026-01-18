---
title: golem configure
description: ""
summary: ""
date: 2026-01-18T07:30:00.897Z
lastmod: 2026-01-18T07:30:00.897Z
draft: false
weight: 301
toc: true
seo:
  title: ""
  description: ""
  canonical: ""
  noindex: false
---

This command allows you to configure how to build your project.

The choices are saved, therefore it needs to be run only once. Modifying the project file will not require re-executing this command.

``` bash
golem configure [options]
```

## Build options

- `--dir=<build_dir>`

  Directory where to build the project

  Default: `./build`

- `--variant=(debug|release)`

  Variants define a set of default flags/options for your build

  Default: `debug`

- `--runtime=(shared|static)`

  Links the runtime dynamically (`shared`) or statically (`static`)

  Default: `shared`

- `--link=(shared|static)`

  Builds and links libraries dynamically (`shared`) or staticaly (`static`)

  Default: `shared`

- `--arch=(x64|x86)`

  Builds using the specfied architecture

  Default: `<your_os_arch>`

## IDE/support options


- `--vscode`

  Generates files to enable Microsoft C/C++ Extension's IntelliSense in VSCode

  Default: `False`

- `--clangd`

  Generates files to support clangd

  Default: `False`

- `--compile-commands`

  Generates `compile_commands.json` files in `./build/golem/compile_commands/`

  Default: `False`

## Qt options

- `--qtdir=<qt_dir>`

  Directory to Qt, for example `C:\Qt\6.10.0\msvc2022_64`

  Default: `None`
