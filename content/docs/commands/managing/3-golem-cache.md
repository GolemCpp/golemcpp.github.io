---
title: golem cache
url: "/docs/commands/golem-cache/"
description: ""
summary: ""
date: 2026-07-24T18:42:33+02:00
draft: false
weight: 333
toc: true
seo:
  title: ""
  description: ""
  canonical: ""
  noindex: false
---

`golem cache` inspects and cleans the resources Golem stores in its caches:
dependencies, recipes repositories, overrides repositories, and tools.

Run it from your project root: it operates on exactly the caches the project is
configured to use, including any additional cache directories the project was
configured with (see [Cache System](/docs/advanced/cache-system/)).

``` bash
golem cache list [--kind=<kind>] [--cache=<path>] [--long] [--json]
golem cache caches [--json]
golem cache size [--kind=<kind>] [--cache=<path>]
golem cache remove <path-or-regex> [--regex] [--dry-run] [--yes]
golem cache purge [--kind=<kind>] [--cache=<path>] [--dry-run] [--yes]
golem cache unidentified [--remove] [--dry-run] [--yes]
```

## Picking up a previous `golem configure`

`golem cache` reconstructs the set of caches to operate on from the options a
previous `golem configure` persisted in the project's build directory. This is
what makes it honour options such as `--additional-cache-directory` or
`--cache-directory` set at configure time, without you re-passing them.

By default it reads the build directory Golem uses by default (`build/` under the
project root). If your project was configured into a **non-default** build
directory, point `golem cache` at it explicitly so those options are taken into
account:

``` bash
golem cache list --build-dir=<path-to-build-directory>
```

When the build directory does not exist or the project was never configured,
`golem cache` falls back to environment variables, the configuration store, and
finally the default cache location.

## Resource manifests

Every resource newly stored in a cache carries a small `.golem-manifest.json`
descriptor at its root. It records the resource **kind**, its **identity** (for
a dependency: repository, resolved version and hash; for a repository: URL and
git reference; for a tool: name and version), the **manifest schema version**
(so the on-disk layout can evolve), and **created** / **last used** timestamps.
This lets Golem manage cached resources without relying on their opaque
directory names.

Resources stored before manifests were introduced have no descriptor and are
reported as **unidentified**. Likewise, any unexpected directory sitting directly
at a cache root — such as a legacy resource stored flat before the per-kind
subdirectory layout existed — is reported as an unidentified resource of kind
`unknown`.

## Subcommands

- `list`

  List cached resources across every configured cache, with their kind,
  identity, originating cache, and size. Add `--long` to also show the created
  and last-used ages, the manifest version, and the on-disk path.

- `caches`

  List the configured cache locations themselves (writable, read-only, and any
  URL regex), as resolved from the project's configuration.

- `size`

  Show storage totals, broken down per cache and per resource kind.

- `remove <path-or-regex>`

  Delete the resources whose cache key or path match the given pattern. The
  pattern is a substring by default, or a regular expression with `--regex`.

- `purge`

  Delete every resource from the caches. Restrict the scope with `--kind` or
  `--cache`.

- `unidentified`

  List resources that have no valid manifest — including legacy flat resources
  and any unexpected directory found at a cache root. Add `--remove` to delete
  them.

## Options

- `--kind=<kind>`

  Filter by resource kind: `dependency`, `recipes-repository`,
  `overrides-repository`, `tool`, or `unknown` (legacy flat and unexpected
  directories).

- `--cache=<path>`

  Restrict the operation to a single configured cache location.

- `--regex`

  Treat the `remove` pattern as a regular expression instead of a substring.

- `--long`, `-l`

  Show created/last-used ages, manifest version, and path in `list`.

- `--json`

  Emit machine-readable JSON instead of formatted text.

- `--dry-run`

  Show the selection that would be deleted without deleting anything.

- `--yes`, `-y`

  Skip the interactive confirmation before deleting.

- `--cache-directory=<path>`

  Override the primary cache directory.

- `--build-dir=<path>`

  Read the options of a previous `golem configure` from this build directory
  instead of the default `build/`. Use it when the project was configured into a
  non-default build directory, so cache options set at configure time (for
  example additional cache directories) are taken into account.

## Confirmation and safety

Every deleting operation prints the exact selection first and then asks for
confirmation. Pass `--yes` to skip the prompt (for scripts and CI), or
`--dry-run` to preview without deleting. Resources living in **read-only** caches
are listed but never deleted.
