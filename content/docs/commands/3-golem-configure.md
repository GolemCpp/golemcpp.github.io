---
title: golem configure
description: ""
summary: ""
date: 2026-01-18T07:30:00.897Z
draft: false
weight: 303
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

- `--project-dir=<project_dir>`

  Directory containing the project file

  Default: Current directory

- `--build-dir=<build_dir>`

  Directory where to build the project

  Default: `./build`

- `--variant=(debug|release)`

  Variants define a set of default flags/options for your build

  Default: `debug`

- `--runtime-link=(shared|static)`

  Links the runtime dynamically (`shared`) or statically (`static`)

  Default: `shared`

- `--runtime-variant=(debug|release)`

  Selects the runtime variant independently from the project variant. This is mainly relevant on Windows for choosing between debug and release CRTs.

  Default: matches `--variant`

- `--link=(shared|static)`

  Builds and links libraries dynamically (`shared`) or staticaly (`static`)

  Default: `shared`

- `--arch=(x64|x86)`

  Builds using the specfied architecture

  Default: `<your_os_arch>`

- `--check-c-compiler=<compiler>`

  Hints the C compiler to use

  Default: Searches for gcc, clang and cl.exe

- `--check-cxx-compiler=<compiler>`

  Hints the C++ compiler to use

  Default: Searches for g++, clang++ and cl.exe

## Qt options

- `--qtdir=<qt_dir>`

  Directory to Qt, for example `C:\Qt\6.10.0\msvc2022_64`

  Default: `None`

## cppfront options

- `--cppfront-path=<exe_path>`

  Path to cppfront executable

  Default: `None`

- `--cppfront-include=<dir_path>`

  Path to cppfront include directory

  Default: `None`

For cppfront setup, cache-backed installs, and lookup behavior, see [cppfront](/docs/tools/cppfront/).

## IDE / Tools options

- `--vscode`

  Generates files to enable Microsoft C/C++ Extension's IntelliSense in VSCode

  Default: `False`

  See [Visual Studio Code](/docs/tools/visual-studio-code) to know more

- `--clangd`

  Generates files to support clangd

  Default: `False`

  See [clangd](/docs/tools/clangd) to know more

- `--compile-commands`

  Generates `compile_commands.json` files in `./build/golem/compile_commands/`

  Default: `False`

  See [compile_commands.json](/docs/tools/compile_commands.json) to know more

## Cache System options

See [Cache System](/docs/advanced/cache-system) to know more

- `--cache-directory=<path>`

  Change the default cache directory

  Default: `~/.cache/golem`

- `--define-cache-directories=<path1>=<regex1>|<path2>=<regex2>|...`

  `<path>` is a directory where the matched depencencies are stored

  `<regex>` has to match the dependency's URL or be left empty

  | is the sperator between multiple cache definitions

  Default: `None`

- `--cache-resolution-policy=<policy>`

  `strict` (default) Stops at the first valid cache definition found for the given dependency.

  `weak` Tries to find the dependency in each valid cache definition, or returns the first valid cache definition for the given dependency.

  Default: `strict`
