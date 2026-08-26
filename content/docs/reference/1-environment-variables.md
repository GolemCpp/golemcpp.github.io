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

Every variable on this page is one way to set a Golem setting. The same setting can be set with a command-line option or stored with [golem config](/docs/commands/golem-config/), following a single [resolution order](/docs/commands/golem-config/#resolution-order):

1. Command-line option
2. Option persisted by `golem configure` (build directory)
3. Environment variable
4. Local config
5. Global config
6. Built-in default

Run `golem config --help` for the authoritative list, with each setting's key, variable, option and built-in default.

## Cache

These control where and how Golem caches resources. See [Cache System](/docs/advanced/cache-system/) for what each one does.

| Variable                                       | Setting                                  | Default          |
| ---------------------------------------------- | ---------------------------------------- | ---------------- |
| `GOLEM_CACHE_DIRECTORY`                        | `cache.directory`                        | `~/.cache/golem` |
| `GOLEM_ADDITIONAL_CACHE_DIRECTORIES`           | `cache.additional-directories`           | _(none)_         |
| `GOLEM_ADDITIONAL_READ_ONLY_CACHE_DIRECTORIES` | `cache.additional-read-only-directories` | _(none)_         |
| `GOLEM_CACHE_RESOLUTION_POLICY`                | `cache.resolution-policy`                | `strict`         |
| `GOLEM_CACHE_MINIMIZATION_ENABLED`             | `cache.minimization.enabled`             | `on`             |
| `GOLEM_CACHE_MINIMIZATION_LENGTH`              | `cache.minimization.length`              | `8`              |

The two additional-directory variables take a `|`-separated list of `<path>[=<url-regex>]` entries:

```text
GOLEM_ADDITIONAL_CACHE_DIRECTORIES=<path1>[=<regex1>]|<path2>[=<regex2>]|...
```

## Git

These control how Golem obtains a resource from a repository. They apply to every resource kind: dependencies, cookbooks, overlays and tools alike.

| Variable                   | Setting              | Default                        |
| -------------------------- | -------------------- | ------------------------------ |
| `GOLEM_GIT_FETCH_MODE`     | `git.fetch-mode`     | `blobless`                     |
| `GOLEM_GIT_JOBS`           | `git.jobs`           | one per processor, capped at 8 |
| `GOLEM_GIT_PROMPT_ENABLED` | `git.prompt.enabled` | `off`                          |

**`git.fetch-mode`** is how much of a repository to obtain:

| Mode       | What it obtains                                    | What it costs                                                 |
| ---------- | -------------------------------------------------- | ------------------------------------------------------------- |
| `blobless` | Every commit and every tag, file content on demand | Slightly longer to clone than `full`                          |
| `full`     | Everything                                         | Every version of every file, kept for as long as the cache is |
| `shallow`  | The requested commit and nothing around it         | No history, so no `git describe`                              |

`blobless` is the default, and is what makes a heavy repository cheap on disk without giving up anything a build reads: `git describe --long --tags` keeps working, which is what a project deriving its version from its history needs. What it leaves out is the file content of commits nobody checked out, which for a repository with a long history is most of it. On Boost at `boost-1.89.0` the cache root comes to about half what a full clone takes, but it take about 20% more time to clone than `full` from GitHub.

`full` is the one mode whose cache keeps working with **no access to the remotes at all**. Can be useful if changing the pointed reference should be performed without a fetch that would require network access.

`shallow` is asked for per dependency, with [`shallow=True`](/docs/project-file/definitions/#dependency) in the project file, for a repository that is heavy and whose history the build has no use for. It is the only one that gives up `git describe`. On Boost at `boost-1.89.0` the cache root comes as the smallest of the three on disk, but it is the longest to clone from GitHub.

It is also the only one that asks the remote for its reference **by name** rather than cloning and looking. A blobless or full root therefore holds only what `refs/heads/*` and `refs/tags/*` reach, and refuses a reference outside that, where a shallow fetch may still obtain one. Naming a reference no branch and no tag reaches, a pull request's head, a commit force-pushed off its branch, is not meant to be supported in any mode. Whether it can be obtained is the server's decision, and a commit no ref points at may be collected upstream at any time.

Although `blobless` is default, Golem falls back to `full` on its own when Git is too old to be trusted with a partial clone. But an explicit `blobless` still wins.

A cached resource is not stuck with the mode it was fetched in: `golem resolve` converts a root to whatever is being asked for now, in place where that is cheaper than obtaining it again.

**`git.jobs`** is how many submodules to fetch at once, which is the wall-clock lever on a superproject with many of them.

**`git.prompt.enabled`** lets Git stop and ask for the credentials of a repository it cannot read. Off by default: a prompt nobody is watching looks like a hang, where a refusal names the repository. Turn it on to authenticate interactively once. It covers only what Git asks for itself. A repository reached over ssh is left to ssh and to the keys it is configured with, so a key held on a security key needs nothing set here.

## Source locations

`GOLEM_COOKBOOKS_LOCATIONS` and `GOLEM_OVERLAYS_LOCATIONS` name where a resource comes from. Each entry is a **location**, optionally prefixed by the **kind** of source it is:

```text
[<kind>+]<locator>[#<version>]
```

| Kind        | Locator                                           | Behaviour                                                      |
| ----------- | ------------------------------------------------- | -------------------------------------------------------------- |
| `git`       | Any form accepted by `git clone`, or a local path | **Cloned** into the cache, then updated with `git fetch`       |
| `directory` | A local path                                      | **Copied** into the cache as-is, again on each `golem resolve` |

Without a prefix, Golem works the kind out: a local directory Git cannot clone from is `directory`, anything else is `git`. Everything Git can clone from counts (e.g. a normal checkout, a bare repository, a worktree, a submodule checkout). Spell the kind when the guess would be wrong. `directory+` on a Git checkout you want copied rather than cloned. `git+` cannot turn a directory into a repository, and **refuses one that is not**, rather than failing later inside Git.

- Any form `git clone` accepts works, including scp-style (`git@github.com:org/repo.git`) and transport helpers (`hg::https://host/repo`). Golem hands Git what you wrote.
- Local paths are relative to the project and normalized internally to `file://...` URLs.
- Golem decides what is a path the way Git does, so a `:` before the first `/` makes a locator a remote. A local path holding one needs Git's own escape hatch: write `./weird:name`, since `weird:name` reads as the host `weird` even when the directory exists.
- A prefix naming a kind Golem does not know is an error, not a path.

A `git` location may name the **version** to obtain, after a `#`. It may be a branch to follow, a tag to land on, or a commit. Golem looks the name up in the repository the way Git looks one up, so **a tag wins over a branch of the same name**, exactly as `git rev-parse` answers. A name that is neither is used as given, which is what a commit hash is.

Whichever form it takes, what Golem records is the commit a checkout lands on. An annotated tag therefore records the commit it points at, where `git rev-parse v1.2.0` on its own would answer the tag object.

Everything after the first `#` is the version, so a namespaced ref such as `release/1.2.3` needs no escaping. But `#` is also a legal character in a path, so for a **local path** Golem tests the path exactly as written first, keeping any version-looking segment in the path. Only when nothing is there does Golem read what follows the `#` as the version. Every other form always splits at the first `#`.

Naming no version asks for the repository's **default branch**, which is what a plain `git clone` gives you. Golem asks the remote which branch that is, so you do not have to know whether it is called `main` or `master`. Writing `#HEAD` asks for the same thing.

The version may instead be a **semver range** (`^1.2.0`, `~1.2`, `>=1.0.0 <2.0.0`), which Golem matches against the tags the remote publishes.

Whichever form it takes, the version is resolved during `golem resolve` and nowhere else, and a cookbook or overlay is cached under the version **you wrote** rather than under what it resolved to. So one entry keeps one cache directory and is re-pointed at each `golem resolve` — `^1.0.0` moves from `1.1.0` to `1.2.0` in place, exactly as `main` moves from commit to commit — and `golem configure` and `golem build` find that directory without reaching the network. Changing the version you wrote is what starts a new one.

A range is re-resolved on every `golem resolve` rather than pinned, since a cookbook or an overlay has no per-project file to record what it picked. Use a tag when you want it to stay put.

```text
GOLEM_COOKBOOKS_LOCATIONS=directory+/home/user/recipes
GOLEM_COOKBOOKS_LOCATIONS=git+https://github.com/GolemCpp/recipes.git
GOLEM_COOKBOOKS_LOCATIONS=git+https://github.com/GolemCpp/recipes.git#v2.1.0
GOLEM_COOKBOOKS_LOCATIONS=git+https://github.com/GolemCpp/recipes.git#^2.1.0
GOLEM_OVERLAYS_LOCATIONS=git+https://github.com/acme/golem-overlay.git#release/1.2.3
```

## Cookbooks

### `GOLEM_COOKBOOKS_LOCATIONS`

Defines the ordered list of cookbooks to search for [recipes](/docs/advanced/recipes/).

```text
GOLEM_COOKBOOKS_LOCATIONS=<location_1>|<location_2>|...
```

Cookbooks are layered in the order they are listed, and the last one holding a recipe wins. So a cookbook of your own goes **after** the one it overrides.

Examples:

```text
GOLEM_COOKBOOKS_LOCATIONS=/home/user/recipes
GOLEM_COOKBOOKS_LOCATIONS=git+https://github.com/GolemCpp/recipes.git|directory+/home/user/recipes
```

## Overlays

### `GOLEM_OVERLAYS_LOCATIONS`

Defines the ordered list of overlays contributing an `overrides.json`.

```text
GOLEM_OVERLAYS_LOCATIONS=<location_1>|<location_2>|...
```

Overlays are **layered in order**: a later overlay overwrites only the fields it defines, so it refines the ones before it rather than replacing them. See [Dependencies](/docs/advanced/dependencies/#overlays).

Example:

```text
GOLEM_OVERLAYS_LOCATIONS=/home/user/company-overlay|/home/user/my-overlay
```

### `GOLEM_OVERRIDES_CONFIGURATION`

Defines the path to a `overrides.json` file directly. An explicit file names the overrides outright and stands in for the whole overlay stack.

```text
GOLEM_OVERRIDES_CONFIGURATION=/home/user/overrides.json
```
