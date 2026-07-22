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

## Recipes

### `GOLEM_RECIPES_REPOSITORIES`

Defines the ordered list of recipe sources to search.

``` text
GOLEM_RECIPES_REPOSITORIES=<repository_or_directory_1>|<repository_or_directory_2>|...
```

- Each entry may be a Git-cloneable repository URL or a local directory path.
- Local directory paths are normalized internally to `file://...` URLs.
- If a local directory is not a Git repository, Golem recopies it into the cache on each `golem resolve`.

Examples:

``` text
GOLEM_RECIPES_REPOSITORIES=/home/user/recipes
GOLEM_RECIPES_REPOSITORIES=/home/user/recipes|https://github.com/GolemCpp/recipes.git
```

## Overrides

### `GOLEM_OVERRIDES_REPOSITORY`

Defines a repository or local directory containing `overrides.json`.

``` text
GOLEM_OVERRIDES_REPOSITORY=<repository_or_directory>
```

- The value may be a Git-cloneable repository URL or a local directory path.
- Local directory paths are normalized internally to `file://...` URLs.
- If the local directory is not a Git repository, Golem recopies it into the cache on each `golem resolve`.

Example:

``` text
GOLEM_OVERRIDES_REPOSITORY=/home/user/overrides
```

### `GOLEM_OVERRIDES_CONFIGURATION`

Defines the path to a `overrides.json` file directly.

``` text
GOLEM_OVERRIDES_CONFIGURATION=/home/user/overrides.json
```
