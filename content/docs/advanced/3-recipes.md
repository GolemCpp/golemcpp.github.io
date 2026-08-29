---
title: "Recipes"
description: ""
summary: ""
date: 2026-01-18T10:44:16+01:00
draft: false
weight: 803
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Golem aware dependencies, those having Golem project file defined at their root, can seemlessly refer to each other. But, when refering to a dependency unaware of Golem, Golem provides a recipe mechanism.

A collection of recipes is a **cookbook**.

## The default cookbook

**Contributions to the default cookbook are very welcome!**

By default, Golem provides a [cookbook](https://github.com/GolemCpp/recipes) to find a corresponding project file for these dependencies unaware of Golem.

That cookbook keeps one branch per [source identity](/docs/reference/source-identities/) grammar, and Golem reads the branch it spells: `#v2` for this version.

A dependency is identified by its repository URL. A cookbook holds one directory per dependency, named after that [source identity](/docs/reference/source-identities/), and each directory holds a project file.

```text
.
├── @boost@boostorg@github.com/
│   ├── golemfile.py
│   └── recipe.json        manifest file (default source, mirrors, etc.)
├── @json@nlohmann@github.com/
│   └── golemfile.py
├── @spdlog@gabime@github.com/
│   └── golemfile.py
├── README.md
└── <etc>
    └── golemfile.py
```

For a repository on a forge the identity reads `@<repository>@<owner>@<host>`, lowercased:

| repository                                   | recipe directory                  |
| -------------------------------------------- | --------------------------------- |
| `https://github.com/nlohmann/json.git`       | `@json@nlohmann@github.com`       |
| `https://github.com/microsoft/GSL.git`       | `@gsl@microsoft@github.com`       |
| `https://gitlab.com/group/subgroup/proj.git` | `@proj@group.subgroup@gitlab.com` |

The leading `@` distinguishes a recipe from everything else the repository holds, so a cookbook is free to carry a `README`, a licence or a CI configuration.

Other shapes (e.g. an SSH clone, a path on your machine, a name Golem had to spell differently to make it a legal directory) read differently, and you do not have to work them out. Golem drops the last field of the identity and looks again, down to the bare name, so a recipe named at a shorter qualification still serves it:

| the dependency is cloned from      | the identity                        | the recipe that serves           |
| ---------------------------------- | ----------------------------------- | -------------------------------- |
| `https://github.com/nlohmann/json` | `@json@nlohmann@github.com`         | `@json@nlohmann@github.com`      |
| `git@github.com:nlohmann/json.git` | `@json@nlohmann@github.com@scp.git` | `@json@nlohmann@github.com`      |
| `https://git.corp/team/json.git`   | `@json@team@git.corp`               | `@json`, if a cookbook holds one |

So a recipe is named at the qualification that makes it unambiguous, and no further: `@boost` for a package everyone means the same thing by, `@json@nlohmann` where the name alone is not enough, the host only where the owner would still be. The shorter the name, the more remotes one recipe serves (e.g. a fork, an internal mirror, an SSH clone) and the longer it is, the more narrowly it serves.

**Every lookup reports which recipe served it**, so a recipe serving at a shorter qualification is something you read rather than something you notice:

```text
@json@team@git.corp: served by @json (@recipes@golemcpp@github.com#v2=fb04dcb6)
```

**When nothing serves it, Golem names the identity it looked for** and every cookbook it searched:

```text
ERROR: no recipe '@json@nlohmann@github.com'.
Searched 1 cookbook(s):
  /home/you/.cache/golem/…/source
```

Name the directory what that message names, and the next run finds it. The full grammar is in [Source identities](/docs/reference/source-identities/).

A directory named right but holding no project file is an error rather than a miss, because Golem found what you named and cannot load it:

```text
ERROR: recipe '@json' in cookbook '@recipes@golemcpp@github.com#v2=fb04dcb6'
holds no project file ('golemfile.py' or 'golemfile.json'):
  /home/you/.cache/golem/…/source/@json
```

> [!NOTE]+ A recipe may also declare where its source comes from, in a `recipe.json`. A dependency can then be written as `location='@json'` rather than as the URL, and Golem clones what the recipe declares. See [Source locators](#source-locators).

> [!NOTE]+ For now, there is no project file per version mechanism, but this is in the Roadmap.

A `golemfile.py` can use scripting to handle any build system, any situation.

## Custom cookbooks

To replace the default Golem cookbook, or search several cookbooks, set:

```text
GOLEM_COOKBOOKS_LOCATIONS=<location_1>|<location_2>|...
```

- `<location>` A [source location](/docs/reference/source-locations/), `[<kind>+]<locator>[#<version>]`: `git+` for a repository cloned into the cache, `directory+` for a local directory copied into it. Without a prefix Golem works the kind out from the locator.
- `|` Separator between cookbooks

Cookbooks are layered in the order they are listed, and the **last** one holding a recipe for the dependency wins, the same way [overlays](/docs/advanced/dependencies/#overlays) layer. So list your own cookbook after the default to override a recipe it ships, rather than before it. A recipe of yours replaces the one it shadows outright, unless it declares an [`overrides`](#inheriting-a-recipe) and inherits the rest.

A cookbook is asked for every qualification before the next one is asked at all, so a later cookbook wins even when it names the recipe less specifically. A `@json` of yours listed last shadows the default cookbook's `@json@nlohmann@github.com`, which is what makes an override work without restating the full identity, and why an override you meant to be narrow should be named at the qualification you want it to catch.

The same is available as the repeatable `--cookbook-location` option and as the `cookbooks.locations` setting — see [golem config](/docs/commands/golem-config/).

Example:

```bash
GOLEM_COOKBOOKS_LOCATIONS=git+https://github.com/GolemCpp/recipes.git#v2|directory+/home/user/recipes
golem configure --cookbook-location=./my-cookbook
```

Here `/home/user/recipes` is listed last, so a recipe it holds is the one used, and every dependency it holds no recipe for falls back to the default cookbook.

> [!NOTE]+ When a dependency is missing, or not building properly, it is recommended to fork the Golem [cookbook](https://github.com/GolemCpp/recipes), make the needed changes and create a Pull Request. Contributions are very welcome!

## Writing a recipe

### Source locators

A recipe directory may hold a `recipe.json` beside its `golemfile.py`, declaring where the source it builds comes from:

```json
{
  "version": 1,
  "locator": "https://github.com/boostorg/boost.git",
  "mirrors": ["https://gitlab.com/boostorg/boost.git"]
}
```

`locator` is the default source, so write the official remote there. It has to agree with the recipe's name: `https://github.com/boostorg/boost.git` composes `@boost@boostorg@github.com`, so the recipe may be called `@boost`, `@boost@boostorg` or `@boost@boostorg@github.com`.

A recipe declaring a `locator` can be named as a dependency's [location](/docs/project-file/definitions/#dependency). A consumer writes `location='@boost'`, and Golem clones what the recipe declares. A recipe without a `recipe.json` is still found by name and still builds the dependency; it just cannot be named that way.

`mirrors` are the other locators the same source is reachable at. None of them is a default. Declaring mirrors allows a dependency to refer to the source by an identity the locator does not match: `@boost@boostorg@gitlab.com` states `gitlab.com` where the locator states `github.com`, so Golem clones the mirror.

**The locator serves every identity it does not contradict. A mirror serves the identity naming it exactly.**

| The consumer writes          | Golem clones                            |
| ---------------------------- | --------------------------------------- |
| `@boost`                     | `https://github.com/boostorg/boost.git` |
| `@boost@boostorg`            | `https://github.com/boostorg/boost.git` |
| `@boost@boostorg@gitlab.com` | `https://gitlab.com/boostorg/boost.git` |
| `@boost@myfork@gitlab.com`   | `REFUSED`                               |

`@boost` and `@boost@boostorg` name no host, so they contradict neither remote and the locator serves both. A recipe declaring only mirrors has no locator to serve them, therefore its short name cannot be used as a location at all.

A `locator` may be a path relative to the recipe directory.

### Inheriting a recipe

> Reminder: Declared cookbooks are ordered. When looking up a recipe, a later cookbook wins.

A recipe in a cookbook can **shadow** another recipe of the same name in a second cookbook declared earlier in the list. Therefore, it **replaces** everything the second one was declaring. `overrides` allows to make it a delta over the conflicting recipe instead.

```json
{
  "version": 1,
  "locator": "https://git.corp/mirror/boost.git",
  "overrides": "@boost"
}
```

That recipe changes the default locator boost is cloned from and inherits everything else from the `@boost` it overrides. E.g. the `golemfile.py`. Nothing is restated, so it keeps working as the recipe below it changes.

**Everything comes from the most derived recipe declaring it**, and the fields are independent of each other. The `locator`, the `mirrors` and the project file are each taken from the first recipe in the chain naming one. So a delta declaring only `mirrors` adds them and leaves the locator to the recipe below, and a delta declaring only a `locator` keeps the mirrors below it.

Golem reports the whole chain, most derived first:

```text
@boost: served by @boost (my-cookbook) -> @boost (@recipes@golemcpp@github.com#v2=fb04dcb6)
```

**`overrides` names an identity, and it is searched from the overriding recipe's own cookbook downward**. It is never searched in a cookbook listed after it, only cookbooks declared earlier in the list. So what a base cookbook's recipe means never changes with what is layered on top of it.

A recipe passes over itself, which is what lets `@boost` override `@boost`: it finds the `@boost` of the cookbook below rather than itself. But that does not end the search in its own cookbook, e.g. `@json@nlohmann@github.com` overriding its own name finds a `@json` sitting beside it. So one cookbook can hold a general recipe and a delta on it.

Two mistakes are refused rather than worked around. An `overrides` no cookbook at or below it holds:

```text
ERROR: recipe '@boost' in cookbook 'my-cookbook' overrides '@bosot', and no
cookbook at or below it holds one.
```

And a cycle, where a chain reaches a recipe it already used:

```text
ERROR: cycle in cookbook 'my-cookbook': @a@b@c -> @a@b -> @a@b@c
```

### Header-only libraries

The simplest example of a recipe would be a header-only library:

```python
def configure(project):

    project.export(
        name="json",
        includes=["single_include"],
        header_only=True,
        licenses=["LICENSE.MIT"],
    )
```

Here we specify what headers to export and give a target name.

Also, it is recommended to specify the license if any is available in the project.

### Source-only projects

Sometimes, no build system is used in the project.

The project consists of sources files to be copied in your own project.

In this situation, the recipe can be defined like a regular Golem project file to build the sources into a library, etc.

Have a look at how to define a [project file](/docs/project-file/introduction/).

### Projects with a build system

Most of the time, projects use a specific build system to build libraries and possibly other artifacts.

Golem provides a `scripts` parameter when defining a library to freely specify how to build it.

```python
def configure(project):
    project.library(name="mylibrary", scripts=[script])

    project.export(name="mylibrary", includes=["include"])


def script(context):
    # build script
    ...
```

The script builds the library, and the library definition (`project.library(...)`) expects to find artifacts with a specific naming.

**To build the library** Golem provides helpers functions to build [CMake projects](#cmake-projects) and [call Git](#calling-git). But any Python tools can be used.

**To find the artifacts**, the good practice is not to rename them into what Golem wants, but [define how Golem should expect them](#target-decorators-and-artifact-generators).

### CMake projects

CMake being a de facto standard, Golem provides a helper function to build a CMake project, available from the `context` object:

```python
class Context:
    def cmake_build(
        self,
        source_path=None,
        build_path=None,
        targets=None,
        variant=None,
        link=None,
        arch=None,
        options=None,
        install_prefix=None,
        prefix_path=None,
        env=None,
    ): ...
```

`cmake_build()` runs CMake commands to configure and build the project.

When left unset, parameters are all deduced from the current state of the build.

Note that if the library has dependencies, it is still needed to explicitly build them before calling this function. Here helper functions are [provided](#building-and-using-dependencies). And once the build is done, it is still needed to explicitly export the binaries and headers. Here again, helper functions are [provided](#exporting-artifacts-and-headers).

Here is an example using CMake related helper functions in a script method to be added to the related library definition:

```python
def script(context):
    context.build_dependency("json")

    json = context.find_dependency("json")
    if not json:
        raise Exception("Error: Can't find json dependency")

    source_path = context.get_project_dir()

    cmake_env = {"NLOHMANN_JSON_VERSION": json.resolved.reference}

    cmake_options = []

    if context.is_windows():
        cmake_options.append("-DCMAKE_CXX_FLAGS=/std:c++17")

    context.cmake_build(
        source_path=source_path,
        targets=["nlohmann_json_schema_validator"],
        options=cmake_options,
        env=cmake_env,
    )

    context.export_binaries(recursively=True)

    context.export_file_to_headers(
        file_path=os.path.join(source_path, "src", "nlohmann", "json-schema.hpp"),
        include_path=os.path.join("include", "json-schema-validator"),
    )
```

### Other build systems

When dealing with projects using a build system different from CMake, you may want to use:

- `subprocess.call()` to run commands
- Helper functions to [build and use dependencies](#building-and-using-dependencies)
- Helper functions to [export built artifacts and headers](#exporting-artifacts-and-headers)
- Helper functions to [call Git safely](#calling-git)

In any case, it is recommendend to have a look at the [recipes](https://github.com/GolemCpp/recipes) already available to write your own.

### What the build targets

Another build system has to be told what to build for, and each one spells an architecture its own way. Golem provides one function per spelling, available from the `context` object:

```python
class Context:
    def get_arch(self): ...
    def vs_platform(self, arch=None): ...
    def get_arch_for_linux(self, arch=None): ...
```

`get_arch()` returns the [canonical name](/docs/reference/architectures/) of the target, e.g. `'x86_64'`. Use it where the build system takes the same names Golem does, and to branch a recipe on what is being built.

`vs_platform()` returns Visual Studio's name for the target, which is what MSBuild's `/p:Platform` and CMake's `-A` expect, e.g. `'x64'` and `'Win32'`. It raises where Visual Studio has no name for the target, so call it under `is_windows()`.

`get_arch_for_linux()` returns Debian's name for the target, e.g. `'amd64'`, or `None` where there is none.

Passing an architecture explicitly is what the `arch` parameter is for, on `vs_platform()` and on [`cmake_build()`](#cmake-projects) alike. Left unset, both use the target of the current build.

```python
def script(context):
    source_path = context.get_project_dir()
    build_path = context.get_build_path()

    opt_arch = ["-A", context.vs_platform()] if context.is_windows() else []

    subprocess.call(["cmake", source_path] + opt_arch, cwd=build_path)
```

`cmake_build()` passes `-A` on its own, so a recipe calling it needs none of this.

### Building and using dependencies

To build dependencies needed to build the library helper functions are provided, available from the `context` object:

```python
class Context:
    def build_dependency(self, dep_name): ...
    def find_dependency(self, dep_name): ...
```

`build_dependency()` builds the dependency corresponding to `dep_name` and returns a configuration object.

`find_dependency()` finds the resolved dependency definition corresponding to `dep_name` (contains the resolved version, etc.).

### Exporting artifacts and headers

Once the target is built, to export the artifacts and headers helper functions are provided, available from the `context` object:

```python
class Context:
    def export_binaries(self, build_path=None, recursively=False): ...
    def export_headers(self, source_path, include_path=None): ...
    def export_file_to_headers(self, file_path, include_path=None): ...

    def make_out_path(self): ...
    def prepare_include_export(self, include_path=None): ...
    def get_project_dir(self): ...
```

`export_binaries()` copies the artifacts from `build_path` to the output path where the artifacts are expected be found.

`export_headers()` copies the headers from `source_path` (expected to be a directory) to where the headers are expected be found.

`export_file_to_headers()` copies 1 header file artifacts (`file_path`) to where the headers are expected be found.

For manual operations, other functions can be useful to get the paths to where the artifacts and headers are expected.

`make_out_path()` creates and returns the path where the artifacts are expected to be found.

`prepare_include_export()` creates and returns the path where the headers are expected to be found.

`get_project_dir()` creates and returns the path to the cached dependency, containing the repository, the build directory, etc.

### Target decorators and Artifact generators

To accurately specify how Golem should expect the artifacts built by another build system, Golem provides 2 important parameters:

- `target_decorators` to adapt the base name of the artifacts.

  Expects a list of `def func(target_name, config, context):`

  `target_name` corresponds to the name, or if specified a target, found on the libary's definition. It can be modified, or ignored and replaced by anything else.

  `config` corresponds to all the settings used to build the target.

  `context` corresponds to the main object holding the context for the current build.

  The decorated target name returned by this function is meant to be common to the artifacts later generated.

  The default target decorator, if none is specified, will add '-debug' to debug variant artifacts. A target decorator needs to be specified to circumvent this behavior.

  Example: For a library with target_name = 'mylibrary' and expected artifacts ['mylib.1.0.0.so', 'mylib.so'], the target decorator has to return 'mylib'.

- `artifacts_generators` to generate all the different artifacts.

  Expects a list of `def func(decorated_target, config, context):`

  `decorated_target` corresponds to result of the target decorator.

  `config` corresponds to all the settings used to build the target.

  `context` corresponds to the main object holding the context for the current build.

  Building a library can indeed generate multiple files.

  The decorated target is provided as first parameter.

  Example: For a library with decorated_target = 'mylib' and expected artifacts ['mylib.lib', 'mylib.dll'], the artifact generator adds the expected extensions to decorated_target as a list of filenames.

Both provide `context` which provides a lot of helper functions, among them:

- `context.artifact_prefix(config)` returns the expected prefix for a library artifact.

  E.g. 'lib' on Linux, such as 'libssl.so'

- `context.artifact_suffix(config)` returns the expected suffix for a library artifact.

  E.g. ['.so'] on Linux or ['.dylib'] on macOS or ['.dll', '.lib'] on Windows

Here is a more elaborate example:

```python
def target_decorator(target_name, config, context):
    # Avoid default behavior where -debug is added,
    # and leave it as target_name in all cases.
    return target_name


def artifacts_generator(decorated_target, config, context):
    artifacts = []
    for suffix in context.artifact_suffix(config):
        artifact = context.artifact_prefix(config) + decorated_target + suffix
        artifacts.append(artifact)
        if suffix == ".so":
            # Linux
            artifacts.append("{}.{}".format(artifact, context.version.minor))
            artifacts.append(
                "{}.{}.{}.{}".format(
                    artifact,
                    context.version.major,
                    context.version.minor,
                    context.version.patch,
                )
            )
        elif suffix == ".dylib":
            # macOS
            basename_prefix = context.artifact_prefix(config) + decorated_target
            artifacts.append(
                "{}.{}.dylib".format(basename_prefix, context.version.minor)
            )
            artifacts.append(
                "{}.{}.{}.{}.dylib".format(
                    basename_prefix,
                    context.version.major,
                    context.version.minor,
                    context.version.patch,
                )
            )
    return artifacts


project.library(
    name="json-schema-validator",
    targets=["nlohmann_json_schema_validator"],
    scripts=[script],
    deps=["json"],
    target_decorators=[target_decorator],
    artifacts_generators=[artifacts_generator],
)
```

### Calling Git

To safely call Git commands Golem provides three helper functions, differing in what they hand back and in what happens when the command fails:

```python
from golemcpp.golem import helpers

# Do it. Raises if it fails.
helpers.run_git(["reset", "--hard"], cwd=root_of_git_repository)

# Do it and give me what it said. Raises if it fails.
head = helpers.read_git(["rev-parse", "HEAD"], cwd=root_of_git_repository)

# Do it and tell me whether it worked. Never raises.
helpers.try_git(["clean", "-fxd"], cwd=root_of_git_repository)
```

Each one makes sure the working directory is a Git repository before continuing, and refuses a command that would reach a remote outside `golem resolve` or a build script (see [Only resolve reaches a remote](/docs/developers/introduction/#only-resolve-reaches-a-remote)).

Use `run_git` when a failure should stop the recipe, `read_git` when the output is the point, and `try_git` for something that is allowed to fail — a `clean` in a tree that may not need one.
