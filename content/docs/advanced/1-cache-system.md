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

Every cached resource carries a `.golem-manifest.json` descriptor at its root
recording its kind, the source it was obtained from and what that fetch left
there. Use [golem cache](/docs/commands/golem-cache/) to list, size, and clean
cached resources across the configured caches.

## How cache settings are resolved

Every setting on this page is read through the same precedence, whichever command asks for it —
`golem configure`, a dependency sub-build, `golem cache` or `golem tools`:

1. Command-line option
2. Option persisted by `golem configure` (build directory)
3. Environment variable
4. Local config
5. Global config
6. Built-in default

Each one is also a persistable setting, so it can be stored once with
[golem config](/docs/commands/golem-config/) instead of being passed every time. The whole set is
forwarded to dependency sub-builds, so the entire dependency graph reaches the same caches with the
same layout.

## Anatomy of a cached resource

A cached resource is a directory holding what Golem fetched plus what it built from it:

``` text
<cache>/dependencies/@json@nlohmann@github.com#65ee684/
├── .golem-manifest.json   the descriptor: kind, source, what was fetched, timestamps
├── source/                the git clone (or the copied directory)
├── include/               headers exposed to the calling project
└── <build-slug>/          artifacts, per platform/compiler/variant
```

Note that every resource kind has at least `.golem-manifest.json` and `source/` in its cache location.

Beside the root, not inside it, sits a `<root>.lock` file. It is how two Golems sharing a cache take
a resource in turn instead of writing over each other: whoever holds it is fetching or refreshing,
and the other says it is waiting. The lock is the operating system's own, so it is released when a
Golem ends however it ends, and the empty file it leaves behind is not a resource — `golem cache`
only counts directories.

## Controlling the locations

### Default cache directory

By default, Golem stores dependencies in `~/.cache/golem`.

To change this default, define the following environment variable:

``` text
GOLEM_CACHE_DIRECTORY=<path>
```

Or use the following `golem configure` option:

- `--cache-directory=<path>`

  Or store it once with `golem config cache.directory <path>`. The option takes precedence over the
environment variable, which takes precedence over the stored setting.

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

  Or store it with `golem config cache.resolution-policy <policy>`. The option takes precedence over
the environment variable, which takes precedence over the stored setting.

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

## Path minimization

On Windows, `cl.exe` and cannot handle paths longer than about 255 characters.
Because cached resources live under `<cache>/<kind>/<cache-key>/...` and the
compiler is handed deep sub-paths of those roots (include directories, libraries,
artifacts), a deep cache directory can push paths past that limit and break the build.

**Path minimization** keeps these paths short. Instead of the classic
`<cache>/<kind>/<cache-key>` layout, a minimized resource is stored **flat at the
cache root**, under a short hash of `<kind>/<cache-key>` with no per-kind
subdirectory:

``` text
<cache>/dependencies/@json@nlohmann@github.com#65ee684   ->   <cache>/3a33b297
```

It applies uniformly to every resource kind — dependencies, cookbooks,
overlays, and tools — and the setting is forwarded to
dependency sub-builds so the whole dependency graph uses the same layout.

A minimized resource is still fully described by its `.golem-manifest.json`, so
[golem cache](/docs/commands/golem-cache/) reports its real kind and source
regardless of where it is stored.

### Priority to existing non-minimized resources

If a resource already exists at its classic `<cache>/<kind>/<cache-key>`
location, Golem keeps using it. Minimization only changes where **new** resources
are written, so caches populated before it was enabled stay usable.

### Enabling and disabling

Path minimization is **on by default**. Control it with the environment variable:

``` text
GOLEM_CACHE_MINIMIZATION_ENABLED=<on|off>
```

- `--cache-minimization-enabled[=<on|off>]` — the `golem configure` option
- `cache.minimization.enabled` — the persisted setting (see [golem config](/docs/commands/golem-config/))

Regarding the `golem configure` option, omit it entirely to keep the automatic default. Pass the
**bare** flag to force it on. Pass `=on` / `=off` to force a value — an explicit value overrides
the environment variable and stored configuration.

### Controlling the hash length

The number of hash characters used for a minimized name is configurable
(default `8`):

``` text
GOLEM_CACHE_MINIMIZATION_LENGTH=<n>
```

- `--cache-minimization-length=<n>` — the `golem configure` option
- `cache.minimization.length` — the persisted setting (see [golem config](/docs/commands/golem-config/))

A larger value lowers the (already negligible) chance of a hash collision, at the
cost of slightly longer names. The value must be a positive number: Golem reports an error rather
than silently falling back to the default.
