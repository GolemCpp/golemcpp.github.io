---
title: "golem resolve"
url: "/docs/commands/golem-resolve/"
description: ""
summary: ""
date: 2026-01-18T10:15:18+01:00
draft: false
weight: 313
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

This command resolves the version of each dependency, clones them in the cache system, and configures them.

When defining **dependencies** in the project file, this command becomes **mandatory** after `golem configure`.

This is the only command requiring a network access, although Golem can be setup to not require any network access.

Being the one command allowed to reach a remote is also what makes it the one that can change how much of a repository a cache root holds. A root fetched under one [fetch mode](/docs/reference/environment-variables/#git) and asked for under another is converted here. Every other command works with the root in the shape it is in.

When a dependency, a cookbook or an overlay is a `directory` [source](/docs/reference/environment-variables/#source-locations), `golem resolve` recopies that directory into the cache on each run, because it cannot track changes the way it tracks a Git repository.

```bash
golem resolve [options]
```

## Options

- `--only-update-dependencies-regex=<regex>`

  Allows to perform a version resolution and eventually retrieve and configure a new version of the dependencies having a repository matching the regex.

  Unmatched dependencies keep their version resolved to their previous value, but are configured too.

  This option is meant to be used after a `golem resolve` already fully resolved and configured all the needed dependencies at least once. This helps to update certain dependencies expected to have changed, e.g. when following a development branch.

  Default: Matches all the dependencies
