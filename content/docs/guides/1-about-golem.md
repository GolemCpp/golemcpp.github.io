---
title: "About Golem"
description: ""
summary: ""
date: 2026-01-18T13:12:16+01:00
draft: false
weight: 101
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Golem is a cross-platform build system for C/C++ projects.

It can build projects like CMake does, or manage dependencies like Conan does. It only requires Python and Git to work.

Golem's main goal is to remove the noise in the project file, and favor the developers intents rather than the technical details when unneeded.

Here is how a **golemfile.py** looks like:

```python {title="golemfile.py"}
def configure(project):

    project.dependency(
        name="json",
        repository="https://github.com/nlohmann/json.git",
        version="^3.0.0",
        shallow=True,
    )

    project.library(
        name="mylib",
        includes=["mylib/include"],
        source=["mylib/src"],
        defines=["FOO_API_EXPORT"],
    )

    project.export(
        name="mylib",
        includes=["mylib/include"],
        defines=["FOO_API_IMPORT"]
    )

    project.program(
        name="hello",
        source=["src"],
        use=["mylib"],
        deps=["json"]
    )
```

But alternatively, you can also define an equivalent [golemfile.json](https://github.com/GolemCpp/golem/tree/main/examples/minimal/golemfile.json).

Have a look at the full example in [examples/minimal](https://github.com/GolemCpp/golem/tree/main/examples/minimal).

To learn more about how Golem started, read [Why another build system?](/blog/why-another-build-system/).
