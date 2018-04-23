# Webix Type Definitions

## Important note

This is a personal and very slowly moving project. At this point in time, only a
few components of the library have been translated to type definitions, so this
is not usable for real-life applications. If I'm honest, then I don't think this
will ever come close to covering the entire library, but if you still feel the
need to contribute, then go ahead!

---

## What is this?

This project is a replacement for the default [TypeScript](https://www.typescriptlang.org) definition file that
ships with the [Webix](https://webix.com) UI library.

## Why make a replacement?

The .d.ts file that comes with the library has a few issues. It is full of "any"
types and some interfaces and function signatures are plain wrong (looking at
webix.promise). This project aims to provide a declaration file that

* uses "any" only when it's unavoidable
* uses generic types for components that deal with data (e.g. DataStore)
* has correct definitions in place where the default does not
* understands what you pass to `webix.ui()`
