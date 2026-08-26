---
title: "Configurations"
description: ""
summary: ""
date: 2026-03-24T20:17:38+01:00
draft: false
weight: 202
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

A configuration is a set parameters common to [program](/docs/project-file/definitions/#program), [library](/docs/project-file/definitions/#library), [export](/docs/project-file/definitions/#export) and [dependency](/docs/project-file/definitions/#dependency) definitions.

> [!TIP]+ All the list parameters can be set with single values, Golem makes them lists automatically if they are not.

## General parameters

- `name` string to name the definition

  Will be used as target name if `targets` is not defined.

- `targets` list of target names

  Can contain subfolders to specify where to output the final artifacts.

  Multiple values is only useful when dealing with scripted builds and declaring a dependency that has to refer to multiple targets.

  If unset on program and library definitions, uses the `name` parameter, otherwise finds all the targets being refered to by the `name` parameter.

- `licenses` list of licence files

  Useful to let the user project retrieve the licences of all the dependencies in `build/licences`.

- `no_defaults` boolean

  Controls whether Golem applies its default build settings for the final target.
  - `False` (default): apply Golem's default defines and compiler, linker and archiver flags for the current platform, compiler, architecture and variant.
  - `True`: do not apply these defaults on the final target.

  This is useful when a target or dependency must fully control its own toolchain flags.

## Compilation options

- `defines` list of preprocessor definitions (e.g. `'MY_MACRO=MY_VALUE'`)
- `includes` list of include directories
- `isystems` list of include directories considered as system headers from which no warning should be issued at build
- `source` list of source files (can use [alternative ways to list files](#alternative-ways-to-list-files)), expects `*.cpp`, `*.c`, `*.cxx`, `*.cc` when specifying a directory
- `cflags` list of compilation flags for C files
- `cxxflags` list of compilation flags for C++ files
- `cppflags` list of flags added at the end of compilation commands (C and C++)
- `program_cxxflags` list of compilation flags only effective on program definitions (C and C++), useful when defining a global configuration to use on multiple definitions
- `library_cxxflags` list of compilation flags only effective on library definitions (C and C++), useful when defining a global configuration to use on multiple definitions

## Linking options

- `system` list of library names to use as shared or static library depending on how the build option `--link` is set
- `lib` list of shared library names to use, without prefix or extension
- `libpath` list of search path for shared libraries
- `stlib` list of static library names to use, without prefix or extension
- `stlibpath` list of search path for static libraries
- `linkflags` list of link flags
- `arflags` list of archive flags used when producing static libraries
- `ldflags` list of link flags added at the end of link commands
- `program_linkflags` list of linking flags only effective on program definitions, useful when defining a global configuration to use on multiple definitions
- `library_linkflags` list of linking flags only effective on library definitions, useful when defining a global configuration to use on multiple definitions
- `framework` list of frameworks (macOS)
- `frameworkpath` list of search path for frameworks (macOS)
- `rpath` list of paths to hard-code into the binary during linking time
- `rpath_link` list of search paths to link libraries

## Header-only libraries

- `header_only` boolean
  - `True`: no artifacts to expect
  - `False`: artifacts to expect

  Useful when exporting a library for the user target to know if has to expect artifacts or not.

## Linking against other libraries

- `use` list of library names referring to library definitions local to the project
- `deps` list of dependency names referring to dependency definitions local to the project themselves referring to libraries from other projects

## Qt parameters

- `source` list of source files, can include `*.ui` and `*.rc` files (can use [alternative ways to list files](#alternative-ways-to-list-files)), also expects `*.ui`, `*.rc` when specifying a directory and Qt is enabled
- `moc` list of header files (can use [alternative ways to list files](#alternative-ways-to-list-files)), expects `*.hpp`, `*.h`, `*.hxx`, `*.hh` when specifying a directory
- `qmldirs` list of directories containing QML files
- `features` list of Qt libraries according the format 'QT5*' or 'QT6*' (e.g. `'QT6CORE'`)

## DEB package

There is an experimental command `golem requirements` to install all the needed DEB packages to build and develop the project. The needed packages can be described with the following parameters. This information is also used when generating a DEB package for the project.

- `package` list of DEB packages required to run the target (e.g. `'libssl3t64'`)
- `package_dev` list of DEB packages required to develop and debug the target (e.g. `'libssl-dev'`)

## Scripted builds

- `scripts` list of function pointers to build a program or library independantly from Golem
- `targets` list of targets to expect after a successfull build
- `target_decorators` list of function pointers to decorate target names depending on the build options
- `artifacts_generators` list of function pointers to generate artifact filenames from decorated targets
- `artifacts_dev` list of development artifacts (e.g. _.lib, _.so) to expect after a successfull build
- `artifacts_run` list of runtime artifacts (e.g. _.dll, _.so) to expect after a successfull build

## Alternative ways to list files

Some parameters are meant to be lists of files. To not have to list them individually, these parameters can accept alternative inputs and resolve them into a list of files at runtime.

The accepted inputs are:

- **Files:** relative or absolute paths.

- **Directories:** recursively searches for a list of files with certain extensions expected by the parameter.

- **[Ant Glob patterns](http://ant.apache.org/manual/dirtasks.html)**: similar to a wildcard pattern (e.g. `'src/**/*.cpp'` recursively searches source files in `src`), remember that the '..' sequence does not represent the parent directory.

- **[ant_glob() arguments](https://waf.io/apidocs/Node.html?highlight=ant_glob#waflib.Node.Node.ant_glob)** as a tuple or dict: Can be equivalent to the single Ant Glob pattern (e.g. `{'incl': 'src/**/*.cpp'}`) but allows more options to control the search.
