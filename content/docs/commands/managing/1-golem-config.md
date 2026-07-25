---
title: golem config
url: "/docs/commands/golem-config/"
description: ""
summary: ""
date: 2026-07-19T02:38:22+02:00
draft: false
weight: 331
toc: true
seo:
  title: ""
  description: ""
  canonical: ""
  noindex: false
---

`golem config` gets and sets Golem settings, at either a global (per-user) scope or a local (per-project) scope, similar to `git config`.

``` bash
golem config <key> [<value>] [--global | --local]
golem config --unset <key> [--global | --local]
golem config --list [--global | --local]
```

## Scopes

- `--local` (default)

  Project configuration stored in `<project>/.golem/config.json`.

- `--global`

  User configuration, stored per platform:

  | Platform | Location |
  | --- | --- |
  | Linux / macOS | `~/.config/golem/config.json` (or `$XDG_CONFIG_HOME/golem/config.json`) |
  | Windows | `%APPDATA%\golem\config.json` |

  Run `golem config --help` to print the exact location used on your machine.

When reading a setting, the local scope overrides the global scope.

## Actions

- `config <key>`

  Print the resolved value of a setting (local overrides global). Exits with a non-zero status if the setting is unset.

- `config <key> <value>`

  Set a setting in the selected scope (local by default).

- `config --unset <key>`

  Remove a setting from the selected scope.

- `config --list`

  List settings as `key=value` lines. Without a scope the local and global configurations are merged; with `--global` or `--local` only that scope is listed.

## Resolution order

Each setting is resolved with the following precedence:

```
command-line option  >  environment variable  >  local config  >  global config  >  built-in default
```

An explicit environment variable therefore still overrides a stored configuration value, and a stored value overrides the built-in default.

## Settings

| Key | Environment variable |
| --- | --- |
| `cache.directory` | `GOLEM_CACHE_DIRECTORY` |
| `cache.additional-directories` | `GOLEM_ADDITIONAL_CACHE_DIRECTORIES` |
| `cache.additional-read-only-directories` | `GOLEM_ADDITIONAL_READ_ONLY_CACHE_DIRECTORIES` |
| `cache.resolution-policy` | `GOLEM_CACHE_RESOLUTION_POLICY` |
| `cache.minimization.enabled` | `GOLEM_CACHE_MINIMIZATION_ENABLED` |
| `cache.minimization.length` | `GOLEM_CACHE_MINIMIZATION_LENGTH` |
| `recipes.repositories` | `GOLEM_RECIPES_REPOSITORIES` |
| `overrides.configuration` | `GOLEM_OVERRIDES_CONFIGURATION` |
| `overrides.repository` | `GOLEM_OVERRIDES_REPOSITORY` |

The cache directory holds one subdirectory per resource kind: `dependencies/` for built dependencies, `recipes/` for recipe repositories, `overrides/` for overrides repositories, and `tools/` for installable tools. When [path minimization](/docs/advanced/cache-system/#path-minimization) is enabled (the default), new resources are instead stored flat at the cache root under a short hash, to keep paths short on long-path-limited toolchains.

## Example

``` bash
# Point the cache at a shared directory for every project
golem config --global cache.directory /opt/golem-cache

# Override it for the current project only
golem config cache.directory .golem-cache

# Inspect the effective configuration
golem config --list
golem config cache.directory
```

The local configuration file `<project>/.golem/config.json` is a regular file in your project tree. Commit it to share settings across a team, or add `.golem/` to your `.gitignore` to keep it as a personal, per-checkout override.
