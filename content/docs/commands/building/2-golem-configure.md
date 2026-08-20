---
title: golem configure
url: "/docs/commands/golem-configure/"
description: ""
summary: ""
date: 2026-01-18T07:30:00.897Z
draft: false
weight: 312
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

- `--arch=<architecture>`

  Builds for the specified architecture, named as in [Architectures](/docs/reference/architectures/)

  `golem configure` fails when the compiler it selects builds for another one. On the x86 family a
  multilib toolchain is found by building with `-m32` or `-m64`, so `--arch=i686` works on an x86_64
  Linux only where the 32-bit userland is installed.

  Default: what the selected compiler builds for

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

## Dependency resolution options

- `--overrides-configuration=<path>`

  Path to an `overrides.json` overriding how dependencies resolve. Wins over the overlays.

  Default: `None`

  See [Dependencies](/docs/advanced/dependencies/#management-and-conflict-mitigation) to know more

- `--overlay-location=[<kind>+]<locator>[#<version>]` (repeatable)

  Add an [overlay](/docs/advanced/dependencies/#overlays) carrying an `overrides.json`. Pass the
  option once per overlay; they are layered in the order given.

  Default: `None`

- `--cookbook-location=[<kind>+]<locator>[#<version>]` (repeatable)

  Add a [cookbook](/docs/advanced/recipes/#custom-cookbooks) to search for recipes. Pass the option
  once per cookbook; they are searched in the order given, replacing the default cookbook.

  Default: `git+https://github.com/GolemCpp/recipes.git`

## Cache System options

See [Cache System](/docs/advanced/cache-system) to know more

- `--cache-directory=<path>`

  Change the default cache directory

  Default: `~/.cache/golem`

- `--additional-cache-directory=<path>[=<url-regex>]` (repeatable)

  Add an additional **writable** cache directory. Pass the option once per directory.

  `<path>` is a directory where the matched dependencies are stored

  `<url-regex>` has to match the dependency's repository URL, or be left empty to match anything

  Default: `None`

- `--additional-read-only-cache-directory=<path>[=<url-regex>]` (repeatable)

  Same as above, but the directory is **read-only**: Golem reads dependencies from it but never writes into it.

  Default: `None`

- `--cache-resolution-policy=<policy>`

  `strict` (default) Stops at the first valid cache definition found for the given dependency.

  `weak` Tries to find the dependency in each valid cache definition, or returns the first valid cache definition for the given dependency.

  Default: `strict`

- `--cache-minimization-enabled[=<on|off>]`

  Store new cached resources under short hashed flat paths to avoid long-path limits (for example Windows `cl.exe`). Omit for the automatic default, pass the bare flag to force it on, or pass `=on` / `=off` to force a value.

  Default: `on`

- `--cache-minimization-length=<n>`

  Number of hash characters used for minimized resource names.

  Default: `8`
