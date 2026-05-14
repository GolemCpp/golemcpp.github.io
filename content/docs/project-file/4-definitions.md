---
title: "Definitions"
description: ""
summary: ""
date: 2026-03-24T20:17:56+01:00
draft: false
weight: 204
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

## Program

Here is how to define a program:

``` python
task = project.program(name='hello',
                       source=['src'],
                       <any other configuration parameter>)
```

`program()` requires a `name`, and accepts any [configuration parameters](/docs/project-file/configurations).

It returns a `task` definition holding all the important parameters to build the program.

This `task` can make use of the [condition mechanism](/docs/project-file/conditions) `when()` to define conditionnally certain parameters.

### Examples

To learn more about programs with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/hello>
- <https://github.com/GolemCpp/golem/tree/main/examples/minimal>

## Library

Here is how to define a library:

``` python
task = project.library(name='mylib',
                       source=['src'],
                       <any other configuration parameter>)
```

`library()` requires a `name`, and accepts any [configuration parameters](/docs/project-file/configurations).

It returns a `task` definition holding all the important parameters to build the library.

This `task` can make use of the [condition mechanism](/docs/project-file/conditions) `when()` to define conditionnally certain parameters.

### Examples

To learn more about libraries with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/minimal>

## Export

An export definition allows a `library` to be used by another target. This definition **exports** the library with all the mandatory parameters for another target to use the library.

Here is how to define an export:

``` python
task = project.export(name='mylib',
                      includes=['mylib/include'],
                      <any other configuration parameter>)
```

Similarly to `program` and `library`...

`export()` requires a `name`, and accepts any [configuration parameters](/docs/project-file/configurations).

It returns a `task` definition holding all the important parameters to build the library.

This `task` can make use of the [condition mechanism](/docs/project-file/conditions) `when()` to define conditionnally certain parameters.

But...

An export has to have a name matching the library it is exporting.

### Using a library

A target (e.g. program or library) needing to link against a library has to refer to the corresponding export by using the `use` parameter. And another export definition can also refer to it similarly, if needed.

``` python
project.library(name='mylib',
                includes=['mylib/include'],
                source=['mylib/src'])

task = project.export(name='mylib',
                      includes=['mylib/include'])

project.program(name='hello',
                source=['hello/src'],
                use=['mylib'])
```

In this example, the program `'hello'` is built with an additional include directory `'mylib/include'` pulled from the export definition it refers by `use=['mylib']`

### Header-only libraries

Since a library definition is meant to be built, if the library is intended to be header-only, the library definition can be skipped, and remains an export definition with `header_only=True`.

``` python
project.export(name='foo',
               includes=['foo/include'],
               header_only=True)

project.program(name='hello',
                source=['hello/src'],
                use=['foo'])
```

In this situation, no library is built, and program `'hello'` is able to use the header-only library named `'foo'`.

### Examples

To learn more about exports with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/minimal>

## Additional parameters for targets

