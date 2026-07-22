---
title: "Cache System"
description: ""
summary: ""
date: 2026-01-18T10:23:02+01:00
draft: false
weight: 801
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Have a look at [examples/cache](https://github.com/GolemCpp/golem/tree/main/examples/cache) to find a working example illustrating the concepts described in this section.

## Controlling the locations

### Default cache directory

By default, Golem stores dependencies in `~/.cache/golem`.

To change this default, define the following environment variable:

``` text
GOLEM_CACHE_DIRECTORY=<path>
```

Or use the following `golem configure` option:

- `--cache-directory=<path>`

The option takes precedence over the environment variable.

### Additional cache directories

On top of the default cache, you can declare **additional** cache directories. Each one may be **writable** or **read-only**, and may carry an optional regex that scopes which dependencies it stores or serves.

Use the following `golem configure` options — each is **repeatable**, so pass it once per directory:

- `--additional-cache-directory=<path>[=<url-regex>]` — an additional **writable** cache.
- `--additional-read-only-cache-directory=<path>[=<url-regex>]` — an additional **read-only** cache: Golem reads dependencies from it but never writes into it.

Where:

- `<path>` is a directory where the matched dependencies are stored.
- `<url-regex>` has to match the dependency's repository URL, or be left empty to match anything.

The equivalent environment variables take a single `|`-separated list of entries (the CLI options take precedence over them):

``` text
GOLEM_ADDITIONAL_CACHE_DIRECTORIES=<path1>[=<regex1>]|<path2>[=<regex2>]|...
GOLEM_ADDITIONAL_READ_ONLY_CACHE_DIRECTORIES=<path1>[=<regex1>]|...
```

For example, this will store all dependencies in `F:\CACHE`:

``` text
GOLEM_ADDITIONAL_CACHE_DIRECTORIES=F:\CACHE=^.*$
```

> [!TIP]+
> One interesting use case for this feature is to be able to split the cache in different directories to separate your own dependencies from others. By separating the cache, in a CI environment it allows you to only trigger rebuilds on a specified set of dependencies.

### Cache resolution policies

Since multiple cache directories can be defined to store dependencies, Golem provides different cache resolution policies.

To control the cache resolution policy, define the following environment variable:

``` text
GOLEM_CACHE_RESOLUTION_POLICY=<policy>
```

Or use the following `golem configure` option:

- `--cache-resolution-policy=<policy>`

The option takes precedence over the environment variable.

`<policy>` is the policy name, the valid values are:

- `strict` (default)

  Stops at the first valid cache definition found for the given dependency.

- `weak`

  Tries to find the dependency in each valid cache definition, or returns the first valid cache definition for the given dependency.

To search the cache directory corresponding to a given dependency, all policies have in common that they go through the cache definitions in this order:

1. Search for a cache associated with a regex, in the order in which they were defined, where the regex matches the dependency's URL:
 * `strict` policy stops at the first cache definition.
 * `weak` policy tries to find if any of the cache definitions, contains the dependency to be cached, and returns only if found.

2. Search for a cache associated with no regex:
 * `strict` policy stops at the first cache definition.
 * `weak` policy tries to find if any of the cache definitions, contains the dependency to be cached, and returns only if found.

3. If no cache definition was returned yet:
 * `strict` policy returns an error
 * `weak` policy returns the first valid cache definition with a regex matching the dependency's URL, or the first cache definition without regex.
