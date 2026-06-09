# Publishing to the Digital Garden from Obsidian

This site's garden is driven by markdown files in `src/content/notes/`. Drop a
note in that folder with the right frontmatter, push to `main`, and Vercel
auto-deploys it — a card appears on `/garden` and a detail page at
`/garden/<slug>`. With Obsidian Git auto-sync (below), the push is automatic, so
the flow is: **write a note → it's live a minute later.**

---

## One-time setup

### 1. Open the repo as your Obsidian vault

Clone this repo locally and open the **repo root folder** as a vault in Obsidian
(Open folder as vault). Your garden notes live in `src/content/notes/`.

To keep Obsidian fast, exclude build/dependency folders:
**Settings → Files & Links → Excluded files** → add `node_modules`, `dist`, `.astro`.

### 2. Install the Obsidian Git plugin (auto-sync)

**Settings → Community plugins → Browse → "Obsidian Git" → Install → Enable.**

Then under the plugin's settings:

- **Vault backup interval (minutes):** `5` (auto-commits every 5 min)
- **Auto push on commit / "Commit and sync":** ON
- **Auto pull on startup:** ON (so other devices stay in sync)
- **Commit message:** anything, e.g. `garden: {{date}}`

That's it — saving a note now gets committed and pushed automatically, and Vercel
builds it.

> Note: the vault must be the repo root so the plugin can see the repo's `.git`.

### 3. (Optional) Set up the note template

A starter template lives at `templates/Garden Note.md`. To use it:

**Settings → Core plugins → Templates → enable.** Set the **template folder
location** to `templates`. Now `Insert template → Garden Note` drops the
frontmatter into a new note. (Or install the **Templater** plugin to auto-fill
`created`/`updated` dates.)

---

## Writing a note

Every published note needs frontmatter at the top:

```yaml
---
title: My Idea               # REQUIRED — the build fails without it
description: One-line hook   # optional — shown as the card excerpt
tags: [ai, research]         # optional — tag chips
status: seedling             # seedling | budding | evergreen
publish: true                # REQUIRED to go live — defaults to false
created: 2026-06-09          # optional
updated: 2026-06-09          # optional — newest sorts to the top of the grid
---

# My Idea

Your thoughts here…
```

### The two rules that matter

1. **`publish: true` to go live.** It defaults to `false`, so drafts stay hidden.
   Keep half-formed notes in the folder; flip to `true` when ready.
2. **`title` is required.**

### The URL comes from the filename

`My Idea.md` → `/garden/my-idea` (lowercased, spaces → hyphens). Rename the file
to change the URL.

---

## Linking notes (wikilinks)

Obsidian-style links work and resolve to other garden notes:

- `[[Design Engineering]]` → links to `/garden/design-engineering`
- `[[Design Engineering|see my take]]` → custom link text
- `[[Design Engineering#UX in 2026]]` → links to a heading anchor

**Images:** use standard markdown — `![alt](/path.png)` with the file in
`public/` — not Obsidian's `![[image.png]]` embed (those are left as literal text
so they don't break the asset pipeline).

---

## Quick reference

| I want to…                | Do this                                              |
|---------------------------|------------------------------------------------------|
| Publish a note            | `publish: true` in frontmatter, save (auto-pushes)   |
| Keep a draft hidden       | `publish: false` (or omit it)                        |
| Change a note's URL       | Rename the `.md` file                                |
| Link to another note      | `[[Note Title]]`                                     |
| Add an image              | `![alt](/img.png)` with the file in `public/`        |
| Mark maturity             | `status: seedling` / `budding` / `evergreen`         |
