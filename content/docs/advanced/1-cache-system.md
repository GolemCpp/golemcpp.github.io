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

## Controlling the locations

By default, Golem stores dependencies in `~/.cache/golem`.

To control where the dependencies are being cached, define the following environment variable:

``` text
GOLEM_DEFINE_CACHE_DIRECTORIES=<path1>=<regex1>|<path2>=<regex2>|...
```

- `<path>` is a directory where the matched depencencies are stored
- `<regex>` is defining which dependency needs to be stored in <path> based on the repository URL
- `|` is the sperator between multiple cache definitions

For example, this will store all dependencies in `F:\CACHE`:

``` text
GOLEM_DEFINE_CACHE_DIRECTORIES=F:\CACHE=^.*$
```

> [!TIP]+
> One interesting use case for this feature is to be able to split the cache in different directories to separate your own dependencies from others. By separating the cache, in a CI environment it allows you to only trigger rebuilds on a specified set of dependencies.

