---
title: "Source Locations"
description: ""
summary: ""
date: 2026-08-28T10:00:00+02:00
draft: false
weight: 10002
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

A **location** says where a source comes from. Golem reads one wherever a resource is named: the [`GOLEM_COOKBOOKS_LOCATIONS`](/docs/reference/environment-variables/#cookbooks) and [`GOLEM_OVERLAYS_LOCATIONS`](/docs/reference/environment-variables/#overlays) settings, and a [dependency](/docs/project-file/definitions/#dependency)'s `location`.

```text
[<kind>+]<locator>[#<version>]
```

## The kind

| Kind        | Locator                                           | Behaviour                                                      |
| ----------- | ------------------------------------------------- | -------------------------------------------------------------- |
| `git`       | Any form accepted by `git clone`, or a local path | **Cloned** into the cache, then updated with `git fetch`       |
| `directory` | A local path                                      | **Copied** into the cache as-is, again on each `golem resolve` |

Without a prefix, Golem works the kind out: a local directory Git cannot clone from is `directory`, anything else is `git`. Everything Git can clone from counts (e.g. a normal checkout, a bare repository, a worktree, a submodule checkout). Spell the kind when the guess would be wrong. `directory+` on a Git checkout you want copied rather than cloned. `git+` cannot turn a directory into a repository, and **refuses one that is not**, rather than failing later inside Git.

- Any form `git clone` accepts works, including scp-style (`git@github.com:org/repo.git`) and transport helpers (`hg::https://host/repo`). Golem hands Git what you wrote.
- Local paths are relative to the project and normalized internally to `file://...` URLs.
- Golem decides what is a path the way Git does, so a `:` before the first `/` makes a locator a remote. A local path holding one needs Git's own escape hatch: write `./weird:name`, since `weird:name` reads as the host `weird` even when the directory exists.
- A prefix naming a kind Golem does not know is an error, not a path.

## The version

A `git` location may name the **version** to obtain, after a `#`. It may be a branch to follow, a tag to land on, or a commit. Golem looks the name up in the repository the way Git looks one up, so **a tag wins over a branch of the same name**, exactly as `git rev-parse` does. A name that is neither is used as given, which is what a commit hash is.

Whichever form it takes, what Golem records is the commit a checkout lands on. An annotated tag therefore records the commit it points at, where `git rev-parse v1.2.0` on its own would return the tag object.

Everything after the first `#` is the version, so a namespaced ref such as `release/1.2.3` needs no escaping. But `#` is also a legal character in a path, so for a **local path** Golem tests the path exactly as written first, keeping any version-looking segment in the path. Only when nothing is there does Golem read what follows the `#` as the version. Every other form always splits at the first `#`.

Naming no version asks for the repository's **default branch**, which is what a plain `git clone` gives you. Golem asks the remote which branch that is, so you do not have to know whether it is called `main` or `master`. Writing `#HEAD` asks for the same thing.

The version may instead be a **semver range** (`^1.2.0`, `~1.2`, `>=1.0.0 <2.0.0`), which Golem matches against the tags the remote publishes.

Whichever form it takes, the version is resolved during `golem resolve` and nowhere else, and a cookbook or overlay is cached under the version **you wrote** rather than under what it resolved to. So one entry keeps one cache directory and is re-pointed at each `golem resolve` — `^1.0.0` moves from `1.1.0` to `1.2.0` in place, exactly as `main` moves from commit to commit — and `golem configure` and `golem build` find that directory without reaching the network. Changing the version you wrote is what starts a new one.

For a cookbook or an overlay, a range is re-resolved on every `golem resolve` rather than pinned, because neither records what it picked. Use a tag when you want it to stay put.

Examples:

```text
git+https://github.com/GolemCpp/recipes.git#v2
git+https://github.com/acme/cookbook.git#v2.1.0
git+https://github.com/acme/cookbook.git#^2.1.0
git+https://github.com/acme/golem-overlay.git#release/1.2.3
```

## The second shape

A dependency's `location` takes one further shape: a [source identity](/docs/reference/source-identities/) such as `@boost`, which names the source instead of where it is. Golem searches the cookbooks for a recipe of that name and clones the locator it declares.

```text
<identity>[#<version>]
```

Only a dependency may name one. See [Identity as location](/docs/reference/source-identities/#identity-as-location).

A cookbook and an overlay say where they come from, so they take the shape above and nothing else.

Examples:

```text
@boost#^1.90.0
@boost@boostorg@github.com#^1.90.0
```
