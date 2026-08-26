---
title: "Getting Started"
description: ""
summary: ""
date: 2026-01-18T13:12:16+01:00
draft: false
weight: 102
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

## Installing Golem

**Requirements:** Python 3.10 or later, Git

Using **pipx** (recommended, creates a virtual environment):

```bash
pipx install golemcpp

# Or install it for all users
pipx install --global golemcpp
```

Alternatively, using **pip**:

```bash
pip install golemcpp
```

Since Golem is evolving fast, to upgrade it run:

```bash
# When using pipx
pipx upgrade golemcpp

# When using pipx for all users
pipx upgrade --global golemcpp

# When using pip
pip install --upgrade golemcpp
```

## First project

Everything starts with `golemfile.py`. Create it at the root of your project directory.

Here is an example to compile a **Hello World** program:

```python {title="golemfile.py"}
def configure(project):
    project.program(name='hello',
                    source=['src'])
```

The project variable is the entry point to declare dependencies, libraries and programs that make up the project.

- `'hello'` is the name of the program being compiled (e.g. `hello.exe` or `hello-debug.exe`)
- `'src'` is the directory where all source files are expected to be found (recursively) for 'hello'

```cpp {title="src/main.cpp"}
#include <iostream>
int main()
{
    std::cout << "Hello World!\n";
    return EXIT_SUCCESS;
}
```

Have a look at the full example in [examples/hello](https://github.com/GolemCpp/golem/tree/main/examples/hello).

### Building the project

To build the program, run:

```bash
# For a debug build
golem configure --variant=debug

# Or, for a release build
golem configure --variant=release

# In both cases, continue with
golem build
```

The built artifacts are located in `build/bin`.

Debug artifacts are suffixed with **"-debug"** by default.
