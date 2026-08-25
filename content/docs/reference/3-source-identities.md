---
title: "Source Identities"
description: ""
summary: ""
date: 2026-08-25T19:00:41+02:00
draft: false
weight: 10003
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Golem names a directory after the source it holds: the recipe directory in a
[cookbook](/docs/advanced/recipes/), the cache root of a dependency, the file an
`ls-remote` answer is kept in. That name is a **source identity**, and it is
derived from the repository URL alone.

This page is the grammar. If you are writing a recipe and only need the
directory name for one library, [Recipes](/docs/advanced/recipes/) has the short
answer.

## The grammar

``` text
@<name>[=<digest>][@<owner>[=<digest>][@<host>[=<digest>][@<rooting>[=<digest>]]]]
```

| field | what it holds |
| --- | --- |
| `<name>` | The last path segment. The one field that may hold a `.`, because a repository is called `socket.io`. |
| `<owner>` | The path segments above the name, joined by `.`. Empty is written as the gap it is: `@repo@@host.xz`. |
| `<host>` | The hostname, in the order you type it. |
| `<rooting>` | What the path is relative to. Empty for the ordinary case. |

An identity leads with `@`. That is what tells a recipe from the other things a
cookbook repository holds (e.g. a `README`, an `AGENTS.md`, a `.github/`) so a
directory without one is not a recipe.

Every field is lowercase. A directory name is case-insensitive on Windows and
macOS, therefore case cannot be what tells two recipes apart.

``` text
https://github.com/nlohmann/json.git         @json@nlohmann@github.com
https://gitlab.com/group/subgroup/proj.git   @proj@group.subgroup@gitlab.com
git://git.kernel.org/pub/scm/git/git.git     @git@pub.scm.git@git.kernel.org
ftps://host.xz/repo.git                      @repo@@host.xz
```

## What is discarded

A scheme is a road to a server rather than a different server, therefore it is
not part of the identity. So is a port the scheme already implies, a `.git`
suffix a server adds by convention, and the user on an absolute URL, who says
who authenticates rather than which repository it is.

``` text
https://github.com/nlohmann/json.git
https://github.com/nlohmann/json
git://github.com/nlohmann/json.git
https://github.com:443/nlohmann/json.git
ssh://alice@github.com/nlohmann/json.git
```

All five are `@json@nlohmann@github.com`.

## What the rooting says

Most locators name a path from the one root a host has, and leave this empty.
Two forms name another root, therefore they have to say so.

| rooting | when |
| --- | --- |
| *(empty)* | An absolute path on the host. |
| `scp` | The `host:path` shorthand, with no user. |
| `scp.<user>` | The same with a user. The path hangs off **that user's home**, so the user is part of the root. |
| `drive.<letter>` | A Windows drive, which is a root beside the others rather than a directory under one. |
| `=<digest>` | A transport helper Golem cannot read a hierarchy out of. |

``` text
ssh://host.xz/repo.git      @repo@@host.xz
host.xz:repo.git            @repo@@host.xz@scp
alice@host.xz:repo.git      @repo@@host.xz@scp.alice
C:/proj/mylib               @mylib@proj@_local_@drive.c
ext::sh -c foo              @ext@@_nohost_@=3c7d39aa
```

`git@github.com:o/r.git` and `https://github.com/o/r.git` are therefore two
identities, and two cache entries. A forge serves both spellings from one store,
but a plain Git server serving `/home/git/team/proj.git` over SSH and
`/srv/git/team/proj.git` over HTTPS serves two repositories, and nothing in the
URL says which you are looking at. Merging them wrongly would put two
repositories in one cache root without saying so; keeping them apart costs a
second fetch, visibly. Use
[`url.<base>.insteadOf`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-urlltbasegtinsteadOf)
if you want one spelling everywhere.

## Local paths

A path on this machine has no host, so the host field says `_local_`.

``` text
file:///srv/git/mylib       @mylib@srv.git@_local_
file:///srv/git/mylib.git   @mylib.git@srv.git@_local_
```

The two are different identities. On a server, `repo` and `repo.git` are one
store by convention; on a filesystem they are two directory entries that may
both exist, and Golem may not merge two directories you can see side by side.

A whole `.git` segment is different: `…/mylib/.git` is the Git directory of
`…/mylib`, therefore it names the same repository.

A host really spelled `_local_` or `_nohost_` carries a digest, so it can never
be mistaken for the sentinel.

## When a digest appears

Golem spells every field with the characters a directory name may hold on every
platform it runs on. A character outside that set becomes `~`. Spelling that way
can lose what told two sources apart, therefore the field carries `=<digest>` of
what it was read from whenever it does.

The digest belongs to the field that lost something, and nothing else in the
locator reaches it.

``` text
https://gitlab.com/group.subgroup/proj.git   @proj@group~subgroup=75085152@gitlab.com
https://host.xz:8443/org/repo.git            @repo@org@host.xz=62c09d99
```

The first has a literal `.` in the owner, which is joined with `.`, so the
digest is what keeps `group.subgroup` off `group/subgroup`. The second names a
port `https` does not imply, and two ports on one host are two servers.

## Not a location, yet

An identity names a source; it does not say where to fetch it. Writing
`location='@json@nlohmann@github.com'` in a project file does not work today.
Use the repository URL. Resolving a dependency by identity through a cookbook is
on the Roadmap.
