---
title: "Dependencies"
description: ""
summary: ""
date: 2026-01-18T10:33:54+01:00
draft: false
weight: 802
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Have a look at [examples/dependencies](https://github.com/GolemCpp/golem/tree/main/examples/dependencies) to find a working example illustrating the concepts described in this section.

## Management and Conflict mitigation

It is expected in a complex project that dependencies have some dependencies in common, and sometimes they are conflicting with each other.

The `overrides.json` file solves this issue by overriding how dependencies should be resolved. It's a list of dependencies that `golem resolve` checks everytime it is encountering a dependency definition to replace it with the one found (if any) in the `overrides.json`.

> [!TIP]+
> The most common use cases are forcing a specific version or forcing the release variant on a dependency accross a whole dependency tree.

Here is how a it looks like:

```json {title="overrides.json"}
[
    {
        "repository": "https://github.com/nlohmann/json.git",
        "version": "^3.0.0",
        "variant": "release",
        "shallow": true
    }
]
```

This overrides any reference to this dependency with the version `^3.0.0` and the release variant.

An entry accepts the same source parameters as a [dependency definition](/docs/project-file/definitions/#dependency): `repository` for a Git repository, `directory` for a local directory copied as-is, or `location` for either.

The `overrides.json` can be specified in multiple ways. By order of precedence:

1. `--overrides-configuration=<path_to_file>`

   Call golem configure with an option pointing to the file

2. `GOLEM_OVERRIDES_CONFIGURATION=<path_to_file>`

   Define an environment variable pointing to the file

3. `golem config overrides.configuration <path_to_file>`

   Store the setting for the project (`--local`, the default) or for your user (`--global`). See [golem config](/docs/commands/golem-config/).

4. `--overlay-location=<location>`, `GOLEM_OVERLAYS_LOCATIONS=<location>|...`, or
   `golem config overlays.locations <location>|...`

   Point at one or more [overlays](#overlays), each carrying an `overrides.json`.

An explicit configuration file always wins over the overlays, and each of the two follows the usual
[resolution order](/docs/commands/golem-config/#resolution-order): option, environment variable,
then the local and global configuration stores.

## Overlays

An **overlay** is a source carrying an `overrides.json` at its root. It is how a team ships a shared
set of overrides without every project copying the same file.

An overlay is named by a [source location](/docs/reference/environment-variables/#source-locations),
`[<kind>+]<locator>[#<version>]`, so it may be a Git repository cloned into the cache or a local directory copied
into it:

``` bash
golem config overlays.locations "git+https://github.com/acme/golem-overlay.git|directory+./my-overlay"
```

Several overlays are **layered in the order they are configured**. For each dependency an overlay
overrides, a later overlay overwrites only the fields it actually sets, so it refines the ones before
it rather than replacing them:

```json {title="company overlay — overrides.json"}
[{ "repository": "https://github.com/nlohmann/json.git", "version": "^3.0.0", "variant": "release" }]
```

```json {title="my overlay — overrides.json"}
[{ "repository": "https://github.com/nlohmann/json.git", "version": "^3.11.0" }]
```

With `overlays.locations` set to the company overlay then yours, the JSON library resolves to
`^3.11.0` — your version wins — and keeps the `release` variant the company overlay set, because
your overlay says nothing about it.

Entries are matched on the source they override, so the same dependency declared with `repository`
in one overlay and `directory` in another are two distinct entries.

Golem writes the layered result to `overrides.json` in the build directory. Read it to see exactly
what the stack resolved to, and note that it is this file — not the overlays — that dependency
sub-builds receive.
