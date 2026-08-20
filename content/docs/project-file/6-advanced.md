---
title: "Advanced"
description: ""
summary: ""
date: 2026-03-27T01:39:09+01:00
draft: false
weight: 206
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

## Template files

Target definitions such as [programs](/docs/project-file/definitions/#program), [libraries](/docs/project-file/definitions/#library) and [exports](/docs/project-file/definitions/#export) can define a list of `templates`. Templates can be:

- a string to specify the path to the template file (e.g. `'src/main.h.template'`)
- a template definition

Here how to define a template definition:

``` python
# Example 1 (in a target definition)
templates = [
  'src/version.h.template'
],
#...

# Import
from golemcpp.golem.template import Template

# Example 2 (in a target definition)
templates = [
  Template(source='src/version.h.template')
],
#...

# Example 3 (in a target definition)
templates = [
  Template(source='manifest-data.json.in'
           target='data/manifest.json',
           build=False)
],
#...
```

- `source` string to specify the path to the template file

- `target` string to specify the path to the output file relative to the output directory

  Default is `None`: Removes extensions `.template` or `.in` from the **source** if found, otherwise adds `.cpp` to the **source**.

- `build` boolean to specify if the output file needs to be added to the build

  Default is `None`:
  - If the output file has for extension `'.cpp'`, `'.cxx'`, `'.c'`, `'.cc'`:
    * Builds the output file
  - If the output file has for extension `'.hpp'`, `'.hxx'`, `'.h'`, `'.hh'`:
    * Adds the output directory to the includes

  If `False`, won't add the output file to the build, even if the extension matches the extensions mentioned above.

  If `True`:
  - If the output extension matches the extensions above, it follows the default logic.
  - If the output extension doesn't match the extensions above, builds the output file.

The template file is processed by replacing pre-defined keys found it the file under the form `@KEY@`. Here is the list of available keys:

- `GOLEM_TMPL_VERSION_HASH`
- `GOLEM_TMPL_VERSION_REVISION`
- `GOLEM_TMPL_VERSION_MESSAGE`
- `GOLEM_TMPL_VERSION_BUILD_NUMBER`
- `GOLEM_TMPL_VERSION_SEMVER`
- `GOLEM_TMPL_VERSION_SEMVER_LONG`
- `GOLEM_TMPL_VERSION_SEMVER_SHORT`
- `GOLEM_TMPL_VERSION_SEMVER_MAJOR`
- `GOLEM_TMPL_VERSION_SEMVER_MINOR`
- `GOLEM_TMPL_VERSION_SEMVER_PATCH`
- `GOLEM_TMPL_VERSION_SEMVER_PRERELEASE`
- `GOLEM_TMPL_VERSION_SEMVER_BUILDMETADATA`
- `GOLEM_TMPL_VERSION`
- `GOLEM_TMPL_VERSION_SHORT`
- `GOLEM_TMPL_VERSION_LONG`
- `GOLEM_TMPL_VERSION_MAJOR`
- `GOLEM_TMPL_VERSION_MINOR`
- `GOLEM_TMPL_VERSION_PATCH`
- `GOLEM_TMPL_VERSION_PRERELEASE`
- `GOLEM_TMPL_VERSION_BUILDMETADATA`
- `GOLEM_TMPL_VERSION_GIT_DESCRIBE_SHORT`
- `GOLEM_TMPL_VERSION_GIT_DESCRIBE_LONG`
- `GOLEM_TMPL_VERSION_GIT_TAG`
- `GOLEM_TMPL_VERSION_GIT_REVISION`
- `GOLEM_TMPL_VERSION_GIT_MESSAGE`
- `GOLEM_TMPL_VERSION_GIT_BRANCH`
- `GOLEM_TMPL_VERSION_GIT_BRANCH_MACRO`
- `GOLEM_TMPL_VERSION_BRANCH`
- `GOLEM_TMPL_VERSION_BRANCH_MACRO`
- `GOLEM_TMPL_DATE_UTC_ISO8601`
- `GOLEM_TMPL_PLATFORM`
- `GOLEM_TMPL_RUNTIME`
- `GOLEM_TMPL_RUNTIME_VERSION`
- `GOLEM_TMPL_RUNTIME_VERSION_SEMVER`
- `GOLEM_TMPL_ARCHITECTURE` (e.g. `x86_64`, see [Architectures](/docs/reference/architectures/))
- `GOLEM_TMPL_TARGET_ARTIFACT_BASENAME`

## Build number

When building the project under a CI environment, it is often useful to keep track of the builds independantly from the version set on the project.

To enable the use of the build number, set `project.enable_build_number = True`.

When enabled, Golem searches for an environment variable `BUILD_NUMBER` and expects its value to be an integer.

The build number is used for different purposes:
- To generate the filename of packages
- As a replacable key in template files
- To set the **buildmetadata** component on the **SemVer** version of the project

## Force build options on targets and dependencies

TODO

### Examples

To learn with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/advanced>

## Customization of dependencies

TODO

### Examples

To learn with examples have a look at:
- <https://github.com/GolemCpp/golem/tree/main/examples/advanced>