Target definitions such as [programs](#program), [libraries](#library) and [exports](#export) can define an additional set of parameters:

- `templates` list of strings or `Template` objects to specify [template files](/docs/project-file/advanced/#template-files)

## Dependency

Dependency definitions allow a project to refer to another project. Doing so, libraries found in dependencies can be built, cached and used in the project.

Any repository can be a dependency. If the dependency is using Golem, it can be used seemlessly. If the dependency is not using Golem, it needs a recipe to work.

The recipe may exist in the [default recipe repository](/docs/advanced/recipes/#default-recipes). But a [custom recipe source](/docs/advanced/recipes/#custom-recipes) can also be set independently.

Here is how to define a dependency:

``` python
task = project.dependency(name='json',
                          repository='https://github.com/nlohmann/json.git',
                          version='^3.0.0',
                          version_regex=None
                          shallow=True,
                          <any other configuration parameter>)
```

Similarly to `program` and `library`...

`dependency()` requires a `name`, and accepts any [configuration parameters](/docs/project-file/configurations).

It returns a `task` definition holding all the important parameters to build the library.

This `task` can make use of the [condition mechanism](/docs/project-file/conditions) `when()` to define conditionnally certain parameters.

But...

Dependency definitions also require a `repository` and a `version`.

The `repository` can be a Git URL or a local directory path. Local directory paths are normalized internally to `file://...` URLs.

Optionally, `shallow` controls how the repository is cloned:
- `True` orders to perform a shallow clone of the repository
- `False` (default) orders to perform a regular clone of the repository

This makes `shallow` a nice optimization parameter when the repository is heavy to clone. But at the moment, some limitations in Golem makes it impossible to enable this parameter for dependencies referring to Golem projects. It's a known issue requiring some work.

Also, note that defining configuration parameters on a dependency definition will propagate these parameters to the targets referred to by the `name`, or the `targets` parameter if set. This allows the project to [customize the dependencies](/docs/project-file/advanced/#customization-of-dependencies).

### Version formats

Regarding the `version`, multiple formats are accepted:
- Commit hash
- Branch name (e.g. `main`, `master`, `develop`)
- Tag (e.g. `v1.0.0`)
- Node SemVer to search a version tag. (e.g. `^3.0.0`)

The **Node SemVer** format allows to define a search range of versions. This mechanism is inpired by what [NodeJS does](https://semver.npmjs.com/).

Golem retrieves all the tags on the dependency, find those having a version looking format, and matches the latest version found matching the search range.

To search for tags having a version looking format, Golem uses its own permissive [SemVer](https://semver.org/) regex. (e.g. `v1.0.0` -> `1.0.0`, `boost-1.90.0` -> `1.90.0`)

To handle an edge case regarding OpenSSL releases, the tags are sorted so that, while `1.1.1` matches both `OpenSSL_1_1_1j` and `OpenSSL_1_1_1k`, only the latest is picked.

To further help into finding version tags, `version_regex` accepts a regex string to only keep the matching tags before processing them as versions.

### Using a dependency

A target (e.g. program or library) needing to link against a library in another project has to refer to a corresponding dependency by using the `deps` parameter. An export definition can also refer to it similarly.

Here is an example:

``` python
project.dependency(name='json',
                   repository='https://github.com/nlohmann/json.git',
                   version='^3.0.0',
                   shallow=True)

project.program(name='hello',
                source=['hello/src'],
                deps=['json'])
```

In this example, the program `'hello'` refers to a dependency by setting `deps=['json']`. The program will be linked against a library defined in the project file or recipe corresponding to the dependency.

### Commands

Using dependencies requires to run additional commands when building the project:

``` bash
golem configure

# Here are the additional commands needed to retrieve
#and build dependencies defined in the project file...
golem resolve
golem dependencies
# ...but they are not needed if the project has no
# dependency definition.

golem build
```

To understand the role of theses commands, have a closer look at [`golem resolve`](/docs/commands/golem-resolve) and [`golem dependencies`](/docs/commands/golem-dependencies/).

### Examples

To learn more about dependencies with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/minimal>
- <https://github.com/GolemCpp/golem/tree/main/examples/dependencies>
- <https://github.com/GolemCpp/golem/tree/main/examples/cache>
- <https://github.com/GolemCpp/golem/tree/main/examples/advanced>

## Package

A package definition allows to package targets with all the needed dependencies into various formats:
- **MSI** files for Windows with WiX
- **DMG** files for MacOS
- **DEB** files for Debian-based distributions

Other formats are to come.

Here is how to define a package:

``` python
package = project.package(name='hello-package',
                          targets=[
                              'hello-package'
                          ],
                          stripping=True)

package.deb(...)
package.msi(...)
package.dmg(...)

package.hook(...)
```

`name` is used to build the filename of the package, [among other things](#package-filename-and-version).

`targets` is a list of all the targets to be included in the package. All the needed dependencies are automatically included.

`stripping`, when `True`, asks for discarding symbols and other data from the binary artifacts. By default it's set on `True` if in `release` variant, and `False` otherwise.

### Package filename and version

The filename is constructed using the **name** of the package, the **version** found in the project, and the **architecture**, following the format: `<name>_<version>_<architecture>.<package_extension>`.

E.g. `hello-package_0.0.0_amd64.deb`.

The version is retrieved by searching the latest Git tag set on the project. But if the project's directory isn't a Git repository the version is set to the default `0.0.0`.

### DEB package

Here is how to define a Debian package:

``` python
package.deb(prefix='/usr/local',
            subdirectory='share/example/hello-package',
            skeleton='dist/deb/skeleton',
            control='dist/deb/DEBIAN',

            # control parameters
            section='misc',
            priority='optional',
            maintainer='John Doe',
            description='Example program to illustrate how to package applications with Golem',
            homepage='https://www.example.com/',
            depends=['libssl'],

            rpath=None,
            templates=['share/applications/hello-package.desktop'],
            copy_skeleton=None)
```

Requires `fakeroot`, `patchelf` and `strip`.

- `prefix` string to control where the package gets installed (default `'/usr/local'`)
- `subdirectory` string to control where package gets installed in the prefix directory
- `skeleton` string to specify the directory containing the static assets
- `control` string to specify the directory containing the control files
- `rpath` string to set RPATH on binaries (default is an RPATH combining all the paths needed by the libraries)
- `templates` list of paths to specify files in the skeleton directory that require templating
- `copy_skeleton` list of path pairs (source, destination) to copy other assets from the project directory to locations in the prefix directory

**control** parameters refer to parameters expected in the main [control](https://www.debian.org/doc/debian-policy/ch-controlfields.html#debian-source-package-template-control-files-debian-control) file. Although some parameters are automatically generated for this file, such as the version, the architecture, and the package name. Also, `depends` adds packages to the existing list found in `package` parameters on the different definitions referred by the package targets.


### MSI package

Here is how to define a MSI installer:

``` python
package.msi(skeleton=None,
            project="dist/msi/wix",
            extensions=['WixUIExtension'],
            parameters=None,
            cultures=['en-us'],
            installdir_id='INSTALLDIR',
            installdir_files_id='INSTALLDIR_files')
```

Requires [WiX 3](https://docs.firegiant.com/wix/wix3/) programs in the PATH (`candle`, `heat`, `light`).

- `skeleton` string to specify the directory containing the static assets
- `project` string to specify the directory containing the WiX project
- `parameters` list of strings to pass arguments to the `candle` command
- `extensions` list of strings to enable WiX extensions
- `cultures` list of strings to specify the supported languages (e.g. `'en-us'`)
- `installdir_id` string to specify the directory reference to root directories (cannot contains spaces e.g. -dr MyAppDirRef).
- `installdir_files_id` string to specify the component group name (cannot contain spaces e.g -cg MyComponentGroup).

### DMG package

Here is how to define a DMG image:

``` python
package.dmg(name='hello-package',
            skeleton='dist/dmg/skeleton',
            background='dist/dmg/background.png')
```

- `name` string to specify an alternative name for the package file
- `skeleton` string to the directory containing the static assets
- `background` string to specify the background image

### Qt support

Qt provides the needed tools to package a Qt application on **Windows** and **macOS** (e.g. `windeployqt`, `macdeployqt`).

But Qt doesn't provide such a tool on **Linux**. Instead, Golem relies on the existence of [`linuxdeployqt`](https://github.com/probonopd/linuxdeployqt) in the PATH, an independent project.

> [!NOTE]+
> **linuxdeployqt** only accepts to run on systems with an old enough glibc version. But removing this requirement only requires to comment the check in the program's main.cpp.

### Package hook

A hooking mechanism is available to access the prepared artifacts. This allows to perform custom actions on the files before they get packaged.

Here is how to define a hook:

``` python
package.hook(custom_action)

def custom_action(context):
    for f in context.files:
        print("{}".format(f.path))
```

`hook()` takes 1 function pointer, but can be called multiple times to add more function pointers.

The function pointers have to provide 1 argument for a **Context** object providing the following data:

- `name` string to name the package

- `binaries` list of built binaries

- `libpaths` list of paths to the libraries

- `targets` list of targets

- `files` list of `File` objects describing all the files being packaged (including assets, etc.)

- `version` version of the project

- `major` version major number

- `minor` version minor number

- `patch` version patch number

- `build_number` build number (integer defined by the `BUILD_NUMBER` environment variable when the mechanism is enabled on the project)

- `hash` version commit hash

- `system` `System` object

- `message` version commit message

- `package` `File` object describing the output package file

Here is what a `File` object contains:

- `path` os.path containing the relative path to the file

- `absolute_path` os.path containing the absolute path to the file

- `type` string containing the type of the file among: `package`, `library`, `program`, `file`

Here is what a `System` object contains:

- `name` string to name the platform (e.g. `'windows'`, `'osx'`, `'linux'`)

- `distribution` string to name the Linux distribution if any, or `None` (e.g. `'debian'`)

- `release` string to name the Linux distribution release if any, or `None` (e.g. `'trixie'`)

- `version` string to identify the version of the platform

  On Windows and macOS, returns `platform.platform()`.

  On Linux, returns `platform.platform() + '-' + '-'.join(platform.libc_ver())`.

- `architecture` string containing the package architecture (e.g. `'amd64'`)

### Examples

To learn more about packages with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/package>
