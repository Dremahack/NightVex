---
name: messenger-project-bootstrap
description: Use when initializing, cloning, scaffolding, or organizing a self-hosted Tinode-based messenger project.
---

Follow the repository AGENTS.md. For an empty project:
1. Create the standard layout: server, webapp, deploy, docs, scripts.
2. Clone Tinode server into server/ if missing.
3. Clone Tinode Web into webapp/ if missing.
4. Add safe .env.example files with placeholders only.
5. Add deployment scaffolding under deploy/.
6. Do not overwrite existing folders without inspection.
7. Run only safe checks first: git status, tree/find, package/module inspection.
8. Ask approval before installing system packages or running destructive commands.
