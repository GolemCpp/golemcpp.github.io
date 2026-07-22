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

The `overrides.json` can be specified in multiple ways. By order of precedence:

1. `--overrides-configuration=<path_to_file>`

   Call golem configure with an option pointing to the file

2. `project.overrides_configuration = '<path_to_file>'`

   Define in the project file where to find the file

3. `GOLEM_OVERRIDES_CONFIGURATION=<path_to_file>`

   Define an environment variable pointing to the file

4. `project.overrides_repository = '<repository_url_or_directory>'`

   Define in the project file the repository or local directory where to find the file

5. `GOLEM_OVERRIDES_REPOSITORY=<repository_url_or_directory>`

   Define an environment variable pointing to a repository or local directory containing `overrides.json`

Local directory paths are normalized internally to `file://...` URLs. If the directory is not a Git repository, Golem recopies it into the cache on each `golem resolve`.

> [!NOTE]+
> Although useful to quickly try a `overrides.json`, it is not recommended to define it in the project file itself for most projects.
