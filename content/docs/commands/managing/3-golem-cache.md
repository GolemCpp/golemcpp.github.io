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
dependencies, cookbooks, overlays, and tools.

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
finally the default cache location — the same
[resolution order](/docs/commands/golem-config/#resolution-order) every command follows.

## Resource manifests

Every resource newly stored in a cache carries a small `.golem-manifest.json`
descriptor at its root. It records the resource **kind**, its **cache key**, the
**source** it was obtained from, what that **fetch** left there, the **manifest
schema version** (so the on-disk layout can evolve), and **created** / **last
used** timestamps. This lets Golem manage cached resources without relying on
their opaque directory names.

Every resource kind — dependency, cookbook, overlay, tool — describes its
source the same way:

``` json
{
  "type": "git",
  "location": "https://github.com/nlohmann/json.git",
  "reference": "v3.12.0"
}
```

- `type` — `git` for a cloned repository, `directory` for a copied local directory.
- `location` — the repository URL, or the directory path.
- `reference` — the resolved git reference; empty for a directory source.

Where the source says what was **asked for**, `fetched` says what the root ended
up **holding**:

``` json
{
  "head": "8c391e04fe0c8e0f1e2dcb27dc23ee9c5ea5a1b1",
  "mode": "blobless"
}
```

- `head` — the commit the fetch landed on. A resource following a branch keeps
  naming the same reference while landing somewhere new every time that branch
  moves, so the source alone cannot say what is there.
- `mode` — how much of the source was obtained (see
  [`GOLEM_GIT_FETCH_MODE`](/docs/reference/environment-variables/#git)). This is
  what lets a later `golem resolve` tell whether the root has to be converted
  before it can serve what is being asked for. Empty for a directory source,
  which has no history to obtain part of.

The manifest is the source of truth for a resource's identity wherever it is
stored, so a [minimized](/docs/advanced/cache-system/#path-minimization) resource
kept flat at the cache root is still fully identified. A directory with **no**
manifest is reported as **unidentified**, with the kind `unknown`.

## Subcommands

- `list`

  List cached resources, **grouped per cache** (each cache location is a header,
  writable or read-only). Every resource shows its kind, its source
  (`<location> <reference>`), size and on-disk path. Add `--long` to also show the
  created and last-used ages and the manifest version.

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

  List resources that have no valid manifest — for example legacy resources
  stored before manifests existed. Add `--remove` to delete them.

## Options

- `--kind=<kind>`

  Filter by resource kind: `dependency`, `cookbook`, `overlay`, `tool`, or
  `unknown` (directories with no valid manifest).

- `--cache=<path>`

  Restrict the operation to a single configured cache location.

- `--regex`

  Treat the `remove` pattern as a regular expression instead of a substring.

- `--long`, `-l`

  Show the created/last-used ages and manifest version in `list`.

- `--json`

  Emit machine-readable JSON instead of formatted text. Each resource carries its `kind`,
  `cache_key`, `source`, `identified` flag, `manifest_version`, `cache_root` and path.

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
