# dontaruffin.com — Site Fix Spec
**Repo:** `unique-portfolio` (Astro)
**Date:** June 2026
**Scope:** Client-conversion audit fixes — 10 items, prioritized

---

## Context

The site currently routes visitors toward products (Solon AI, QuIDE) instead of freelance services. These fixes reorient the homepage and services page toward potential clients, remove internal language that shouldn't be public, and fix broken/stale content.

Work through items in priority order. Each item has a location, the problem, and the exact fix.

---

## P0 — Fix Immediately (Live Errors / Trust Damage)

### 1. Remove "$5K MRR" from About copy

**File:** `src/pages/index.astro` (or equivalent About section component)
**Find:** The sentence containing `$5K MRR` in the About section body copy.
**Fix:** Delete that sentence entirely. The paragraph should end after the description of what you're currently working on. No replacement needed.

---

### 2. Fix or remove BarQode project card

**File:** Wherever project cards are defined — likely `src/data/projects.ts` or inline in `src/pages/index.astro`
**Problem:** BarQode has no live link and no code link. It renders as a dead card.
**Fix (Option A — preferred):** Remove BarQode from the featured projects array entirely.
**Fix (Option B):** If you want to keep it, add a `status: "archived"` flag and render the card with a muted style and an "Archived" badge instead of CTA links. Do not leave it with no links.

---

## P1 — High Priority (Client Conversion)

### 3. Swap hero CTAs

**File:** Hero section of `src/pages/index.astro`
**Current order:**
```
Primary CTA → "View My Work" → href="#work"
Secondary CTA → "Explore My Mind →" → href="/garden"
```
**Fix:** Swap to:
```
Primary CTA → "Work With Me" → href="/services"
Secondary CTA → "View My Work" → href="#work"
```
Remove the Garden CTA from the hero entirely. The garden belongs in the nav and footer — not competing for the hero's primary action.

---

### 4. Remove "Currently crafting Solon AI" from hero subtext and footer

**Hero subtext** (`src/pages/index.astro`):
Find the paragraph under the H1 that says "Currently crafting Solon AI — an AI-powered code review tool." Remove that sentence. The paragraph should stand on its own with the general positioning statement.

**Footer** (likely `src/components/Footer.astro` or similar):
Find the line "Currently crafting Solon AI." under the site description in the footer.
Replace with: `Full-stack engineer available for projects.`

Do the same on the services page footer if it's a shared component (it should be).

---

### 5. Add CTA bridge between Work section and Garden section on homepage

**File:** `src/pages/index.astro`
**Location:** Between the `#work` section (Selected Projects) and the Digital Garden section.
**Add:** A simple full-width CTA block. Suggested copy:

```
Interested in working together?
See how I can help → /services
```

Style it as a minimal divider-CTA, consistent with the existing neo-brutalist aesthetic — no card, no background. Just the line of text with a link, separated from the sections above and below by whitespace and a thin rule if needed.

---

### 6. Add a contact form to the services page

**File:** `src/pages/services.astro`
**Location:** Replace (or supplement) the "Ready to ship something together?" section's mailto CTAs.

**Form fields:**
- Name (text, required)
- Email (email, required)
- Which service? (select: Quick Sprint / Website Build / Research + Build / Not sure yet)
- Tell me about your project (textarea, required)
- Submit button: "Send it →"

**Implementation:** Use [Netlify Forms](https://docs.netlify.com/forms/setup/) (`netlify` attribute on the form tag) if the site is deployed on Netlify, or [Formspree](https://formspree.io/) if not. Check `astro.config.mjs` or `netlify.toml` to confirm deployment target.

Keep the two mailto CTA links above the form as fallbacks. They can stay — some people prefer email. The form is additive.

Do not use a `<form>` tag with JS-only submission without a fallback — this audience includes non-technical clients.

---

## P2 — Medium Priority (Trust + UX)

### 7. Expand FAQ on services page

**File:** `src/pages/services.astro`
**Location:** FAQ section (currently 3 questions)
**Add 3 more questions:**

```
Q: Will I own the code when the project is done?
A: Yes. Everything built for you is yours — full code access, no lock-in.
    If we use third-party services (hosting, CMS, etc.), I'll make sure you
    have your own accounts with full admin access.

Q: What if I need changes after launch?
A: Small refinements during the final review phase are included. For changes
    after handoff, I offer Quick Sprints — so if something needs adjusting a
    month later, we can scope it quickly and move.

Q: Do you work with non-technical clients?
A: Yes, and I prefer it when the product vision is strong even if the
    technical knowledge isn't. I'll translate everything into plain language,
    use Loom for walkthroughs, and make sure you're never confused about
    what's been built or why.
```

Match the existing accordion style.

---

### 8. Add one line of social proof to services page

**File:** `src/pages/services.astro`
**Location:** Inside the "Why work with me" section, after the three bullet attributes.
**Add a simple pull quote block.** If you have a real quote from anyone (fellowship peer, past client, collaborator), use it. If not, use a project-outcome line:

```
"QuIDE went from concept to deployed IDE with AI integration in one build
cycle — research-first, no wasted motion."
— Two19 Fellowship, Research + Build case study
```

Style: minimal blockquote, left border accent, no heavy card treatment.

---

## P3 — Low Priority (Polish)

### 9. Update footer copyright date

**File:** Footer component (shared)
**Find:** `Lancaster, PA // May 2026`
**Replace:** `Lancaster, PA // June 2026`

Also check if the copyright year is hardcoded: `© 2026 Donta'.` — if so, make it dynamic:
```astro
© {new Date().getFullYear()} Donta'. Crafted with intention.
```

---

### 10. Hide or update "Updated" dates on Garden index cards

**File:** `src/pages/garden/index.astro` or the card component it uses
**Problem:** All six notes show "Updated Dec 2025" — 6 months stale. This undercuts the "actively learning" signal.

**Fix (Option A — preferred):** Remove the "Updated [date]" label from the garden card component entirely. The content still exists and reads well without the timestamp.
**Fix (Option B):** If dates are important to the design, add a new note (even a short one on any topic) so at least one card shows a 2026 date.

Do not just change the dates in the data — that's misleading.

---

## Validation Checklist

After all changes are made, check these before pushing:

- [ ] "$5K MRR" is gone from About section
- [ ] BarQode card either removed or visually marked as archived
- [ ] Hero primary CTA goes to `/services`
- [ ] "Currently crafting Solon AI" removed from hero subtext and footer
- [ ] CTA bridge exists between Work and Garden sections on homepage
- [ ] Contact form works end-to-end on services page (submit and receive)
- [ ] 3 new FAQ answers are visible and accordion toggles correctly
- [ ] Social proof block renders correctly on services page
- [ ] Footer date is June 2026 (or dynamic)
- [ ] Garden "Updated" dates either removed or a 2026 note exists
- [ ] Run on mobile — all CTAs are tappable, form is usable
- [ ] No broken links anywhere (check BarQode specifically if kept)

---

## Notes for Claude Code

- This is an Astro repo (`unique-portfolio`). Components are likely in `src/components/`, pages in `src/pages/`.
- The site uses a neo-brutalist aesthetic — don't introduce new design patterns. Match what exists.
- Do not touch anything in the QuIDE or Solon AI repos. This spec is portfolio-only.
- If a component is shared between pages (footer, nav), edit it once in the component file — not in each page.
- Form implementation: check deployment target first before choosing Netlify Forms vs Formspree.
- Commit in logical groupings: P0 items first, then P1, then P2/P3. Don't batch everything into one commit.
