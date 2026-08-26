---
title: "Introduction"
description: ""
summary: ""
date: 2026-01-18T14:30:51+01:00
draft: false
weight: 201
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

The starting point for any Golem project is the project file.

Golem currently supports 2 formats: `golemfile.py` and `golemfile.json`. Only one of them has to be created in the root directory of the project. If both are found, only `golemfile.py` is taken into account.

Here are equivalent examples illustrating their structure:

```python {title="golemfile.py"}
def configure(project):
    project.dependency(name='json',
                       repository='https://github.com/nlohmann/json.git',
                       version='^3.0.0',
                       shallow=True)

    project.library(name='mylib',
                    includes=['mylib/include'],
                    source=['mylib/src'],
                    defines=['FOO_API_EXPORT'])

    project.export(name='mylib',
                   includes=['mylib/include'],
                   defines=['FOO_API_IMPORT'])

    project.program(name='hello-minimal',
                    source=['src'],
                    use=['mylib'],
                    deps=['json'])
```

The Python version declares a `configure` function with a `project` parameter. This `project` holds the [definitions](/docs/project-file/definitions/) for [programs](/docs/project-file/definitions/#program), [libraries](/docs/project-file/definitions/#library), [exports](/docs/project-file/definitions/#export), [dependencies](/docs/project-file/definitions/#dependency) and [packages](/docs/project-file/definitions/#package).

```json {title="golemfile.json"}
{
  "dependencies": [
    {
      "name": "json",
      "repository": "https://github.com/nlohmann/json.git",
      "version": "^3.0.0",
      "shallow": true
    }
  ],
  "targets": [
    {
      "name": "mylib",
      "type": "library",
      "includes": ["mylib/include"],
      "source": ["mylib/src"],
      "defines": ["FOO_API_EXPORT"]
    },
    {
      "name": "hello",
      "type": "program",
      "source": ["src"],
      "use": ["mylib"],
      "deps": ["json"]
    }
  ],
  "exports": [
    {
      "name": "mylib",
      "includes": ["mylib/include"],
      "defines": ["FOO_API_IMPORT"]
    }
  ]
}
```

The JSON version declares the same definitions but in multiple arrays for better readability.

- `dependencies` contains all the [dependency](/docs/project-file/definitions/#dependency) definitions.
- `targets` contains all the [program](/docs/project-file/definitions/#program) and [library](/docs/project-file/definitions/#library) definitions of the project.
- `exports` contains all the [export](/docs/project-file/definitions/#export) definitions of the project, internally used by the project or meant to be used by other projects.
- `packages` contains all the [package](/docs/project-file/definitions/#package) definitions of the project.

All the definitions, except for the `package` definition, support a common set of parameters. That is, `program`, `library`, `export` and `dependency` definitions all hold a common [configuration](/docs/project-file/configurations) set, to define target names, compiler flags, linking flags, sources, headers, etc.

Also, to conditionally apply parameters on a configuration, Golem provides a simple and yet powerful [condition](/docs/project-file/conditions) mechanism.

## Examples

To learn with examples have a look at:

- <https://github.com/GolemCpp/golem/tree/main/examples>
