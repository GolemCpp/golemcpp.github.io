---
title: "Recipes"
description: ""
summary: ""
date: 2026-01-18T10:44:16+01:00
draft: false
weight: 803
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Golem aware dependencies, those having Golem project file defined at their root, can seemlessly refer to each other. But, when refering to a dependency unaware of Golem, Golem provides a recipe mechanism.

## Default recipes

**Contributions to the default recipes are very welcome!**

By default, Golem provides a [recipe repository](https://github.com/GolemCpp/recipes) to find a corresponding project file for these dependencies unaware of Golem.

Dependencies are uniquely identified by their repository URL. Their ID is constructed such as **https://github.com/nlohmann/json.git** becomes **json@com.github.nlohmann**.

A recipe repository contains directories named after these dependency IDs, and each directory contains a project file.

This is how it looks like:

``` text
.
├── boost@com.github.boostorg/
│   └── golemfile.py
├── json@com.github.nlohmann/
│   └── golemfile.py
├── spdlog@com.github.gabime/
│   └── golemfile.py
└── <etc>
    └── golemfile.py
```

> [!NOTE]+
> For now, there is no project file per version mechanism, but this is in the Roadmap.

A `golemfile.py` can use scripting to handle any build system, any situation.

## Custom recipes

To override the default Golem recipe repository, and possibly have multiple sources for recipes, define the following environment variable:

``` text
GOLEM_RECIPES_REPOSITORIES=<repository_url_1>|<reposiroty_url_2>|...
```

- `<repository_url>` Any form accepted by Git to clone the repository (including **file:///home/user/repository** for a local directory containing a Git repository)
- `|` Separator between repositories

> [!NOTE]+
> For now, there is no possibility to define a directory instead of a repository, but this is in the Roadmap.

> [!NOTE]+
> When a dependency is missing, or not building properly, it is recommended to fork the Golem [recipe repository](https://github.com/GolemCpp/recipes), make the needed changes and create a Pull Request. Contributions are very welcome!

## Writing a recipe

TODO
