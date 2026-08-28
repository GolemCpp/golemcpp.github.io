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

`golem cache` inspects and cleans the resources Golem stores in its caches: dependencies, cookbooks, overlays, and tools.

Run it from your project root: it operates on exactly the caches the project is configured to use, including any additional cache directories the project was configured with (see [Cache System](/docs/advanced/cache-system/)).

```bash
golem cache list [--kind=<kind>] [--cache=<path>] [--older-than=<age>] [--long] [--json]
golem cache caches [--json]
golem cache size [--kind=<kind>] [--cache=<path>] [--older-than=<age>]
golem cache remove <path-or-regex> [--regex] [--older-than=<age>] [--dry-run] [--yes]
golem cache purge [--kind=<kind>] [--cache=<path>] [--older-than=<age>] [--dry-run] [--yes]
golem cache unidentified [--remove] [--dry-run] [--yes]
```

## Picking up a previous `golem configure`

`golem cache` reconstructs the set of caches to operate on from the options a previous `golem configure` persisted in the project's build directory. This is what makes it honour options such as `--additional-cache-directory` or `--cache-directory` set at configure time, without you re-passing them.

By default it reads the build directory Golem uses by default (`build/` under the project root). If your project was configured into a **non-default** build directory, point `golem cache` at it explicitly so those options are taken into account:

```bash
golem cache list --build-dir=<path-to-build-directory>
```

