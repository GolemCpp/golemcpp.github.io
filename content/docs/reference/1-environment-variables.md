---
title: "Environment Variables"
description: ""
summary: ""
date: 2026-01-18T14:30:55+01:00
draft: false
weight: 10001
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Every variable on this page is one way to set a Golem setting. The same setting can be set with a
command-line option or stored with [golem config](/docs/commands/golem-config/), following a single
[resolution order](/docs/commands/golem-config/#resolution-order):

1. Command-line option
2. Option persisted by `golem configure` (build directory)
3. Project file
4. Environment variable
5. Local config
6. Global config
7. Built-in default

Run `golem config --help` for the authoritative list, with each setting's key, variable, option and
built-in default.

## Cache

These control where and how Golem caches resources. See [Cache System](/docs/advanced/cache-system/)
for what each one does.

| Variable | Setting | Default |
| --- | --- | --- |
| `GOLEM_CACHE_DIRECTORY` | `cache.directory` | `~/.cache/golem` |
| `GOLEM_ADDITIONAL_CACHE_DIRECTORIES` | `cache.additional-directories` | *(none)* |
| `GOLEM_ADDITIONAL_READ_ONLY_CACHE_DIRECTORIES` | `cache.additional-read-only-directories` | *(none)* |
| `GOLEM_CACHE_RESOLUTION_POLICY` | `cache.resolution-policy` | `strict` |
| `GOLEM_CACHE_MINIMIZATION_ENABLED` | `cache.minimization.enabled` | `on` |
| `GOLEM_CACHE_MINIMIZATION_LENGTH` | `cache.minimization.length` | `8` |

The two additional-directory variables take a `|`-separated list of `<path>[=<url-regex>]` entries:

``` text
GOLEM_ADDITIONAL_CACHE_DIRECTORIES=<path1>[=<regex1>]|<path2>[=<regex2>]|...
```

## Recipes

### `GOLEM_RECIPES_REPOSITORIES`

Defines the ordered list of recipe sources to search.

``` text
GOLEM_RECIPES_REPOSITORIES=<repository_or_directory_1>|<repository_or_directory_2>|...
```

- Each entry may be a Git-cloneable repository URL or a local directory path.
- Local directory paths are normalized internally to `file://...` URLs.
- If a local directory is not a Git repository, Golem recopies it into the cache on each `golem resolve`.

Examples:

``` text
GOLEM_RECIPES_REPOSITORIES=/home/user/recipes
GOLEM_RECIPES_REPOSITORIES=/home/user/recipes|https://github.com/GolemCpp/recipes.git
```

## Overrides

### `GOLEM_OVERRIDES_REPOSITORY`

Defines a repository or local directory containing `overrides.json`.

``` text
GOLEM_OVERRIDES_REPOSITORY=<repository_or_directory>
```

- The value may be a Git-cloneable repository URL or a local directory path.
- Local directory paths are normalized internally to `file://...` URLs.
- If the local directory is not a Git repository, Golem recopies it into the cache on each `golem resolve`.

Example:

``` text
GOLEM_OVERRIDES_REPOSITORY=/home/user/overrides
```

### `GOLEM_OVERRIDES_CONFIGURATION`

Defines the path to a `overrides.json` file directly.

``` text
GOLEM_OVERRIDES_CONFIGURATION=/home/user/overrides.json
```
