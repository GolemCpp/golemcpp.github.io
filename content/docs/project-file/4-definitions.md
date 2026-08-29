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

```python
task = project.program(
    name="hello",
    source=["src"
) # ...and any other configuration parameter
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

```python
task = project.library(
    name="mylib",
    source=["src"]
) # ...and any other configuration parameter
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

```python
task = project.export(
    name="mylib",
    includes=["mylib/include"]
) # ...and any other configuration parameter
```

Similarly to `program` and `library`...

`export()` requires a `name`, and accepts any [configuration parameters](/docs/project-file/configurations).

It returns a `task` definition holding all the important parameters to build the library.

This `task` can make use of the [condition mechanism](/docs/project-file/conditions) `when()` to define conditionnally certain parameters.

But...

An export has to have a name matching the library it is exporting.

### Using a library

A target (e.g. program or library) needing to link against a library has to refer to the corresponding export by using the `use` parameter. And another export definition can also refer to it similarly, if needed.

```python
project.library(
    name="mylib",
    includes=["mylib/include"],
    source=["mylib/src"]
)

task = project.export(
    name="mylib",
    includes=["mylib/include"]
)

project.program(
    name="hello",
    source=["hello/src"],
    use=["mylib"]
)
```

In this example, the program `'hello'` is built with an additional include directory `'mylib/include'` pulled from the export definition it refers by `use=['mylib']`

### Header-only libraries

Since a library definition is meant to be built, if the library is intended to be header-only, the library definition can be skipped, and remains an export definition with `header_only=True`.

```python
project.export(
    name="foo",
    includes=["foo/include"],
    header_only=True
)

project.program(
    name="hello",
    source=["hello/src"],
    use=["foo"]
)
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

The recipe may exist in the [default cookbook](/docs/advanced/recipes/#the-default-cookbook). But a [custom cookbook](/docs/advanced/recipes/#custom-cookbooks) can also be set independently.

Here is how to define a dependency:

```python
task = project.dependency(
    name="json",
    repository="https://github.com/nlohmann/json.git",
    version="^3.0.0",
    version_regex=None,
    shallow=True,
)
# ...and any other configuration parameter
```

Similarly to `program` and `library`...

`dependency()` requires a `name`, and accepts any [configuration parameters](/docs/project-file/configurations).

It returns a `task` definition holding all the important parameters to build the library.

This `task` can make use of the [condition mechanism](/docs/project-file/conditions) `when()` to define conditionnally certain parameters.

But...

Dependency definitions also require a source, and a `version` when that source is a repository.

A dependency comes from **one of three** mutually exclusive sources:

- `repository='<git-url>'` — a Git repository, **cloned** into the cache at the resolved `version`.
- `directory='<path>'` — a local directory, **copied** into the cache as-is on each `golem resolve`.
- `location='...'` — one field for either of the two above, and the only one that may name the source by identity instead of where it is. It takes two shapes:
  - `'[<kind>+]<locator>[#<version>]'` — where the source is, spelling its kind or leaving Golem to work it out. The [source location](/docs/reference/source-locations/) syntax the `cookbooks.locations` and `overlays.locations` settings take.
  - `'<identity>[#<version>]'` — which source it is, leaving the cookbooks to supply the locator. A [source identity](/docs/reference/source-identities/), which only a dependency may name. See [Location by identity](#location-by-identity).

  A `location` may name the version after a `#`, which is the same thing as the `version` argument and cannot be combined with it. A dependency asking for two versions is an error rather than a silent choice between them. Naming none leaves `version` as it stands.

```python
# A dependency cloned from Git
project.dependency(
    name="json", repository="https://github.com/nlohmann/json.git", version="^3.0.0"
)

# A dependency living next to the project
project.dependency(name="mylib", directory="./mylib")

# The same two, named through `location`
project.dependency(
    name="json", location="git+https://github.com/nlohmann/json.git", version="^3.0.0"
)

project.dependency(name="mylib", location="directory+./mylib")

# Kind left to Golem: a local directory Git cannot clone from is copied
project.dependency(name="mylib", location="./mylib")
```

A `directory` has no version to resolve, so `version`, `version_regex` and `shallow` do not apply to it. Paths are relative to the project file and are normalized internally to `file://...` URLs.

> [!NOTE]+ `repository` and `directory` state the kind by the field they are, so they never rely on detection and carry no `#version`: the whole value is the locator. `repository` must name something Git can clone from, a local path included, and is **refused** when it does not.
>
> Use `location` when you want one field for both, or to name the version alongside it. Add the prefix `directory+` or `git+` to control whether the resource must be copied or cloned.

### Location by identity