When the build directory does not exist or the project was never configured, `golem cache` falls back to environment variables, the configuration store, and finally the default cache location — the same [resolution order](/docs/commands/golem-config/#resolution-order) every command follows.

## Resource manifests

Every resource newly stored in a cache carries a small `.golem-manifest.json` descriptor at its root. It records the resource **kind**, its **cache key**, the **source** it was obtained from, what that **fetch** left there, the **manifest schema version** (so the on-disk layout can evolve), and **created** / **last used** timestamps. This lets Golem manage cached resources without relying on their opaque directory names.

Every resource kind — dependency, cookbook, overlay, tool — describes its source the same way:

```json
{
  "type": "git",
  "locator": "https://github.com/nlohmann/json.git",
  "resolved": {
    "reference": "v3.12.0",
    "revision": "9cca280afe0c1e4f2b8a3d5c6e7f8091a2b3c4d5"
  }
}
```

- `type` — `git` for a cloned repository, `directory` for a copied local directory.
- `locator` — the repository URL, or the directory URL.
- `resolved.reference` — the resolved git reference; empty for a directory source.
- `resolved.revision` — the commit that reference pointed at when it was resolved. A branch keeps its name while moving from one commit to the next, so neither stands in for the other.

Where the source names what was **asked for**, `fetched` names what the root ended up **holding**:

```json
{
  "head": "8c391e04fe0c8e0f1e2dcb27dc23ee9c5ea5a1b1",
  "mode": "blobless"
}
```

- `head` — the commit the fetch landed on. A resource following a branch keeps naming the same reference while landing somewhere new every time that branch moves, so the source alone cannot name what is there.
- `mode` — how much of the source was obtained (see [`GOLEM_GIT_FETCH_MODE`](/docs/reference/environment-variables/#git)). This is what lets a later `golem resolve` tell whether the root has to be converted before it can serve what is being asked for. Empty for a directory source, which has no history to obtain part of.

The manifest is the source of truth for a resource's identity wherever it is stored, so a [minimized](/docs/advanced/cache-system/#path-minimization) resource kept flat at the cache root is still fully identified.

A resource is reported as **unidentified**, with the kind `unknown`, in two cases:

- it carries **no manifest**,
- it carries an **unreadable manifest** (should not happen).

Nothing is lost when a resource is unidentified: its root is still where resolution looks for it, so the next `golem resolve` that needs it recognises what that root holds, refreshes it and writes a fresh manifest, after which it is identified again. `golem cache unidentified --remove` deletes the ones nothing needs any more.

## Subcommands

- `list`

  List cached resources, **grouped per cache** (each cache location is a header, writable or read-only, with how many resources it holds and how much space they take). One line per resource, **most recently used first**:

  ```text
  Cached resources:

  /home/you/.cache/golem: 4 resource(s), 8.1 MiB
    tool        cppfront                           v0.8.1 f31b4a2   blobless    5.7 MiB  6h ago
    dependency  @json@nlohmann@github.com#9cca280  v3.12.0 9cca280  blobless    2.4 MiB  7h ago
    overlay     @overlay-a@tmp@_local_             -                directory  20.0 KiB  1d ago
    dependency  @fmt@fmtlib@github.com#aa11bb2     11.0.2 aa11bb2   blobless    4.0 KiB  9d ago  incomplete
  ```

  The columns are the resource **kind**, its **cache key**, the **version** it holds, **how it was obtained** (the [fetch mode](/docs/reference/environment-variables/#git), or `directory`), its **size** and how long ago it was **last used**. An `incomplete` flag marks a root carrying a manifest but no source directory: an install that never finished.

  Add `--long` to follow every resource with its source, full commit, what the fetch left there, when it was created, its manifest version and its path.

- `caches`

  List the configured cache locations themselves (writable, read-only, and any URL regex), as resolved from the project's configuration.

- `size`

  Show storage totals, broken down per cache and per resource kind.

- `remove <path-or-regex>`

  Delete the resources whose cache key or path match the given pattern. The pattern is a substring by default, or a regular expression with `--regex`. The pattern is required: selecting by age alone is what `purge --older-than` does.

- `purge`

  Delete every resource from the caches. Restrict the scope with `--kind`, `--cache` or `--older-than`, and the confirmation names which of the two it is about to do.

  Reclaiming space is that last one, and the same selection previews with `list` and adds up with `size`:

  ```bash
  golem cache list --older-than=90d     # what would go
  golem cache size --older-than=90d     # how much it would free
  golem cache purge --older-than=90d    # take it
  ```

- `unidentified`

  List the resources whose manifest does not identify them (see [Resource manifests](#resource-manifests)) — for example resources stored before manifests existed. Add `--remove` to delete them.

## Options

- `--kind=<kind>`

  Filter by resource kind: `dependency`, `cookbook`, `overlay`, `tool`, or `unknown` (directories with no valid manifest).

- `--cache=<path>`

  Restrict the operation to a single configured cache location.

- `--older-than=<age>`

  Keep only the resources **last used** longer ago than `<age>`, written as a number and a unit among `s`, `m`, `h`, `d`, `w` — the units an age is printed with, so `90d ago` in a listing and `--older-than=90d` mean the same thing (`m` is minutes on both sides).

  Resolving a resource counts as using it, so anything a project still builds against stays out of the selection.

  A resource nothing identifies carries no timestamp, therefore its age is unknown and `--older-than` never selects one; `unidentified` clears those.

- `--regex`

  Treat the `remove` pattern as a regular expression instead of a substring.

- `--long`, `-l`

  Show the source, version, fetch, creation age, manifest version and path of every resource `list` reports.

- `--json`

  Emit machine-readable JSON instead of formatted text. Each resource carries its `kind`, `cache_key`, `source`, `fetched`, `identified` and `installed` flags, `manifest_version`, `cache_root`, `size_bytes`, timestamps and path.

- `--dry-run`

  Show the selection that would be deleted without deleting anything.

- `--yes`, `-y`

  Skip the interactive confirmation before deleting.

- `--cache-directory=<path>`

  Override the primary cache directory.

- `--build-dir=<path>`

  Read the options of a previous `golem configure` from this build directory instead of the default `build/`. Use it when the project was configured into a non-default build directory, so cache options set at configure time (for example additional cache directories) are taken into account.

## Confirmation and safety

Every deleting operation prints the exact selection first and then asks for confirmation. Pass `--yes` to skip the prompt (for scripts and CI), or `--dry-run` to preview without deleting. Resources living in **read-only** caches are listed but never deleted.
