# Core libraries

Praxis **Core** (`praxis-core`) is the shared library repository. It does **not** ship a Desktop MCPB or a role ZIP.

## What lives in Core

| Package | Role |
|---------|------|
| `@praxis/contracts` | Shared schemas and types |
| `@praxis/cli` | CLI orchestration |
| `@praxis/vcs` | Git Delivery library |
| `@praxis/jira` | Jira orchestration library |
| `@praxis/plugin-sdk` | Plugin SDK for role Skills |
| `@praxis/project-config` | `.project` loading |
| `@praxis/knowledge` | Knowledge / canon helpers |
| `@praxis/catalog` | Marketplace catalog helpers |
| `@praxis/testing` | Test utilities |

## How other products consume Core

Downstream products (`praxis-runtime`, role plugins, Marketplace) pin Core packages as **tracked `vendor/*.tgz` files** with exact versions. They do **not** import a local monorepo checkout or any monorepo path.

See each product README → *Core dependencies* and the Core repository `DEPENDENCIES.md`.

## Independent versioning

Core versions move independently of Runtime / role ZIP versions. Bumping Core requires an explicit consumer update (new vendor pin + verify), not an automatic cascade.