`location='@boost'` names the source and not where it is. Golem searches the cookbooks for a [recipe](/docs/advanced/recipes/#source-locators) named `@boost`, and clones the locator that recipe declares.

```python
project.dependency(name="boost", location="@boost", version="^1.87.0")
```

The version works as it does in any other location, so `location='@boost#^1.87.0'` matches `^1.87.0` against the tags the repository the recipe named publishes.

Golem composes the identity from that locator, never from the name you wrote. So `location='@boost'` and `repository='https://github.com/boostorg/boost.git'` land in one cache entry, `@boost@boostorg@github.com#<commit>`.

A recipe named `@boost` allows to build boost, wherever it was cloned from. But a location asks a different question. It asks for a location the recipe may know. If it doesn't, the identity is refused. E.g. `@boost@somefork@github.com` finds the `@boost` recipe, whose `locator` and `mirrors` are all boostorg's, so it is **refused**. Write `repository=` with a URL for the fork, and the same recipe still builds it.

Optionally, `shallow` controls how much of the repository is obtained:

- `True` fetches the resolved commit and nothing around it
- `False` (default) leaves the dependency to the configured [fetch mode](/docs/reference/environment-variables/#git)

Golem fetches every resource `blobless` by default. That is every commit and every tag, file content on demand. So the bulk of what a full clone used to cost is already saved without asking for anything. What `shallow` cuts on top of that is the history itself.

`shallow` is the smallest of the three modes on disk. On Boost at `boost-1.89.0`, whose superproject carries 170 submodules, a `shallow` cache root comes to well under half what a full clone takes, and under a third of it counting only the repository data.

What `shallow` costs is the history itself, and that is not free. A root holding one commit gives `git describe --long --tags` nothing to work from, because the commit arrives without its tag. So a dependency cannot derive its version from its history and has to be told it with `--force-version`. Golem projects allow to derive their version from their history, which makes it impossible to be the default mode.

`shallow` is also slower to _obtain_ on a repository with many submodules, since a depth-1 fetch is per repository: a superproject pays one round trip per submodule where a full clone pays one for everything. What it is not is slower to keep: a shallow root refreshes as quickly as any other, and stays the size it was.

The modes also differ in what they are able to find. Every other mode clones `refs/heads/*` and `refs/tags/*` with their whole history and then looks for the reference among what arrived, where `shallow` asks the remote for it **by name**. So a commit that no branch and no tag reaches is missing from a blobless or full root, and the fetch stops and names it, while a shallow fetch may still obtain it.

Do not build on that difference. A `version` has to name something the repository advertises. E.g. a tag, a branch, or a commit in their history. Anything else, such as a pull request's head or a commit force-pushed off its branch, is **not meant to be supported**: whether it can be obtained at all is the server's decision, and a commit no ref points at is one the remote's next garbage collection may remove.

Reach for `shallow` when a repository is heavy and its history is of no use to the build. Leave the default alone otherwise: `blobless` already saves most of what a full clone costs and keeps `describe` working.

Also, note that defining configuration parameters on a dependency definition will propagate these parameters to the targets referred to by the `name`, or the `targets` parameter if set. This allows the project to [customize the dependencies](/docs/project-file/advanced/#customization-of-dependencies).

### Version formats

Regarding the `version`, multiple formats are accepted:

- Commit hash
- Branch name (e.g. `main`, `master`, `develop`)
- Tag (e.g. `v1.0.0`)
- Node SemVer to search a version tag. (e.g. `^3.0.0`)
- Nothing at all, or `HEAD`, for the repository's default branch

The **Node SemVer** format allows to define a search range of versions. This mechanism is inpired by what [NodeJS does](https://semver.npmjs.com/).

Golem retrieves all the tags on the dependency, find those having a version looking format, and matches the latest version found matching the search range.

To search for tags having a version looking format, Golem uses its own permissive [SemVer](https://semver.org/) regex. (e.g. `v1.0.0` -> `1.0.0`, `boost-1.90.0` -> `1.90.0`)

To handle an edge case regarding OpenSSL releases, the tags are sorted so that, while `1.1.1` matches both `OpenSSL_1_1_1j` and `OpenSSL_1_1_1k`, only the latest is picked.

To further help into finding version tags, `version_regex` accepts a regex string to only keep the matching tags before processing them as versions.

A **commit hash** has to be one that some branch or tag reaches, anywhere in their history counts, which is every commit a clone brings. A hash outside that, such as a pull request's head or a commit force-pushed off its branch, is not supported.

### Using a dependency

A target (e.g. program or library) needing to link against a library in another project has to refer to a corresponding dependency by using the `deps` parameter. An export definition can also refer to it similarly.

Here is an example:

```python
project.dependency(
    name="json",
    repository="https://github.com/nlohmann/json.git",
    version="^3.0.0",
    shallow=True,
)

project.program(
    name="hello",
    source=["hello/src"],
    deps=["json"]
)
```

In this example, the program `'hello'` refers to a dependency by setting `deps=['json']`. The program will be linked against a library defined in the project file or recipe corresponding to the dependency.

### Commands

Using dependencies requires to run additional commands when building the project:

```bash
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

```python
package = project.package(
    name="hello-package", targets=["hello-package"], stripping=True
)

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

```python
package.deb(
    prefix="/usr/local",
    subdirectory="share/example/hello-package",
    skeleton="dist/deb/skeleton",
    control="dist/deb/DEBIAN",
    # control parameters
    section="misc",
    priority="optional",
    maintainer="John Doe",
    description="Example program to illustrate how to package applications with Golem",
    homepage="https://www.example.com/",
    depends=["libssl"],
    rpath=None,
    templates=["share/applications/hello-package.desktop"],
    copy_skeleton=None,
)
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

```python
package.msi(
    skeleton=None,
    project="dist/msi/wix",
    extensions=["WixUIExtension"],
    parameters=None,
    cultures=["en-us"],
    installdir_id="INSTALLDIR",
    installdir_files_id="INSTALLDIR_files",
)
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

```python
package.dmg(
    name="hello-package",
    skeleton="dist/dmg/skeleton",
    background="dist/dmg/background.png",
)
```

- `name` string to specify an alternative name for the package file
- `skeleton` string to the directory containing the static assets
- `background` string to specify the background image

### Qt support

Qt provides the needed tools to package a Qt application on **Windows** and **macOS** (e.g. `windeployqt`, `macdeployqt`).

But Qt doesn't provide such a tool on **Linux**. Instead, Golem relies on the existence of [`linuxdeployqt`](https://github.com/probonopd/linuxdeployqt) in the PATH, an independent project.

> [!NOTE]+ **linuxdeployqt** only accepts to run on systems with an old enough glibc version. But removing this requirement only requires to comment the check in the program's main.cpp.

### Package hook

A hooking mechanism is available to access the prepared artifacts. This allows to perform custom actions on the files before they get packaged.

Here is how to define a hook:

```python
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
