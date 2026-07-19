---
title: "Building"
description: ""
summary: ""
date: 2026-07-19T03:04:35+02:00
draft: false
weight: 310
toc: true
sidebar:
  collapsed: false
seo:
  title: ""
  description: ""
  canonical: ""
  noindex: false
---

These commands take your project from an empty directory to a package. They are presented in the order they are expected to be called, when needed to be called.

- [golem init](/docs/commands/golem-init/) to generate a documented starter `golemfile.py`
- [golem configure](/docs/commands/golem-configure/) to configure your project
- [golem resolve](/docs/commands/golem-resolve/) to retrieve and configure dependencies (if using dependencies)
- [golem dependencies](/docs/commands/golem-dependencies/) to build dependencies (if using dependencies)
- [golem build](/docs/commands/golem-build/) to build your project
- [golem package](/docs/commands/golem-package/) to generate a package
- [golem clean](/docs/commands/golem-clean/) to clean up built object files
- [golem distclean](/docs/commands/golem-distclean/) to delete the build directory
