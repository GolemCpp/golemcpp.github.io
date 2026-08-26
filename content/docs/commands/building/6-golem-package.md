---
title: "golem package"
url: "/docs/commands/golem-package/"
description: ""
summary: ""
date: 2026-01-18T10:21:50+01:00
draft: false
weight: 316
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

This command generates the packages defined in the project file.

Outputs the packages in `build/`, or depending on `golem configure`'s `--build-dir` option: `<build_dir>/`.

```bash
golem package
```

For now, Golem can generate:

- **MSI** files for Windows with WiX
- **DMG** files for MacOS
- **DEB** files for Debian-based distributions

Golem also provides a hook mechanism for scripting purposes after a package is generated.
