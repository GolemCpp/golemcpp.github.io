---
title: "Sources, not Packages"
description: "Golem requires no package registry. How source identities, recipes and cookbooks take its place, and what a cookbook still offers a publisher."
summary: ""
date: 2026-09-10T20:37:39+02:00
draft: false
weight: 103
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

A package manager usually comes with a registry: one namespace, one name per project, the project's author publishing releases into it, and the registry deciding where the bytes come from. Names are unique because a single index owns them, and a name is the only way in.

Golem requires none of that. **It takes a decentralized approach instead.**

## Golem's concepts

To explain this alternative approach, three words stay apart in place of "package". A **dependency** is what a project declares. A **source** is the external library a project depends on, needing no central authority to declare it. A **source identity** is the neutral name Golem composes to refer to that source.

A **source** can have multiple **locations** to fetch it from. These locations may rely on Git, or not, have different hosts, or can be local directories. The shapes one may take are in [Source locations](/docs/reference/source-locations/).

From a **location**, Golem composes a **source identity**. E.g. `https://github.com/nlohmann/json.git` composes `@json@nlohmann@github.com`. The full grammar is in [Source identities](/docs/reference/source-identities/).

Multiple **locations** mean multiple **source identities**, sharing the fields they have in common. E.g. `@json@nlohmann@github.com` and `@json@nlohmann@gitlab.com` share `@json@nlohmann`, and a fork at `https://github.com/myorg/json.git` shares only `@json`. A consumer project writes that shared part to refer to the **source** regardless of where it comes from.

Finally, **cookbooks** hold **recipes** that declare the **locations** where a **source** can be found, or supply a compatibility layer for a library unaware of Golem. Here, **source identities** identify recipes and allow a consumer project to use them seamlessly. A **cookbook** chooses which short **source identities** it serves, and only has to be unambiguous within itself. No central authority is needed.

## No registry required

A library becomes buildable by gaining a `golemfile.py` in its own repository, and nothing is pushed anywhere for a project to depend on it. Naming the library by its remote URL in a consumer project is enough.

```python
project.dependency(
    location="https://github.com/example/library.git"
    # this library ships its own golemfile.py
    # the location composes to @library@example@github.com
)

project.program(
    ...,
    deps=["@library"] # matches the identity composed above
)

# but, declaring explicitly the dependency is often not needed

project.program(
    ...,
    deps=["https://github.com/example/library.git"]
    # this shape declares it implicitly
)
```

Every parameter a dependency accepts is in [Definitions](/docs/project-file/definitions/#dependency).

## A registry that may only be a compatibility layer

If the library doesn't provide a `golemfile.py`, a [recipe](/docs/advanced/recipes/) in a [cookbook](/docs/advanced/recipes/) supplies one. The recipe directory is named after the **source identity**, and it holds the project file the library doesn't ship:

```text
my-cookbook/
├── @library@example@github.com/
│   └── golemfile.py
└── README.md
```

```python
# my-cookbook/@library@example@github.com/golemfile.py
# paths are relative to the fetched source

def configure(project):
    project.library(name="library", includes=["include"], source=["src"])
    project.export(name="library", includes=["include"])
```

The consumer project is unchanged. It still names the library by its remote URL, and Golem composes `@library@example@github.com` from it to find the recipe. Nothing in the consumer records that a recipe was involved.

## A registry that may only declare where to find the source code

Independently of whether a project file is provided to help build a dependency, a [cookbook](/docs/advanced/recipes/) can also map an identity to a location to let a consumer project know where to fetch the source. The recipe's manifest `recipe.json` holds this information.

Here the library ships its own `golemfile.py`, so the recipe carries no project file at all:

```text
my-cookbook/
└── @library/
    └── recipe.json
```

```json
{
  "version": 1,
  "locator": "https://github.com/example/library.git"
}
```

The recipe's directory name may be named at any qualification the locator composes, so `@library` serves as well as `@library@example@github.com`.

A consumer now names the identity, and the URL appears nowhere in its project file:

```python
project.program(
    ...,
    deps=["@library"] # the recipe declares where to fetch it
)
```

A manifest may also declare `mirrors`, the other locators the same source is reachable at. See [Source locators](/docs/advanced/recipes/#source-locators).

Specifically to the default cookbook, a **library publisher** has a reason to ask for a recipe entry even after shipping a `golemfile.py`. Indeed, since the manifest names the official remotes, a consumer referring to the library by identity changes nothing when those remotes move.

## A registry that is not a single index

There is a default cookbook, but a project may rely on multiple cookbooks.

Combining cookbooks allows building a project that relies on mixed public and private dependencies.

```bash
GOLEM_COOKBOOKS_LOCATIONS=git+https://github.com/GolemCpp/recipes.git#v2|directory+/home/user/my-cookbook
```

```text
/home/user/my-cookbook/
├── @json/          shadows the default cookbook's json recipe
│   └── recipe.json points at the company fork
└── @internal/
    ├── golemfile.py
    └── recipe.json
```

Cookbooks are layered in the order they are listed and the **last** one holding a recipe wins, so this project builds `@json` from the fork and `@internal` from a repository the default cookbook has never heard of, while every other source falls back to the default cookbook. Neither cookbook knows about the other, and no index is shared between them.

Each cookbook entry is a [source location](/docs/reference/source-locations/), and the same list is available as the `cookbooks.locations` setting. See [golem config](/docs/commands/golem-config/). Layering, and how a recipe inherits from the one it shadows rather than replacing it, are in [Custom cookbooks](/docs/advanced/recipes/#custom-cookbooks).

## Where conflicts go

Two dependencies asking for one source at different versions is the question a package manager answers with resolution rules. Golem answers it with [`overrides.json`](/docs/advanced/dependencies/), a file that says how a source resolves across the whole dependency tree, whoever asked for it.
