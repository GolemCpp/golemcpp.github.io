---
title: "Architectures"
description: ""
summary: ""
date: 2026-08-20T15:02:37+02:00
draft: false
weight: 10002
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

`--arch` on [golem configure](/docs/commands/golem-configure/) and the `arch`
[condition](/docs/project-file/conditions/) name a target with the same words. The names follow LLVM
triple spelling, which is what cross toolchains accept.

## Canonical names

Note that `riscv64-lp64` and `riscv64-lp64d` are two targets, not two spellings of one. Objects built
for one ABI do not link with the other, therefore the ABI follows the instruction set after a hyphen.

| Name | Target |
| --- | --- |
| `x86_64` | 64-bit x86 |
| `i386` | 32-bit x86, 80386 baseline |
| `i486` | 32-bit x86, 80486 baseline |
| `i586` | 32-bit x86, Pentium baseline |
| `i686` | 32-bit x86, Pentium Pro baseline |
| `aarch64` | 64-bit ARM |
| `aarch64-ilp32` | 64-bit ARM with 32-bit pointers |
| `armv5-eabi` | 32-bit ARM, soft float |
| `armv6-eabihf` | 32-bit ARM, hard float |
| `armv7-eabi` | 32-bit ARM, soft float |
| `armv7-eabihf` | 32-bit ARM, hard float |
| `armv7-androideabi` | 32-bit ARM, Android's float ABI |
| `riscv32-ilp32` | 32-bit RISC-V, soft float |
| `riscv32-ilp32f` | 32-bit RISC-V, single-precision floats in registers |
| `riscv32-ilp32d` | 32-bit RISC-V, double-precision floats in registers |
| `riscv64-lp64` | 64-bit RISC-V, soft float |
| `riscv64-lp64f` | 64-bit RISC-V, single-precision floats in registers |
| `riscv64-lp64d` | 64-bit RISC-V, double-precision floats in registers |
| `ppc64le` | 64-bit PowerPC, little endian |
| `s390x` | 64-bit IBM Z |
| `mips64el-n64` | 64-bit MIPS, little endian, N64 ABI |
| `wasm32` | 32-bit WebAssembly |
| `loongarch64` | 64-bit LoongArch |

## Other accepted spellings

These are the same target written another way, so either can be used anywhere:

| Also accepted | Canonical name |
| --- | --- |
| `x86-64`, `x64`, `amd64`, `em64t` | `x86_64` |
| `arm64` | `aarch64` |
| `powerpc64le` | `ppc64le` |

`x86` and `ia32` name the 32-bit line rather than a member of it, therefore both resolve to `i686`.
Ask for `i386` to get the 80386 baseline instead.

## Asking for an architecture

A build is for whatever the compiler builds for, and `--arch` says which one to expect.
`golem configure` fails when the compiler it selected builds for another.

How a request reaches a compiler depends on the toolchain:

- **Visual Studio** ships several cross toolchains in one installation, so `--arch` picks among them
  and nothing else is needed. `--arch=aarch64` on an x64 machine uses the ARM64 build tools, which
  the Visual Studio installer offers as a component.
- **The x86 family** on gcc and clang is reached with `-m32` and `-m64`, so `--arch=i686` works on an
  x86_64 Linux only where the 32-bit userland is installed.
- **Everything else** means choosing the toolchain: name a cross compiler with
  `--check-cxx-compiler`, and Golem reads the target off it.

A name absent from the tables above is passed through and checked against the compiler like any
other, so a target Golem has never heard of still builds where the toolchain has one.
