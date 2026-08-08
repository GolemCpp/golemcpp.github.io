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

Dependencies are uniquely identified by their repository URL. Their ID is constructed such as **https://github.com/nlohmann/json.git** becomes **json@com.github.nlohmann**.

A cookbook contains directories named after these dependency IDs, and each directory contains a project file.

This is how it looks like:

``` text
.
├── boost@com.github.boostorg/
│   └── golemfile.py
├── json@com.github.nlohmann/
│   └── golemfile.py
├── spdlog@com.github.gabime/
│   └── golemfile.py
└── <etc>
    └── golemfile.py
```

> [!NOTE]+
> For now, there is no project file per version mechanism, but this is in the Roadmap.

A `golemfile.py` can use scripting to handle any build system, any situation.

## Custom cookbooks

To replace the default Golem cookbook, or search several cookbooks, set:

``` text
GOLEM_COOKBOOKS_LOCATIONS=<location_1>|<location_2>|...
```

- `<location>` A [source location](/docs/reference/environment-variables/#source-locations),
  `[<kind>+]<locator>`: `git+` for a repository cloned into the cache, `directory+` for a local
  directory copied into it. Without a prefix Golem works the kind out from the locator.
- `|` Separator between cookbooks

Cookbooks are searched in the order they are listed, and the first one holding a recipe for the
dependency wins.

The same is available as the repeatable `--cookbook-location` option and as the
`cookbooks.locations` setting — see [golem config](/docs/commands/golem-config/).

Example:

``` bash
GOLEM_COOKBOOKS_LOCATIONS=directory+/home/user/recipes|git+https://github.com/GolemCpp/recipes.git
golem configure --cookbook-location=./my-cookbook
```

> [!NOTE]+
> When a dependency is missing, or not building properly, it is recommended to fork the Golem [cookbook](https://github.com/GolemCpp/recipes), make the needed changes and create a Pull Request. Contributions are very welcome!

## Writing a recipe

### Header-only libraries

The simplest example of a recipe would be a header-only library:

``` python
def configure(project):

    project.export(name='json',
                   includes=['single_include'],
                   header_only=True,
                   licenses=['LICENSE.MIT'])
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

``` python
def configure(project):
    project.library(name='mylibrary',
                    scripts=[script])

    project.export(name='mylibrary',
                   includes=['include'])

def script(context):
  # build script
```

The script builds the library, and the library definition (`project.library(...)`) expects to find artifacts with a specific naming.

**To build the library** Golem provides helpers functions to build [CMake projects](#cmake-projects) and [call Git](#calling-git). But any Python tools can be used.

**To find the artifacts**, the good practice is not to rename them into what Golem wants, but [define how Golem should expect them](#target-decorators-and-artifact-generators).

### CMake projects

CMake being a de facto standard, Golem provides a helper function to build a CMake project, available from the `context` object:

``` python
class Context:
  def cmake_build(self,
      source_path=None,
      build_path=None,
      targets=None,
      variant=None,
      link=None,
      arch=None,
      options=None,
      install_prefix=None,
      prefix_path=None,
      env=None):
```

`cmake_build()` runs CMake commands to configure and build the project.

When left unset, parameters are all deduced from the current state of the build.

Note that if the library has dependencies, it is still needed to explicitly build them before calling this function. Here helper functions are [provided](#building-and-using-dependencies). And once the build is done, it is still needed to explicitly export the binaries and headers. Here again, helper functions are [provided](#exporting-artifacts-and-headers).

Here is an example using CMake related helper functions in a script method to be added to the related library definition:

``` python
def script(context):
    context.build_dependency('json')

    json = context.find_dependency('json')
    if not json:
        raise Exception("Error: Can't find json dependency")

    source_path = context.get_project_dir()

    cmake_env = {
        'NLOHMANN_JSON_VERSION': json.resolved_version
    }

    cmake_options = []

    if context.is_windows():
        cmake_options.append('-DCMAKE_CXX_FLAGS=/std:c++17')

    context.cmake_build(source_path=source_path,
                    targets=['nlohmann_json_schema_validator'],
                    options=cmake_options,
                    env=cmake_env)

    context.export_binaries(recursively=True)

    context.export_file_to_headers(
        file_path=os.path.join(source_path, 'src', 'nlohmann', 'json-schema.hpp'),
        include_path=os.path.join('include', 'json-schema-validator'))
```

### Other build systems

When dealing with projects using a build system different from CMake, you may want to use:
- `subprocess.call()` to run commands
- Helper functions to [build and use dependencies](#building-and-using-dependencies)
- Helper functions to [export built artifacts and headers](#exporting-artifacts-and-headers)
- Helper functions to [call Git safely](#calling-git)

In any case, it is recommendend to have a look at the [recipes](https://github.com/GolemCpp/recipes) already available to write your own.

### Building and using dependencies

To build dependencies needed to build the library helper functions are provided, available from the `context` object:

``` python
class Context:
  def build_dependency(self, dep_name):
  def find_dependency(self, dep_name):
```

`build_dependency()` builds the dependency corresponding to `dep_name` and returns a configuration object.

`find_dependency()` finds the resolved dependency definition corresponding to `dep_name` (contains the resolved version, etc.).

### Exporting artifacts and headers

Once the target is built, to export the artifacts and headers helper functions are provided, available from the `context` object:

``` python
class Context:
  def export_binaries(self, build_path=None, recursively=False):
  def export_headers(self, source_path, include_path=None):
  def export_file_to_headers(self, file_path, include_path=None):

  def make_out_path(self):
  def prepare_include_export(self, include_path=None):
  def get_project_dir(self):
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

``` python
def target_decorator(target_name, config, context):
    # Avoid default behavior where -debug is added,
    # and leave it as target_name in all cases.
    return target_name

def artifacts_generator(decorated_target, config, context):
    artifacts = []
    for suffix in context.artifact_suffix(config):
        artifact = context.artifact_prefix(config) + decorated_target + suffix
        artifacts.append(artifact)
        if suffix == '.so':
            # Linux
            artifacts.append('{}.{}'.format(artifact,
                                            context.version.minor))
            artifacts.append('{}.{}.{}.{}'.format(artifact,
                                                  context.version.major,
                                                  context.version.minor,
                                                  context.version.patch))
        elif suffix == '.dylib':
            # macOS
            basename_prefix = context.artifact_prefix(config) + decorated_target
            artifacts.append('{}.{}.dylib'.format(basename_prefix, context.version.minor))
            artifacts.append('{}.{}.{}.{}.dylib'.format(
                basename_prefix, context.version.major,
                context.version.minor, context.version.patch))
    return artifacts

project.library(name='json-schema-validator',
                targets=['nlohmann_json_schema_validator'],
                scripts=[script],
                deps=['json'],
                target_decorators=[target_decorator],
                artifacts_generators=[artifacts_generator])
```

### Calling Git

To safely call Git commands Golem provides three helper functions, differing in what they hand back
and in what happens when the command fails:

``` python
from golemcpp.golem import helpers

# Do it. Raises if it fails.
helpers.run_git(['reset', '--hard'], cwd=root_of_git_repository)

# Do it and give me what it said. Raises if it fails.
head = helpers.read_git(['rev-parse', 'HEAD'], cwd=root_of_git_repository)

# Do it and tell me whether it worked. Never raises.
helpers.try_git(['clean', '-fxd'], cwd=root_of_git_repository)
```

Each one makes sure the working directory is a Git repository before continuing, and refuses a
command that would reach a remote outside `golem resolve` or a build script (see
[Only resolve reaches a remote](/docs/developers/introduction/#only-resolve-reaches-a-remote)).

Use `run_git` when a failure should stop the recipe, `read_git` when the output is the point, and
`try_git` for something that is allowed to fail — a `clean` in a tree that may not need one.
