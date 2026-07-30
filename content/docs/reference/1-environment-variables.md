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
3. Environment variable
4. Local config
5. Global config
6. Built-in default

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

## Source locations

`GOLEM_COOKBOOKS_LOCATIONS` and `GOLEM_OVERLAYS_LOCATIONS` name where a resource comes from. Each
entry is a **location**, optionally prefixed by the **kind** of source it is:

``` text
[<kind>+]<locator>
```

| Kind | Locator | Behaviour |
| --- | --- | --- |
| `git` | Any form accepted by `git clone`, or a local path | **Cloned** into the cache, then updated with `git fetch` |
| `directory` | A local path | **Copied** into the cache as-is, again on each `golem resolve` |

Without a prefix, Golem works the kind out: a local directory that is not a Git checkout is
`directory`, anything else is `git`. Spell the kind when the guess would be wrong — a local Git
checkout you want copied rather than cloned, or a directory you want treated as a repository.

- Local paths are relative to the project and normalized internally to `file://...` URLs.
- A prefix naming a kind Golem does not know is an error, not a path.

``` text
GOLEM_COOKBOOKS_LOCATIONS=directory+/home/user/recipes
GOLEM_COOKBOOKS_LOCATIONS=git+https://github.com/GolemCpp/recipes.git
```

## Cookbooks

### `GOLEM_COOKBOOKS_LOCATIONS`

Defines the ordered list of cookbooks to search for [recipes](/docs/advanced/recipes/).

``` text
GOLEM_COOKBOOKS_LOCATIONS=<location_1>|<location_2>|...
```

Examples:

``` text
GOLEM_COOKBOOKS_LOCATIONS=/home/user/recipes
GOLEM_COOKBOOKS_LOCATIONS=directory+/home/user/recipes|git+https://github.com/GolemCpp/recipes.git
```

## Overlays

### `GOLEM_OVERLAYS_LOCATIONS`

Defines the ordered list of overlays contributing an `overrides.json`.

``` text
GOLEM_OVERLAYS_LOCATIONS=<location_1>|<location_2>|...
```

Overlays are **layered in order**: a later overlay overwrites only the fields it defines, so it
refines the ones before it rather than replacing them. See
[Dependencies](/docs/advanced/dependencies/#overlays).

Example:

``` text
GOLEM_OVERLAYS_LOCATIONS=/home/user/company-overlay|/home/user/my-overlay
```

### `GOLEM_OVERRIDES_CONFIGURATION`

Defines the path to a `overrides.json` file directly. An explicit file names the overrides outright
and stands in for the whole overlay stack.

``` text
GOLEM_OVERRIDES_CONFIGURATION=/home/user/overrides.json
```
