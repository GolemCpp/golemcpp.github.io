---
title: "Conditions"
description: ""
summary: ""
date: 2026-03-24T20:17:42+01:00
draft: false
weight: 203
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Every [configuration](/docs/project-file/configurations) can make use of a condition mechanism to conditionally add parameters.

``` python
task = project.program(name='hello-conditions',
                       source=['src'])
task.when(osystem="windows", includes=['src/windows'])
task.when(osystem="linux", includes=['src/linux'])
task.when(osystem="osx", includes=['src/macos'])
```

`project.program()` returns a task, which is in fact a definition to build a program, and since it's a program it also is a configuration, therefore it can make use of the condition mechanism `.when()`. Here is how it works:

``` python
def when(self,
         variant=None,
         link=None,
         runtime=None,
         osystem=None,
         arch=None,
         compiler=None,
         distribution=None,
         release=None,
         <any configuration parameter>)
```

The `when()` function takes a list of parameters to express *when* certain configuration parameters should be applied.

In other words, these condition parameters have to match the options they refer to (e.g. [`golem configure` options](/docs/commands/golem-configure/#build-options)) to allow the associated configuration parameters to be applied to what is currently being built.

Here is a description of these condition parameters:

> [!TIP]+
> All the list parameters can be set with single values, Golem makes them lists automatically if they are not.

- `variant` list of variants (e.g. `'debug'`, `'release'`)

- `link` list of linking options (e.g. `'shared'`, `'static'`)

- `runtime` list of runtime linking options (e.g. `'shared'`, `'static'`)

- `arch` list of architectures (e.g. `'x86'`, `x64`)

- `compiler` list of compilers (e.g. `'msvc'`, `'gcc'`, `'clang'`)

- `osystem` list of platforms (e.g. `'windows'`, `'osx'`, `'linux'`)

- `distribution` list of Linux distributions (e.g. `'debian'`)

- `release` list of Linux distribution releases (e.g. `'trixie'`), requires `lsb_release` Python module

In our previous example, `task.when(osystem="windows", includes=['src/windows'])` adds `'src/windows'` to the `includes` parameter of the task only if the current platform is **Windows**.

## Examples

To learn with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/conditions>
